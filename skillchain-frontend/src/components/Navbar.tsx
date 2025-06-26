import { Box, Flex, HStack, Button, Link, Spacer, useBreakpointValue, Text } from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useWallet } from './WalletContext';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Submit', path: '/submit' },
  { label: 'Explore', path: '/explore' },
  { label: 'My Projects', path: '/my-projects' },
];

const shorten = (addr: string) => addr.slice(0, 6) + '...' + addr.slice(-4);

const Navbar = () => {
  const navigate = useNavigate();
  const { walletAddress, connectWallet, disconnectWallet } = useWallet();
  const showLabels = useBreakpointValue({ base: false, md: true });
  return (
    <Box as="nav" w="100%" bg="#fff" boxShadow="0 2px 16px 0 #E5E4E233" px={6} py={3} position="sticky" top={0} zIndex={100} fontFamily="'Inter', 'Poppins', sans-serif">
      <Flex align="center" maxW="container.xl" mx="auto">
        <Box fontWeight="bold" fontSize="xl" color="#FFD700" cursor="pointer" onClick={() => navigate('/')}>SkillChain</Box>
        <HStack spacing={6} ml={8} display={{ base: 'none', md: 'flex' }}>
          {navLinks.map(link => (
            <Link
              as={NavLink}
              key={link.path}
              to={link.path}
              px={3}
              py={1}
              borderRadius="md"
              fontWeight="500"
              color="#181818"
              _activeLink={{ color: '#FFD700', fontWeight: 'bold' }}
              _hover={{ color: '#FFD700', textDecoration: 'none' }}
            >
              {link.label}
            </Link>
          ))}
        </HStack>
        <Spacer />
        {walletAddress ? (
          <HStack spacing={2}>
            <Button size="md" borderRadius="full" bg="#FFFBEA" color="#181818" border="1.5px solid #FFD700" _hover={{ bg: '#FFD700', color: '#181818' }} boxShadow="0 2px 8px 0 #FFD70033" cursor="default">
              <Text fontWeight="bold">{shorten(walletAddress)}</Text>
            </Button>
            <Button size="md" borderRadius="full" variant="outline" borderColor="#FFD700" color="#FFD700" _hover={{ bg: '#FFFBEA' }} onClick={disconnectWallet}>
              Disconnect
            </Button>
          </HStack>
        ) : (
          <Button size="md" borderRadius="full" bg="#FFD700" color="#181818" _hover={{ bg: '#E5C100' }} boxShadow="0 2px 8px 0 #FFD70033" onClick={connectWallet}>
            Connect Wallet
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar; 