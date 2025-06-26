import { Box, Button, Container, Heading, Input, VStack, useToast, InputGroup, InputLeftAddon, HStack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../components/WalletContext';
import { CONTRACT_ADDRESS } from '../config/contract';

const CONTRACT_ABI = [
  "function submitProject(string _name, string _githubLink, string[] memory _tags) public returns (uint256)",
];

// Helper to validate GitHub repo URL
const isValidGithubRepo = (url: string) => {
  // Strict: https://github.com/user/repo (no .git, no trailing slash)
  const regex = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
  return regex.test(url);
};

const SubmitProject = () => {
  const [projectName, setProjectName] = useState('');
  const [githubUser, setGithubUser] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { walletAddress, connectWallet } = useWallet();

  const handleSubmit = async () => {
    if (!walletAddress) {
      toast({ title: 'Please connect your wallet first.', status: 'warning' });
      return;
    }
    if (!projectName || !githubUser || !githubRepo) {
      toast({ title: 'Please fill in all fields.', status: 'warning' });
      return;
    }
    // Construct the full GitHub link
    const githubLink = `https://github.com/${githubUser}/${githubRepo}`;
    if (!isValidGithubRepo(githubLink)) {
      toast({ title: 'Please enter a valid GitHub username and repository name.', status: 'error' });
      return;
    }
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const tx = await contract.submitProject(projectName, githubLink, tagArray);
      await tx.wait();
      toast({ title: 'Project submitted!', status: 'success' });
      setProjectName('');
      setGithubUser('');
      setGithubRepo('');
      setTags('');
    } catch (err) {
      toast({ title: 'Transaction failed.', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="#f8f7f4" display="flex" alignItems="center" justifyContent="center" fontFamily="'Inter', 'Poppins', sans-serif">
      <Container maxW="container.sm" py={16}>
        <VStack spacing={8} align="center">
          <Heading size="lg" color="#181818" fontWeight="bold">Submit a New Project</Heading>
          <VStack spacing={4} align="stretch" w="100%">
            <Input placeholder="Project Name" size="lg" bg="#fff" borderRadius="md" color="#181818" border="1.5px solid #E5E4E2" _focus={{ borderColor: '#FFD700' }} value={projectName} onChange={e => setProjectName(e.target.value)} />
            <Text fontWeight="medium" color="#181818">GitHub Repository</Text>
            <InputGroup size="lg">
              <InputLeftAddon bg="#f8f7f4" color="#888" border="1.5px solid #E5E4E2" borderRight={0} fontWeight="semibold">
                https://github.com/
              </InputLeftAddon>
              <Input
                placeholder="username"
                bg="#fff"
                borderRadius="0"
                borderLeft={0}
                borderRight={0}
                color="#181818"
                borderTop="1.5px solid #E5E4E2"
                borderBottom="1.5px solid #E5E4E2"
                borderLeftWidth={0}
                borderRightWidth={0}
                value={githubUser}
                onChange={e => setGithubUser(e.target.value)}
                style={{ width: '30%' }}
              />
              <InputLeftAddon bg="#f8f7f4" color="#888" border="1.5px solid #E5E4E2" borderLeft={0} borderRight={0} px={2} fontWeight="semibold" minW={0}>
                /
              </InputLeftAddon>
              <Input
                placeholder="repo"
                bg="#fff"
                borderRadius="0"
                borderLeft={0}
                color="#181818"
                borderTop="1.5px solid #E5E4E2"
                borderBottom="1.5px solid #E5E4E2"
                borderLeftWidth={0}
                value={githubRepo}
                onChange={e => setGithubRepo(e.target.value)}
                style={{ width: '40%' }}
              />
            </InputGroup>
            {/* Live preview of the full link */}
            {githubUser && githubRepo && (
              <Box color="#888" fontSize="sm" mb={2}>
                Preview: <a href={`https://github.com/${githubUser}/${githubRepo}`} target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3' }}>{`https://github.com/${githubUser}/${githubRepo}`}</a>
              </Box>
            )}
            <Input placeholder="Tags (comma separated, e.g. Solidity,AI,Frontend)" size="lg" bg="#fff" borderRadius="md" color="#181818" border="1.5px solid #E5E4E2" _focus={{ borderColor: '#FFD700' }} value={tags} onChange={e => setTags(e.target.value)} />
            <Button size="lg" borderRadius="full" bg="#fff" color="#181818" border="1.5px solid #FFD700" _hover={{ bg: '#FFD700', color: '#181818' }} boxShadow="0 2px 16px 0 #FFD70033" isLoading={loading} onClick={handleSubmit}>Submit</Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default SubmitProject; 