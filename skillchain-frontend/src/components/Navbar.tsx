import { Box, Flex, HStack, Button, Link, Spacer, useBreakpointValue, Text, IconButton, useDisclosure, VStack, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody } from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useWallet } from './WalletContext';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const MotionBox = motion(Box);

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
  const showLabels = useBreakpointValue({ base: false, lg: true });
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <MotionBox
      as="nav"
      w="100%"
      className="glass-navbar"
      px={6}
      py={4}
      position="sticky"
      top={0}
      zIndex={100}
      fontFamily="'Inter', sans-serif"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Flex align="center" maxW="container.xl" mx="auto">
        <MotionBox
          fontWeight="bold"
          fontSize="2xl"
          className="gradient-text"
          cursor="pointer"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          SkillChain
        </MotionBox>

        {/* Desktop Navigation */}
        <HStack spacing={8} ml={12} display={{ base: 'none', lg: 'flex' }}>
          {navLinks.map((link, index) => (
            <MotionBox
              key={link.path}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <Link
                as={NavLink}
                to={link.path}
                px={4}
                py={2}
                borderRadius="full"
                fontWeight="500"
                color="white"
                _activeLink={{ 
                  background: 'rgba(255, 255, 255, 0.2)',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)'
                }}
                _hover={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  textDecoration: 'none',
                  backdropFilter: 'blur(10px)'
                }}
                transition="all 0.3s ease"
              >
                {link.label}
              </Link>
            </MotionBox>
          ))}
        </HStack>

        <Spacer />

        {/* Desktop Wallet Controls */}
        <HStack spacing={4} display={{ base: 'none', lg: 'flex' }}>
          {walletAddress ? (
            <>
              <MotionBox
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="md"
                  borderRadius="full"
                  className="glass"
                  color="white"
                  fontWeight="bold"
                  cursor="default"
                  _hover={{ background: 'rgba(255, 255, 255, 0.2)' }}
                >
                  {shorten(walletAddress)}
                </Button>
              </MotionBox>
              <MotionBox
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="md"
                  borderRadius="full"
                  variant="outline"
                  borderColor="rgba(255, 255, 255, 0.3)"
                  color="white"
                  _hover={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  }}
                  onClick={disconnectWallet}
                >
                  Disconnect
                </Button>
              </MotionBox>
            </>
          ) : (
            <MotionBox
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="md"
                borderRadius="full"
                className="premium-btn"
                onClick={connectWallet}
              >
                Connect Wallet
              </Button>
            </MotionBox>
          )}
        </HStack>

        {/* Mobile Menu Button */}
        <IconButton
          display={{ base: 'flex', lg: 'none' }}
          aria-label="Open menu"
          icon={<FontAwesomeIcon icon={faBars} />}
          variant="ghost"
          color="white"
          onClick={onOpen}
          _hover={{ background: 'rgba(255, 255, 255, 0.1)' }}
        />

        {/* Mobile Drawer */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent className="glass" color="white">
            <DrawerCloseButton />
            <DrawerHeader className="gradient-text" fontSize="xl" fontWeight="bold">
              SkillChain
            </DrawerHeader>
            <DrawerBody>
              <VStack spacing={6} align="stretch">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    as={NavLink}
                    to={link.path}
                    px={4}
                    py={3}
                    borderRadius="lg"
                    fontWeight="500"
                    color="white"
                    _activeLink={{ 
                      background: 'rgba(255, 255, 255, 0.2)',
                      fontWeight: 'bold'
                    }}
                    _hover={{ 
                      background: 'rgba(255, 255, 255, 0.1)',
                      textDecoration: 'none'
                    }}
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                ))}
                <Box pt={4} borderTop="1px solid rgba(255, 255, 255, 0.2)">
                  {walletAddress ? (
                    <VStack spacing={3}>
                      <Text fontSize="sm" color="rgba(255, 255, 255, 0.8)">
                        {shorten(walletAddress)}
                      </Text>
                      <Button
                        size="sm"
                        borderRadius="full"
                        variant="outline"
                        borderColor="rgba(255, 255, 255, 0.3)"
                        color="white"
                        w="full"
                        onClick={() => {
                          disconnectWallet();
                          onClose();
                        }}
                      >
                        Disconnect
                      </Button>
                    </VStack>
                  ) : (
                    <Button
                      size="md"
                      borderRadius="full"
                      className="premium-btn"
                      w="full"
                      onClick={() => {
                        connectWallet();
                        onClose();
                      }}
                    >
                      Connect Wallet
                    </Button>
                  )}
                </Box>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </MotionBox>
  );
};

export default Navbar;