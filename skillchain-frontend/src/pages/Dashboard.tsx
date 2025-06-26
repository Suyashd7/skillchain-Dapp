import { Box, Button, Container, Heading, Text, VStack, HStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../components/WalletContext';

const shorten = (addr: string) => addr.slice(0, 6) + '...' + addr.slice(-4);

const Dashboard = () => {
  const navigate = useNavigate();
  const { walletAddress, connectWallet } = useWallet();
  return (
    <Box minH="100vh" bg="#f8f7f4" display="flex" alignItems="center" justifyContent="center" fontFamily="'Inter', 'Poppins', sans-serif">
      <Container maxW="container.sm" py={16}>
        <VStack spacing={8} align="center">
          <Heading size="xl" color="#181818" fontWeight="bold">Welcome to your Dashboard</Heading>
          {walletAddress ? (
            <>
              <Text color="#555">Wallet Connected:</Text>
              <Text color="#FFD700" fontWeight="bold" fontSize="lg">{shorten(walletAddress)}</Text>
            </>
          ) : (
            <Button size="lg" borderRadius="full" bg="#fff" color="#181818" border="1.5px solid #FFD700" _hover={{ bg: '#FFD700', color: '#181818' }} onClick={connectWallet}>Connect Wallet</Button>
          )}
          <HStack spacing={6}>
            <Button size="lg" borderRadius="full" bg="#fff" color="#181818" border="1.5px solid #FFD700" _hover={{ bg: '#FFD700', color: '#181818' }} onClick={() => navigate('/submit')}>Submit Project</Button>
            <Button size="lg" borderRadius="full" variant="outline" borderColor="#FFD700" color="#181818" _hover={{ bg: '#FFD700', color: '#181818' }} onClick={() => navigate('/my-projects')}>My Projects</Button>
            <Button size="lg" borderRadius="full" variant="outline" borderColor="#FFD700" color="#181818" _hover={{ bg: '#FFD700', color: '#181818' }} onClick={() => navigate('/explore')}>Explore</Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Dashboard; 