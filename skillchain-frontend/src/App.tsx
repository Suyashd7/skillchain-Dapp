import { Box, Heading, Button, Input, VStack, Container, Text, useToast, Flex, Spacer, HStack, Spinner, SimpleGrid } from '@chakra-ui/react'
import { useState, useEffect, useRef } from 'react'
import { ethers } from 'ethers'
import { keccak_256 } from 'js-sha3'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import SubmitProject from './pages/SubmitProject'
import ExploreProjects from './pages/ExploreProjects' 
import MyProjects from './pages/MyProjects'
import Navbar from './components/Navbar'

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // TODO: Replace with deployed contract address
const CONTRACT_ABI = [
  "function submitProject(string _name, string _githubLink, string[] memory _tags) public returns (uint256)",
  "function getTotalProjects() public view returns (uint256)",
  "function getProject(uint256 tokenId) public view returns (string memory, string memory, address, uint256, string[] memory)",
  "function getVoteCount(uint256 tokenId) public view returns (uint256)",
  "function upvoteProject(uint256 tokenId) public",
  "function storeFileHash(uint256 tokenId, bytes32 fileHash) public",
  "function getFileHash(uint256 tokenId) public view returns (bytes32)",
];

function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [projectName, setProjectName] = useState('')
  const [githubLink, setGithubLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [fetching, setFetching] = useState(false)
  const [voteCounts, setVoteCounts] = useState<{ [tokenId: number]: number }>({})
  const [voting, setVoting] = useState<{ [tokenId: number]: boolean }>({})
  const [voted, setVoted] = useState<{ [tokenId: number]: boolean }>({})
  const [tags, setTags] = useState('')
  const [search, setSearch] = useState('')
  const [filteredProjects, setFilteredProjects] = useState<any[]>([])
  const [fileHashes, setFileHashes] = useState<{ [tokenId: number]: string }>({})
  const [uploading, setUploading] = useState<{ [tokenId: number]: boolean }>({})
  const toast = useToast()
  const submissionRef = useRef<HTMLDivElement>(null)

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setWalletAddress(accounts[0])
        toast({ title: 'Wallet connected!', status: 'success', duration: 2000 })
      } catch (error) {
        toast({ title: 'User rejected wallet connection', status: 'error' })
      }
    } else {
      toast({ title: 'MetaMask is not installed!', status: 'error' })
    }
  }

  const submitProject = async () => {
    if (!walletAddress) {
      toast({ title: 'Please connect your wallet first.', status: 'warning' })
      return
    }
    if (!projectName || !githubLink) {
      toast({ title: 'Please fill in all fields.', status: 'warning' })
      return
    }
    setLoading(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      const tagArr = tags.split(',').map(t => t.trim()).filter(Boolean)
      const tx = await contract.submitProject(projectName, githubLink, tagArr)
      await tx.wait()
      toast({ title: 'Project submitted!', status: 'success' })
      setProjectName('')
      setGithubLink('')
      setTags('')
      fetchProjects()
    } catch (err) {
      toast({ title: 'Transaction failed.', status: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const fetchProjects = async () => {
    setFetching(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
      const total = await contract.getTotalProjects()
      const proms = []
      for (let i = 1; i <= total; i++) {
        proms.push(
          contract.getProject(i).then(
            (p: any) => [p[0]?.toString(), p[1]?.toString(), p[2]?.toString(), p[3]?.toString(), p[4]?.map((tag: any) => tag.toString())]
          ).catch(() => null)
        )
      }
      const results = await Promise.all(proms)
      setProjects(results.filter(Boolean))
    } catch (err) {
      toast({ title: 'Failed to fetch projects.', status: 'error' })
    } finally {
      setFetching(false)
    }
  }

  const fetchVoteCounts = async (tokenIds: number[]) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
      const proms = tokenIds.map(id => contract.getVoteCount(id).then((v: any) => [id, Number(v)]).catch(() => [id, 0]))
      const results = await Promise.all(proms)
      const counts: { [tokenId: number]: number } = {}
      results.forEach(([id, count]) => { counts[id] = count })
      setVoteCounts(counts)
    } catch {}
  }

  const fetchFileHashes = async (tokenIds: number[]) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
      const proms = tokenIds.map(id => contract.getFileHash(id).then((h: any) => [id, h]).catch(() => [id, '']))
      const results = await Promise.all(proms)
      const hashes: { [tokenId: number]: string } = {}
      results.forEach(([id, hash]) => { hashes[id] = hash })
      setFileHashes(hashes)
    } catch {}
  }

  const handleUpvote = async (tokenId: number) => {
    setVoting(v => ({ ...v, [tokenId]: true }))
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      const tx = await contract.upvoteProject(tokenId)
      await tx.wait()
      toast({ title: 'Voted!', status: 'success' })
      setVoted(v => ({ ...v, [tokenId]: true }))
      fetchVoteCounts([tokenId])
    } catch (err) {
      toast({ title: 'Vote failed or already voted.', status: 'error' })
    } finally {
      setVoting(v => ({ ...v, [tokenId]: false }))
    }
  }

  const handleFileUpload = async (tokenId: number, file: File) => {
    setUploading(u => ({ ...u, [tokenId]: true }))
    try {
      const arrayBuffer = await file.arrayBuffer()
      const hashHex = keccak_256(new Uint8Array(arrayBuffer))
      const hashBytes32 = '0x' + hashHex
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      const tx = await contract.storeFileHash(tokenId, hashBytes32)
      await tx.wait()
      toast({ title: 'File hash stored on-chain!', status: 'success' })
      fetchFileHashes([tokenId])
    } catch (err) {
      toast({ title: 'Failed to store file hash.', status: 'error' })
    } finally {
      setUploading(u => ({ ...u, [tokenId]: false }))
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    // Fetch vote counts for all projects
    if (projects.length > 0) {
      const ids = projects.map((_, idx) => idx + 1)
      fetchVoteCounts(ids)
      fetchFileHashes(ids)
    }
  }, [projects])

  useEffect(() => {
    // Filter projects by search (tag, wallet, github)
    if (!search.trim()) {
      setFilteredProjects(projects)
      return
    }
    const s = search.trim().toLowerCase()
    setFilteredProjects(projects.filter(p =>
      p[0].toLowerCase().includes(s) || // name
      p[1].toLowerCase().includes(s) || // github
      p[2].toLowerCase().includes(s) || // owner
      (Array.isArray(p[4]) && p[4].some((tag: string) => tag.toLowerCase().includes(s)))
    ))
  }, [search, projects])

  const scrollToSubmission = () => {
    submissionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/submit" element={<SubmitProject />} />
        <Route path="/explore" element={<ExploreProjects />} />
        <Route path="/my-projects" element={<MyProjects />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App 