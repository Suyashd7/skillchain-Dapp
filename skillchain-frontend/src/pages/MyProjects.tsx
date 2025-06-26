import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Spinner,
  SimpleGrid,
  Badge,
  Link,
  HStack,
  Button,
  useToast
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { useWallet } from '../components/WalletContext';
import { CONTRACT_ADDRESS } from '../config/contract';
import { domainConfigs, Domain } from '../config/domains';
import { Project } from '../types';

const MotionBox = motion(Box);

const CONTRACT_ABI = [
  'function getProjectsOf(address user) public view returns (uint256[] memory)',
  'function getProject(uint256 tokenId) public view returns (string memory, string memory, address, uint256, string[] memory)',
  'function getVoteCount(uint256 tokenId) public view returns (uint256)',
];

const MyProjects = () => {
  const { walletAddress, connectWallet } = useWallet();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (walletAddress) {
      fetchMyProjects();
    } else {
      setProjects([]);
      setLoading(false);
    }
  }, [walletAddress]);

  const fetchMyProjects = async () => {
    if (!walletAddress) return;
    
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      const projectIds = await contract.getProjectsOf(walletAddress);
      const fetchedProjects: Project[] = [];
      
      for (let i = 0; i < projectIds.length; i++) {
        try {
          const tokenId = Number(projectIds[i]);
          const [name, githubLink, owner, timestamp, tags] = await contract.getProject(tokenId);
          const votes = await contract.getVoteCount(tokenId);
          
          // Determine domain from tags
          const domain = tags.find((tag: string) => 
            Object.values(Domain).includes(tag as Domain)
          ) as Domain || Domain.DEVELOPER;
          
          fetchedProjects.push({
            tokenId,
            name,
            githubLink,
            owner,
            timestamp: Number(timestamp),
            tags: tags.filter((tag: string) => tag !== domain),
            domain,
            votes: Number(votes)
          });
        } catch (error) {
          console.error(`Error fetching project ${projectIds[i]}:`, error);
        }
      }
      
      setProjects(fetchedProjects.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error('Error fetching my projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch your projects. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

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

  if (!walletAddress) {
    return (
      <Box minH="100vh" position="relative" display="flex" alignItems="center" justifyContent="center">
        <Box className="animated-bg" />
        
        <Container maxW="container.sm">
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box className="glass-card" p={12} textAlign="center">
              <VStack spacing={6}>
                <Text fontSize="4xl">🔒</Text>
                <Heading size="lg" color="white">
                  Wallet Required
                </Heading>
                <Text color="rgba(255, 255, 255, 0.8)" textAlign="center">
                  Please connect your wallet to view your projects.
                </Text>
                <MotionBox
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    borderRadius="full"
                    className="premium-btn"
                    onClick={connectWallet}
                  >
                    Connect Wallet
                  </Button>
                </MotionBox>
              </VStack>
            </Box>
          </MotionBox>
        </Container>
      </Box>
    );
  }

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
                My Projects
              </Heading>
              <Text 
                fontSize={{ base: "md", md: "lg" }} 
                color="rgba(255, 255, 255, 0.8)" 
                maxW="2xl"
              >
                Your verified blockchain certificates and achievements
              </Text>
            </VStack>

            {/* Stats */}
            <Box className="glass-card" p={6} w="100%">
              <HStack justify="space-between" align="center">
                <VStack spacing={1} align="start">
                  <Text color="white" fontWeight="bold" fontSize="2xl">
                    {projects.length}
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" fontSize="sm">
                    Total Projects
                  </Text>
                </VStack>
                
                <VStack spacing={1} align="center">
                  <Text color="white" fontWeight="bold" fontSize="2xl">
                    {projects.reduce((sum, p) => sum + (p.votes || 0), 0)}
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" fontSize="sm">
                    Total Votes
                  </Text>
                </VStack>
                
                <VStack spacing={1} align="end">
                  <Text color="white" fontWeight="bold" fontSize="2xl">
                    {new Set(projects.map(p => p.domain)).size}
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" fontSize="sm">
                    Domains
                  </Text>
                </VStack>
              </HStack>
            </Box>

            {/* Projects Grid */}
            {loading ? (
              <VStack spacing={4}>
                <Spinner size="xl" color="white" />
                <Text color="rgba(255, 255, 255, 0.8)">Loading your projects...</Text>
              </VStack>
            ) : (
              <SimpleGrid 
                columns={{ base: 1, md: 2, lg: 3 }} 
                spacing={6} 
                w="100%"
              >
                {projects.length === 0 ? (
                  <Box gridColumn="1 / -1" textAlign="center" py={12}>
                    <VStack spacing={4}>
                      <Text fontSize="4xl">📝</Text>
                      <Heading size="md" color="white">
                        No Projects Yet
                      </Heading>
                      <Text color="rgba(255, 255, 255, 0.6)" textAlign="center">
                        You haven't submitted any projects yet. Start by creating your first verified certificate!
                      </Text>
                      <MotionBox
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="lg"
                          borderRadius="full"
                          className="premium-btn"
                          onClick={() => window.location.href = '/submit'}
                        >
                          Submit Your First Project
                        </Button>
                      </MotionBox>
                    </VStack>
                  </Box>
                ) : (
                  projects.map((project, index) => {
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
                                  variant="solid" 
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
                                color="rgba(255, 255, 255, 0.6)" 
                                fontSize="xs"
                              >
                                Created: {new Date(project.timestamp * 1000).toLocaleDateString()}
                              </Text>

                              {/* Tags */}
                              {project.tags.length > 0 && (
                                <HStack spacing={1} wrap="wrap">
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
                                </HStack>
                              )}
                            </VStack>

                            {/* Footer */}
                            <HStack spacing={2} w="100%" justify="space-between">
                              <HStack spacing={2}>
                                <Text color="rgba(255, 255, 255, 0.8)" fontSize="sm">
                                  👍 {project.votes || 0} votes
                                </Text>
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

export default MyProjects;