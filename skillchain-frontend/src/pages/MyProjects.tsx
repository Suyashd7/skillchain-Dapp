import { Box, Container, Heading, VStack, Text, Spinner, Tag, HStack, Link, SimpleGrid } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../components/WalletContext';
import { CONTRACT_ADDRESS } from '../config/contract';

const CONTRACT_ABI = [
  'function getProjectsOf(address user) public view returns (uint256[] memory)',
  'function getProject(uint256 tokenId) public view returns (string memory, string memory, address, uint256, string[] memory)',
];

type Project = {
  tokenId: number;
  name: string;
  githubLink: string;
  owner: string;
  timestamp: number;
  tags: string[];
};

const MyProjects = () => {
  const { walletAddress } = useWallet();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!walletAddress) {
        setProjects([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const ids = await contract.getProjectsOf(walletAddress);
        const fetched = [];
        for (let i = 0; i < ids.length; i++) {
          try {
            const [name, githubLink, owner, timestamp, tags] = await contract.getProject(ids[i]);
            fetched.push({ tokenId: ids[i], name, githubLink, owner, timestamp, tags });
          } catch {}
        }
        setProjects(fetched);
      } catch {
        setProjects([]);
      }
      setLoading(false);
    };
    fetchProjects();
  }, [walletAddress]);

  return (
    <Box minH="100vh" bg="#f8f7f4" fontFamily="'Inter', 'Poppins', sans-serif">
      <Container maxW="container.lg" py={16}>
        <VStack spacing={8} align="start">
          <Heading size="lg" color="#181818" fontWeight="bold">My Projects</Heading>
          {loading ? (
            <Spinner size="xl" color="#FFD700" />
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="100%">
              {projects.length === 0 ? (
                <Text color="#bbb">You haven't submitted any projects yet.</Text>
              ) : (
                projects.map(project => (
                  <Box key={project.tokenId} p={6} bg="#fff" borderRadius="lg" boxShadow="md" border="1.5px solid #FFD700">
                    <Heading size="md" color="#181818">{project.name}</Heading>
                    <Link href={project.githubLink} color="#0070f3" isExternal>{project.githubLink}</Link>
                    <Text color="#555" fontSize="sm">Owner: {project.owner}</Text>
                    <Text color="#888" fontSize="xs">{new Date(Number(project.timestamp) * 1000).toLocaleString()}</Text>
                    <HStack mt={2} spacing={2} wrap="wrap">
                      {project.tags.map((tag, idx) => (
                        <Tag key={idx} colorScheme="yellow" variant="subtle">{tag}</Tag>
                      ))}
                    </HStack>
                  </Box>
                ))
              )}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default MyProjects; 