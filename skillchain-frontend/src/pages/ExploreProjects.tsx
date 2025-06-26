import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Input,
  SimpleGrid,
  Text,
  Spinner,
  Badge,
  Link,
  Button,
  Select,
  Flex,
  useBreakpointValue
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '../config/contract';
import { domainConfigs, Domain } from '../config/domains';
import { Project } from '../types';

const MotionBox = motion(Box);

const CONTRACT_ABI = [
  'function getTotalProjects() public view returns (uint256)',
  'function getProject(uint256 tokenId) public view returns (string memory, string memory, address, uint256, string[] memory)',
  'function getVoteCount(uint256 tokenId) public view returns (uint256)',
  'function upvoteProject(uint256 tokenId) public',
];

const ExploreProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'votes'>('newest');
  const [voting, setVoting] = useState<{ [tokenId: number]: boolean }>({});

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const total = await contract.getTotalProjects();
      
      const fetchedProjects: Project[] = [];
      
      for (let i = 1; i <= total; i++) {
        try {
          const [name, githubLink, owner, timestamp, tags] = await contract.getProject(i);
          const votes = await contract.getVoteCount(i);
          
          // Determine domain from tags
          const domain = tags.find((tag: string) => 
            Object.values(Domain).includes(tag as Domain)
          ) as Domain || Domain.DEVELOPER;
          
          fetchedProjects.push({
            tokenId: i,
            name,
            githubLink,
            owner,
            timestamp: Number(timestamp),
            tags: tags.filter((tag: string) => tag !== domain),
            domain,
            votes: Number(votes)
          });
        } catch (error) {
          console.error(`Error fetching project ${i}:`, error);
        }
      }
      
      setProjects(fetchedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
    setLoading(false);
  };

  const handleVote = async (tokenId: number) => {
    setVoting(prev => ({ ...prev, [tokenId]: true }));
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      const tx = await contract.upvoteProject(tokenId);
      await tx.wait();
      
      // Refresh projects to get updated vote count
      fetchProjects();
    } catch (error) {
      console.error('Voting error:', error);
    } finally {
      setVoting(prev => ({ ...prev, [tokenId]: false }));
    }
  };

  const filteredAndSortedProjects = projects
    .filter(project => {
      const matchesSearch = 
        project.name.toLowerCase().includes(filter.toLowerCase()) ||
        project.githubLink?.toLowerCase().includes(filter.toLowerCase()) ||
        project.owner.toLowerCase().includes(filter.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()));
      
      const matchesDomain = domainFilter === 'all' || project.domain === domainFilter;
      
      return matchesSearch && matchesDomain;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.timestamp - a.timestamp;
        case 'oldest':
          return a.timestamp - b.timestamp;
        case 'votes':
          return (b.votes || 0) - (a.votes || 0);
        default:
          return 0;
      }
    });

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <Box minH="100vh" position="relative">
      <Box className="animated-bg" />
      
      <Container maxW="container.xl" py={{ base: 8, md: 16 }}>
        <MotionBox
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <VStack spacing={8}>
            {/* Header */}
            <VStack spacing={4} textAlign="center">
              <Heading 
                size={{ base: "lg", md: "xl" }} 
                color="white" 
                fontWeight="bold"
              >
                Explore Projects
              </Heading>
              <Text 
                fontSize={{ base: "md", md: "lg" }} 
                color="rgba(255, 255, 255, 0.8)" 
                maxW="2xl"
              >
                Discover verified projects and achievements from our community
              </Text>
            </VStack>

            {/* Filters */}
            <Box className="glass-card" p={6} w="100%">
              <VStack spacing={4}>
                <Flex 
                  direction={{ base: "column", md: "row" }} 
                  gap={4} 
                  w="100%" 
                  align={{ base: "stretch", md: "center" }}
                >
                  <Input
                    placeholder="Search projects, tags, or addresses..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="glass-input"
                    size="lg"
                    flex={1}
                  />
                  
                  <Select
                    value={domainFilter}
                    onChange={(e) => setDomainFilter(e.target.value)}
                    className="glass-input"
                    size="lg"
                    w={{ base: "100%", md: "200px" }}
                  >
                    <option value="all" style={{ background: '#1a202c', color: 'white' }}>
                      All Domains
                    </option>
                    {Object.entries(domainConfigs).map(([domain, config]) => (
                      <option 
                        key={domain} 
                        value={domain}
                        style={{ background: '#1a202c', color: 'white' }}
                      >
                        {config.icon} {config.name}
                      </option>
                    ))}
                  </Select>
                  
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="glass-input"
                    size="lg"
                    w={{ base: "100%", md: "150px" }}
                  >
                    <option value="newest" style={{ background: '#1a202c', color: 'white' }}>
                      Newest
                    </option>
                    <option value="oldest" style={{ background: '#1a202c', color: 'white' }}>
                      Oldest
                    </option>
                    <option value="votes" style={{ background: '#1a202c', color: 'white' }}>
                      Most Voted
                    </option>
                  </Select>
                </Flex>
                
                <Text color="rgba(255, 255, 255, 0.7)" fontSize="sm">
                  {filteredAndSortedProjects.length} project{filteredAndSortedProjects.length !== 1 ? 's' : ''} found
                </Text>
              </VStack>
            </Box>

            {/* Projects Grid */}
            {loading ? (
              <VStack spacing={4}>
                <Spinner size="xl" color="white" />
                <Text color="rgba(255, 255, 255, 0.8)">Loading projects...</Text>
              </VStack>
            ) : (
              <SimpleGrid 
                columns={{ base: 1, md: 2, lg: 3 }} 
                spacing={6} 
                w="100%"
              >
                {filteredAndSortedProjects.length === 0 ? (
                  <Box gridColumn="1 / -1" textAlign="center" py={12}>
                    <Text color="rgba(255, 255, 255, 0.6)" fontSize="lg">
                      No projects found matching your criteria.
                    </Text>
                  </Box>
                ) : (
                  filteredAndSortedProjects.map((project, index) => {
                    const domainConfig = domainConfigs[project.domain];
                    return (
                      <MotionBox
                        key={project.tokenId}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                      >
                        <Box className="glass-card" p={6} h="100%">
                          <VStack spacing={4} align="start" h="100%">
                            {/* Header */}
                            <HStack spacing={3} w="100%">
                              <Text fontSize="2xl">{domainConfig.icon}</Text>
                              <VStack spacing={1} align="start" flex={1}>
                                <Heading size="sm" color="white" noOfLines={2}>
                                  {project.name}
                                </Heading>
                                <Badge 
                                  colorScheme="purple" 
                                  variant="subtle" 
                                  fontSize="xs"
                                >
                                  {domainConfig.name}
                                </Badge>
                              </VStack>
                            </HStack>

                            {/* Content */}
                            <VStack spacing={3} align="start" flex={1} w="100%">
                              {project.githubLink && (
                                <Link 
                                  href={project.githubLink} 
                                  color="rgba(102, 126, 234, 0.8)" 
                                  isExternal
                                  fontSize="sm"
                                  noOfLines={1}
                                  _hover={{ color: "rgba(102, 126, 234, 1)" }}
                                >
                                  {project.githubLink}
                                </Link>
                              )}
                              
                              <Text 
                                color="rgba(255, 255, 255, 0.7)" 
                                fontSize="xs"
                              >
                                Owner: {project.owner.slice(0, 6)}...{project.owner.slice(-4)}
                              </Text>
                              
                              <Text 
                                color="rgba(255, 255, 255, 0.6)" 
                                fontSize="xs"
                              >
                                {new Date(project.timestamp * 1000).toLocaleDateString()}
                              </Text>

                              {/* Tags */}
                              {project.tags.length > 0 && (
                                <Flex wrap="wrap" gap={1}>
                                  {project.tags.slice(0, 3).map((tag, idx) => (
                                    <Badge 
                                      key={idx} 
                                      colorScheme="blue" 
                                      variant="outline" 
                                      fontSize="xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                  {project.tags.length > 3 && (
                                    <Badge 
                                      colorScheme="gray" 
                                      variant="outline" 
                                      fontSize="xs"
                                    >
                                      +{project.tags.length - 3}
                                    </Badge>
                                  )}
                                </Flex>
                              )}
                            </VStack>

                            {/* Actions */}
                            <HStack spacing={2} w="100%" justify="space-between">
                              <HStack spacing={2}>
                                <Button
                                  size="sm"
                                  borderRadius="full"
                                  variant="outline"
                                  borderColor="rgba(255, 255, 255, 0.3)"
                                  color="white"
                                  _hover={{ 
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    borderColor: 'rgba(255, 255, 255, 0.5)'
                                  }}
                                  isLoading={voting[project.tokenId]}
                                  onClick={() => handleVote(project.tokenId)}
                                  leftIcon={<Text>👍</Text>}
                                >
                                  {project.votes || 0}
                                </Button>
                              </HStack>
                              
                              <Text 
                                color="rgba(255, 255, 255, 0.5)" 
                                fontSize="xs"
                              >
                                #{project.tokenId}
                              </Text>
                            </HStack>
                          </VStack>
                        </Box>
                      </MotionBox>
                    );
                  })
                )}
              </SimpleGrid>
            )}
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default ExploreProjects;