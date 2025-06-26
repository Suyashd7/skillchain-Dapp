import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Button, 
  SimpleGrid,
  Flex,
  Icon,
  useBreakpointValue
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../components/WalletContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { domainConfigs, Domain } from '../config/domains';
import * as THREE from 'three';

const MotionBox = motion(Box);
const MotionContainer = motion(Container);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

const shorten = (addr: string) => addr.slice(0, 6) + '...' + addr.slice(-4);

const LandingPage = () => {
  const navigate = useNavigate();
  const { walletAddress, connectWallet } = useWallet();
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    let effect: any;
    if (!vantaEffect && vantaRef.current && !isMobile) {
      import('vanta/dist/vanta.net.min').then((VANTA) => {
        effect = (VANTA.default || (VANTA as any))({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x667eea,
          backgroundColor: 0x764ba2,
          points: 8.0,
          maxDistance: 25.0,
          spacing: 20.0,
        });
        setVantaEffect(effect);
      });
    }
    return () => {
      if (effect) effect.destroy();
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect, isMobile]);

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

  const cardVariants = {
    hidden: { y: 100, opacity: 0, scale: 0.8 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      y: -10,
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <Box minH="100vh" position="relative" overflow="hidden">
      {/* Animated Background */}
      <Box className="animated-bg" />
      
      {/* Vanta Background for Desktop */}
      {!isMobile && (
        <Box 
          ref={vantaRef} 
          position="fixed" 
          top={0} 
          left={0} 
          w="100vw" 
          h="100vh" 
          zIndex={-1} 
        />
      )}

      {/* Hero Section */}
      <MotionContainer
        maxW="container.xl"
        py={{ base: 20, md: 32 }}
        style={{ y, opacity }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <VStack spacing={{ base: 8, md: 12 }} align="center" textAlign="center">
          <MotionHeading
            size={{ base: "2xl", md: "4xl" }}
            color="white"
            fontWeight="extrabold"
            letterSpacing="tight"
            lineHeight={1.1}
            variants={itemVariants}
            className="floating"
          >
            The Future of Digital
            <br />
            <Text as="span" className="gradient-text" filter="brightness(2)">
              Credential Verification
            </Text>
          </MotionHeading>

          <MotionText
            fontSize={{ base: "lg", md: "xl" }}
            color="rgba(255, 255, 255, 0.9)"
            textAlign="center"
            maxW="3xl"
            lineHeight={1.6}
            variants={itemVariants}
          >
            Secure, verify, and showcase your achievements across multiple domains with blockchain technology. 
            From academic certificates to legal documents, creative works to research papers - all protected by Web3.
          </MotionText>

          <MotionBox variants={itemVariants}>
            <HStack spacing={6} flexWrap="wrap" justify="center">
              {walletAddress ? (
                <MotionBox
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    borderRadius="full"
                    px={8}
                    py={6}
                    fontSize="lg"
                    fontWeight="bold"
                    className="premium-btn"
                    onClick={() => navigate('/dashboard')}
                  >
                    {shorten(walletAddress)} - Dashboard
                  </Button>
                </MotionBox>
              ) : (
                <MotionBox
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    borderRadius="full"
                    px={8}
                    py={6}
                    fontSize="lg"
                    fontWeight="bold"
                    className="premium-btn"
                    onClick={connectWallet}
                  >
                    Connect Wallet
                  </Button>
                </MotionBox>
              )}
              
              <MotionBox
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  borderRadius="full"
                  px={8}
                  py={6}
                  fontSize="lg"
                  fontWeight="bold"
                  variant="outline"
                  borderColor="rgba(255, 255, 255, 0.3)"
                  color="white"
                  _hover={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  }}
                  onClick={() => navigate('/explore')}
                >
                  Explore Projects
                </Button>
              </MotionBox>
            </HStack>
          </MotionBox>
        </VStack>
      </MotionContainer>

      {/* Domain Cards Section */}
      <Container maxW="container.xl" py={{ base: 16, md: 24 }}>
        <MotionBox
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <VStack spacing={12} align="center">
            <VStack spacing={4} textAlign="center">
              <Heading 
                size={{ base: "xl", md: "2xl" }} 
                color="white" 
                fontWeight="bold"
              >
                Multi-Domain Solutions
              </Heading>
              <Text 
                fontSize={{ base: "md", md: "lg" }} 
                color="rgba(255, 255, 255, 0.8)" 
                maxW="2xl"
              >
                Tailored blockchain solutions for every industry and profession
              </Text>
            </VStack>

            <SimpleGrid 
              columns={{ base: 1, md: 2, lg: 3 }} 
              spacing={{ base: 6, md: 8 }} 
              w="100%"
            >
              {Object.entries(domainConfigs).map(([domain, config], index) => (
                <MotionBox
                  key={domain}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Box
                    className="domain-card"
                    cursor="pointer"
                    onClick={() => navigate(`/submit?domain=${domain}`)}
                    h="100%"
                  >
                    <VStack spacing={6} align="start" h="100%">
                      <Flex align="center" gap={4}>
                        <Text fontSize="3xl">{config.icon}</Text>
                        <Heading size="md" color="white" fontWeight="bold">
                          {config.name}
                        </Heading>
                      </Flex>
                      
                      <Text 
                        color="rgba(255, 255, 255, 0.8)" 
                        fontSize="sm" 
                        lineHeight={1.6}
                        flex={1}
                      >
                        {config.description}
                      </Text>
                      
                      <VStack spacing={2} align="start" w="100%">
                        {config.features.slice(0, 3).map((feature, idx) => (
                          <Flex key={idx} align="center" gap={2}>
                            <Box 
                              w={2} 
                              h={2} 
                              borderRadius="full" 
                              bg="rgba(255, 255, 255, 0.6)" 
                            />
                            <Text 
                              fontSize="xs" 
                              color="rgba(255, 255, 255, 0.7)"
                            >
                              {feature}
                            </Text>
                          </Flex>
                        ))}
                      </VStack>
                      
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
                        w="100%"
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
      </Container>

      {/* Features Section */}
      <Container maxW="container.xl" py={{ base: 16, md: 24 }}>
        <MotionBox
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading 
                size={{ base: "xl", md: "2xl" }} 
                color="white" 
                fontWeight="bold"
              >
                Why Choose SkillChain?
              </Heading>
              <Text 
                fontSize={{ base: "md", md: "lg" }} 
                color="rgba(255, 255, 255, 0.8)" 
                maxW="2xl"
              >
                Built on cutting-edge blockchain technology for maximum security and trust
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="100%">
              {[
                {
                  icon: '🔒',
                  title: 'Immutable Security',
                  description: 'Your credentials are secured by blockchain technology, making them tamper-proof and permanently verifiable.'
                },
                {
                  icon: '🌐',
                  title: 'Global Verification',
                  description: 'Instantly verify credentials anywhere in the world without intermediaries or complex processes.'
                },
                {
                  icon: '🚀',
                  title: 'Future-Ready',
                  description: 'Built for the Web3 era with NFT certificates, smart contracts, and decentralized storage.'
                }
              ].map((feature, index) => (
                <MotionBox
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Box className="glass-card" p={8} textAlign="center" h="100%">
                    <VStack spacing={4}>
                      <Text fontSize="4xl">{feature.icon}</Text>
                      <Heading size="md" color="white" fontWeight="bold">
                        {feature.title}
                      </Heading>
                      <Text 
                        color="rgba(255, 255, 255, 0.8)" 
                        fontSize="sm" 
                        lineHeight={1.6}
                      >
                        {feature.description}
                      </Text>
                    </VStack>
                  </Box>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </MotionBox>
      </Container>

      {/* CTA Section */}
      <Container maxW="container.xl" py={{ base: 16, md: 24 }}>
        <MotionBox
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box className="glass-card" p={{ base: 8, md: 12 }} textAlign="center">
            <VStack spacing={8}>
              <VStack spacing={4}>
                <Heading 
                  size={{ base: "lg", md: "xl" }} 
                  color="white" 
                  fontWeight="bold"
                >
                  Ready to Secure Your Digital Future?
                </Heading>
                <Text 
                  fontSize={{ base: "md", md: "lg" }} 
                  color="rgba(255, 255, 255, 0.8)" 
                  maxW="2xl"
                >
                  Join thousands of professionals already using SkillChain to protect and verify their achievements.
                </Text>
              </VStack>
              
              <HStack spacing={4} flexWrap="wrap" justify="center">
                <MotionBox
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    borderRadius="full"
                    px={8}
                    py={6}
                    fontSize="lg"
                    fontWeight="bold"
                    className="premium-btn"
                    onClick={() => navigate('/submit')}
                  >
                    Start Creating
                  </Button>
                </MotionBox>
                
                <MotionBox
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    borderRadius="full"
                    px={8}
                    py={6}
                    fontSize="lg"
                    fontWeight="bold"
                    variant="outline"
                    borderColor="rgba(255, 255, 255, 0.3)"
                    color="white"
                    _hover={{ 
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'rgba(255, 255, 255, 0.5)'
                    }}
                    onClick={() => navigate('/explore')}
                  >
                    View Examples
                  </Button>
                </MotionBox>
              </HStack>
            </VStack>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default LandingPage;