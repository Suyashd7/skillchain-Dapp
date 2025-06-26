import { Box, Button, Container, Heading, Text, VStack, HStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../components/WalletContext';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const shorten = (addr: string) => addr.slice(0, 6) + '...' + addr.slice(-4);

const LandingPage = () => {
  const navigate = useNavigate();
  const { walletAddress, connectWallet } = useWallet();
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    let effect: any;
    if (!vantaEffect && vantaRef.current) {
      // Dynamically import Vanta NET effect for SSR safety
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
          color: 0x1fc8db, // Soft blue/teal
          backgroundColor: 0xf8f7f4, // Match page bg
          points: 12.0,
          maxDistance: 22.0,
          spacing: 18.0,
        });
        setVantaEffect(effect);
      });
    }
    return () => {
      if (effect) effect.destroy();
      if (vantaEffect) vantaEffect.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vantaEffect]);

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" fontFamily="'Inter', 'Poppins', sans-serif" position="relative" overflow="hidden">
      {/* Vanta background */}
      <Box ref={vantaRef} position="fixed" top={0} left={0} w="100vw" h="100vh" zIndex={-1} bg="#f8f7f4" />
      {/* Foreground content */}
      <Container maxW="container.md" py={16}>
        <VStack spacing={8} align="center">
          <Heading size="2xl" color="#181818" fontWeight="extrabold" letterSpacing={1} lineHeight={1.1}>
            SkillChain
          </Heading>
          <Text fontSize="xl" color="#555" textAlign="center" maxW="lg">
            Showcase, protect, and endorse your dev projects on-chain. Build your Web3 portfolio, get community votes, and prove your work with NFT-backed credentials.
          </Text>
          <HStack spacing={6}>
            {walletAddress ? (
              <Button size="lg" borderRadius="full" px={8} fontWeight="bold" bg="#FFFBEA" color="#181818" border="1.5px solid #FFD700" _hover={{ bg: '#FFD700', color: '#181818' }} boxShadow="0 2px 16px 0 #FFD70033" onClick={() => navigate('/dashboard')}>
                {shorten(walletAddress)} (Dashboard)
              </Button>
            ) : (
              <Button size="lg" borderRadius="full" px={8} fontWeight="bold" bg="#FFD700" color="#181818" _hover={{ bg: '#E5C100' }} boxShadow="0 2px 16px 0 #FFD70033" onClick={connectWallet}>
                Connect Wallet
              </Button>
            )}
            <Button size="lg" borderRadius="full" px={8} fontWeight="bold" variant="outline" borderColor="#FFD700" color="#181818" _hover={{ bg: '#FFFBEA' }} onClick={() => navigate('/explore')}>
              Explore Projects
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default LandingPage; 