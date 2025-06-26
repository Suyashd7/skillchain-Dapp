import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Button,
  Input,
  Textarea,
  Select,
  FormControl,
  FormLabel,
  useToast,
  SimpleGrid,
  Text,
  Badge,
  Flex,
  useBreakpointValue
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { ethers } from 'ethers';
import { keccak_256 } from 'js-sha3';
import { useWallet } from '../components/WalletContext';
import { domainConfigs, Domain } from '../config/domains';
import { CONTRACT_ADDRESS } from '../config/contract';

const MotionBox = motion(Box);

const CONTRACT_ABI = [
  "function submitProject(string _name, string _githubLink, string[] memory _tags) public returns (uint256)",
  "function storeFileHash(uint256 tokenId, bytes32 fileHash) public",
];

const SubmitProject = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { walletAddress, connectWallet } = useWallet();
  
  const [selectedDomain, setSelectedDomain] = useState<Domain>(
    (searchParams.get('domain') as Domain) || Domain.DEVELOPER
  );
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const isMobile = useBreakpointValue({ base: true, md: false });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setUploadedFile(acceptedFiles[0]);
      }
    },
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.md'],
      'application/*': ['.doc', '.docx']
    }
  });

  const currentConfig = domainConfigs[selectedDomain];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!walletAddress) {
      toast({
        title: 'Wallet Required',
        description: 'Please connect your wallet first.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate required fields
    const requiredFields = currentConfig.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => 
      !formData[field.name] && !(field.type === 'file' && uploadedFile)
    );

    if (missingFields.length > 0) {
      toast({
        title: 'Missing Required Fields',
        description: `Please fill in: ${missingFields.map(f => f.label).join(', ')}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Prepare project data
      const projectName = formData.title || 'Untitled Project';
      const githubLink = formData.githubLink || '';
      const allTags = [...tags, selectedDomain];

      // Submit project to blockchain
      const tx = await contract.submitProject(projectName, githubLink, allTags);
      const receipt = await tx.wait();

      // If file uploaded, store its hash
      if (uploadedFile) {
        const arrayBuffer = await uploadedFile.arrayBuffer();
        const hashHex = keccak_256(new Uint8Array(arrayBuffer));
        const hashBytes32 = '0x' + hashHex;
        
        // Get the token ID from the transaction logs
        const tokenId = receipt.logs[0].topics[3]; // Assuming Transfer event
        
        const hashTx = await contract.storeFileHash(tokenId, hashBytes32);
        await hashTx.wait();
      }

      toast({
        title: 'Success!',
        description: 'Your project has been submitted to the blockchain.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      setFormData({});
      setUploadedFile(null);
      setTags([]);
      
      // Navigate to explore page
      setTimeout(() => {
        navigate('/explore');
      }, 2000);

    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your project. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field: any) => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="glass-input"
            size="lg"
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="glass-input"
            rows={4}
            resize="vertical"
          />
        );
      
      case 'select':
        return (
          <Select
            placeholder={`Select ${field.label}`}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="glass-input"
            size="lg"
          >
            {field.options?.map((option: string) => (
              <option key={option} value={option} style={{ background: '#1a202c', color: 'white' }}>
                {option}
              </option>
            ))}
          </Select>
        );
      
      case 'file':
        return (
          <Box
            {...getRootProps()}
            className="glass-card"
            p={8}
            textAlign="center"
            cursor="pointer"
            border={isDragActive ? "2px dashed rgba(102, 126, 234, 0.8)" : "2px dashed rgba(255, 255, 255, 0.3)"}
            borderRadius="lg"
            transition="all 0.3s ease"
            _hover={{
              borderColor: "rgba(102, 126, 234, 0.6)",
              background: "rgba(255, 255, 255, 0.05)"
            }}
          >
            <input {...getInputProps()} />
            <VStack spacing={4}>
              <Text fontSize="3xl">📁</Text>
              {uploadedFile ? (
                <VStack spacing={2}>
                  <Text color="white" fontWeight="bold">
                    {uploadedFile.name}
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.7)" fontSize="sm">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                </VStack>
              ) : (
                <VStack spacing={2}>
                  <Text color="white" fontWeight="bold">
                    {isDragActive ? 'Drop the file here' : 'Drag & drop a file here'}
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.7)" fontSize="sm">
                    or click to select a file
                  </Text>
                </VStack>
              )}
            </VStack>
          </Box>
        );
      
      case 'tags':
        return (
          <VStack spacing={4} align="stretch">
            <HStack>
              <Input
                placeholder={field.placeholder}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="glass-input"
                size="lg"
                flex={1}
              />
              <Button
                onClick={handleAddTag}
                className="premium-btn"
                size="lg"
                px={6}
              >
                Add
              </Button>
            </HStack>
            {tags.length > 0 && (
              <Flex wrap="wrap" gap={2}>
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    colorScheme="purple"
                    variant="solid"
                    px={3}
                    py={1}
                    borderRadius="full"
                    cursor="pointer"
                    onClick={() => handleRemoveTag(tag)}
                    _hover={{ opacity: 0.8 }}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </Flex>
            )}
          </VStack>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box minH="100vh" position="relative">
      <Box className="animated-bg" />
      
      <Container maxW="container.lg" py={{ base: 8, md: 16 }}>
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
                Submit Your Project
              </Heading>
              <Text 
                fontSize={{ base: "md", md: "lg" }} 
                color="rgba(255, 255, 255, 0.8)" 
                maxW="2xl"
              >
                Choose your domain and create a verified blockchain certificate
              </Text>
            </VStack>

            {/* Domain Selection */}
            <Box className="glass-card" p={6} w="100%">
              <VStack spacing={4}>
                <Heading size="md" color="white">
                  Select Domain
                </Heading>
                <SimpleGrid 
                  columns={{ base: 2, md: 3, lg: 6 }} 
                  spacing={4} 
                  w="100%"
                >
                  {Object.entries(domainConfigs).map(([domain, config]) => (
                    <MotionBox
                      key={domain}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Box
                        p={4}
                        borderRadius="lg"
                        cursor="pointer"
                        textAlign="center"
                        transition="all 0.3s ease"
                        bg={selectedDomain === domain ? 
                          "rgba(102, 126, 234, 0.3)" : 
                          "rgba(255, 255, 255, 0.1)"
                        }
                        border={selectedDomain === domain ? 
                          "2px solid rgba(102, 126, 234, 0.8)" : 
                          "1px solid rgba(255, 255, 255, 0.2)"
                        }
                        onClick={() => setSelectedDomain(domain as Domain)}
                        _hover={{
                          bg: "rgba(255, 255, 255, 0.15)",
                          borderColor: "rgba(102, 126, 234, 0.6)"
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
            </Box>

            {/* Form */}
            <Box className="glass-card" p={{ base: 6, md: 8 }} w="100%">
              <VStack spacing={6}>
                <HStack spacing={4} align="center">
                  <Text fontSize="3xl">{currentConfig.icon}</Text>
                  <VStack spacing={1} align="start">
                    <Heading size="md" color="white">
                      {currentConfig.name}
                    </Heading>
                    <Text color="rgba(255, 255, 255, 0.7)" fontSize="sm">
                      {currentConfig.description}
                    </Text>
                  </VStack>
                </HStack>

                <SimpleGrid 
                  columns={{ base: 1, md: 2 }} 
                  spacing={6} 
                  w="100%"
                >
                  {currentConfig.fields.map((field) => (
                    <FormControl key={field.name} isRequired={field.required}>
                      <FormLabel color="white" fontWeight="bold">
                        {field.label}
                        {field.required && (
                          <Text as="span" color="red.300" ml={1}>*</Text>
                        )}
                      </FormLabel>
                      {renderField(field)}
                    </FormControl>
                  ))}
                </SimpleGrid>

                {/* Submit Button */}
                <VStack spacing={4} w="100%">
                  {!walletAddress && (
                    <Button
                      size="lg"
                      borderRadius="full"
                      className="premium-btn"
                      w={{ base: "100%", md: "auto" }}
                      px={8}
                      onClick={connectWallet}
                    >
                      Connect Wallet First
                    </Button>
                  )}
                  
                  <Button
                    size="lg"
                    borderRadius="full"
                    className="premium-btn"
                    w={{ base: "100%", md: "auto" }}
                    px={8}
                    isLoading={loading}
                    loadingText="Submitting..."
                    onClick={handleSubmit}
                    isDisabled={!walletAddress}
                  >
                    Submit to Blockchain
                  </Button>
                </VStack>
              </VStack>
            </Box>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default SubmitProject;