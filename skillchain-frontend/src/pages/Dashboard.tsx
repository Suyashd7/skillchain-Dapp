import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useBreakpointValue
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../components/WalletContext';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '../config/contract';
import { domainConfigs } from '../config/domains';

const MotionBox = motion(Box);

const CONTRACT_ABI = [
  'function getTotalProjects() public view returns (uint256)',
  'function getProjectsOf(address user) public view returns (uint256[] memory)',
];

const shorten = (addr: string) => addr.slice(0, 6) + '...' + addr.slice(-4);

const Dashboard = () => {
  const navigate = useNavigate();
  const { walletAddress, connectWallet } = useWallet();
  const [stats, setStats] = useState({
    totalProjects: 0,
    myProjects: 0,
    totalVotes: 0
  });
  const [loading, setLoading] = useState(true);

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    fetchStats();
  }, [walletAddress]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      const totalProjects = await contract.getTotalProjects();
      let myProjects = 0;
      
      if (walletAddress) {
        const myProjectIds = await contract.getProjectsOf(walletAddress);
        myProjects = myProjectIds.length;
      }
      
      setStats({
        totalProjects: Number(totalProjects),
        myProjects,
        totalVotes: 0 // TODO: Implement total votes calculation
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
    setLoading(false);
  };

  const quickActions = [
    {
      title: 'Submit Project',
      description: 'Create a new verified project certificate',
      icon: '📝',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      action: () => navigate('/submit')
    },
    {
      title: 'My Projects',
      description: 'View and manage your submitted projects',
      icon: '📁',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      action: () => navigate('/my-projects')
    },
    {
      title: 'Explore',
      description: 'Discover projects from the community',
      icon: '🔍',
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      action: () => navigate('/explore')
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <Box minH="100vh" position="relative" bg="#0f0f23">
      <Box className="animated-bg" />
      
      <Container maxW="container.xl" py={{ base: 8, md: 16 }}>
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <VStack spacing={8}>
            {/* Header */}
            <MotionBox variants={itemVariants} textAlign="center">
              <VStack spacing={4}>
                <Heading 
                  size={{ base: "lg", md: "xl" }} 
                  color="white" 
                  fontWeight="bold"
                >
                  Welcome to your Dashboard
                </Heading>
                {walletAddress ? (
                  <VStack spacing={2}>
                    <Text color="rgba(255, 255, 255, 0.8)">
                      Connected Wallet:
                    </Text>
                    <Text 
                      color="white" 
                      fontWeight="bold" 
                      fontSize="lg"
                      className="glass"
                      px={4}
                      py={2}
                      borderRadius="full"
                    >
                      {shorten(walletAddress)}
                    </Text>
                  </VStack>
                ) : (
                  <VStack spacing={4}>
                    <Text color="rgba(255, 255, 255, 0.8)">
                      Connect your wallet to get started
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
                        color="white"
                      >
                        Connect Wallet
                      </Button>
                    </MotionBox>
                  </VStack>
                )}
              </VStack>
            </MotionBox>

            {/* Stats */}
            {walletAddress && (
              <MotionBox variants={itemVariants} w="100%">
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                  <Box className="stats-card">
                    <Stat>
                      <StatLabel color="rgba(255, 255, 255, 0.8)">
                        Total Projects
                      </StatLabel>
                      <StatNumber color="white" fontSize="3xl">
                        {loading ? '...' : stats.totalProjects}
                      </StatNumber>
                      <StatHelpText color="rgba(255, 255, 255, 0.6)">
                        On the platform
                      </StatHelpText>
                    </Stat>
                  </Box>
                  
                  <Box className="stats-card">
                    <Stat>
                      <StatLabel color="rgba(255, 255, 255, 0.8)">
                        My Projects
                      </StatLabel>
                      <StatNumber color="white" fontSize="3xl">
                        {loading ? '...' : stats.myProjects}
                      </StatNumber>
                      <StatHelpText color="rgba(255, 255, 255, 0.6)">
                        Submitted by you
                      </StatHelpText>
                    </Stat>
                  </Box>
                  
                  <Box className="stats-card">
                    <Stat>
                      <StatLabel color="rgba(255, 255, 255, 0.8)">
                        Domains
                      </StatLabel>
                      <StatNumber color="white" fontSize="3xl">
                        {Object.keys(domainConfigs).length}
                      </StatNumber>
                      <StatHelpText color="rgba(255, 255, 255, 0.6)">
                        Available sectors
                      </StatHelpText>
                    </Stat>
                  </Box>
                </SimpleGrid>
              </MotionBox>
            )}

            {/* Quick Actions */}
            <MotionBox variants={itemVariants} w="100%">
              <VStack spacing={6}>
                <Heading size="md" color="white" textAlign="center">
                  Quick Actions
                </Heading>
                
                <SimpleGrid 
                  columns={{ base: 1, md: 3 }} 
                  spacing={6} 
                  w="100%"
                >
                  {quickActions.map((action, index) => (
                    <MotionBox
                      key={index}
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Box
                        className="glass-card"
                        p={8}
                        cursor="pointer"
                        onClick={action.action}
                        textAlign="center"
                        h="100%"
                        transition="all 0.3s ease"
                        _hover={{
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 60px 0 rgba(0, 0, 0, 0.5)'
                        }}
                      >
                        <VStack spacing={4}>
                          <Text fontSize="4xl">{action.icon}</Text>
                          <Heading size="md" color="white">
                            {action.title}
                          </Heading>
                          <Text 
                            color="rgba(255, 255, 255, 0.8)" 
                            fontSize="sm"
                            lineHeight={1.6}
                          >
                            {action.description}
                          </Text>
                          <Button
                            size="sm"
                            borderRadius="full"
                            className="outline-btn"
                          >
                            Get Started
                          </Button>
                        </VStack>
                      </Box>
                    </MotionBox>
                  ))}
                </SimpleGrid>
              </VStack>
            </MotionBox>

            {/* Domain Overview */}
            <MotionBox variants={itemVariants} w="100%">
              <VStack spacing={6}>
                <Heading size="md" color="white" textAlign="center">
                  Available Domains
                </Heading>
                
                <SimpleGrid 
                  columns={{ base: 2, md: 3, lg: 6 }} 
                  spacing={4} 
                  w="100%"
                >
                  {Object.entries(domainConfigs).map(([domain, config], index) => (
                    <MotionBox
                      key={domain}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      <Box
                        className="glass"
                        p={4}
                        borderRadius="lg"
                        cursor="pointer"
                        textAlign="center"
                        onClick={() => navigate(`/submit?domain=${domain}`)}
                        _hover={{
                          background: 'rgba(255, 255, 255, 0.15)',
                          borderColor: 'rgba(102, 126, 234, 0.6)'
                        }}
                      >
                        <VStack spacing={2}>
                          <Text fontSize="2xl">{config.icon}</Text>
                          <Text 
                            color="white" 
                            fontSize="xs" 
                            fontWeight="bold"
                            textAlign="center"
                          >
                            {config.name}
                          </Text>
                        </VStack>
                      </Box>
                    </MotionBox>
                  ))}
                </SimpleGrid>
              </VStack>
            </MotionBox>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default Dashboard;