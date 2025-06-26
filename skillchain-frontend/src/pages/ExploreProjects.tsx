import { Box, Container, Heading, VStack, Input, SimpleGrid, Text, Spinner, Tag, HStack, Link } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '../config/contract';

const CONTRACT_ABI = [
  'function getTotalProjects() public view returns (uint256)',
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

const ExploreProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const total = await contract.getTotalProjects();
        const fetched = [];
        for (let i = 1; i <= total; i++) {
          try {
            const [name, githubLink, owner, timestamp, tags] = await contract.getProject(i);
            fetched.push({ tokenId: i, name, githubLink, owner, timestamp, tags });
          } catch {}
        }
        setProjects(fetched);
      } catch {
        setProjects([]);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.githubLink.toLowerCase().includes(filter.toLowerCase()) ||
    p.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <Box minH="100vh" bg="#f8f7f4" fontFamily="'Inter', 'Poppins', sans-serif">
      <Container maxW="container.lg" py={16}>
        <VStack spacing={8} align="start">
          <Heading size="lg" color="#181818" fontWeight="bold">Explore Projects</Heading>
          <Input placeholder="Filter by name, tag, or GitHub..." size="lg" bg="#fff" borderRadius="md" color="#181818" border="1.5px solid #E5E4E2" _focus={{ borderColor: '#FFD700' }} value={filter} onChange={e => setFilter(e.target.value)} />
          {loading ? (
            <Spinner size="xl" color="#FFD700" />
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="100%">
              {filteredProjects.length === 0 ? (
                <Text color="#bbb">No projects to display yet.</Text>
              ) : (
                filteredProjects.map(project => (
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

export default ExploreProjects; 