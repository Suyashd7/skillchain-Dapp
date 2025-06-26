import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';

// Add type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletContextType {
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType>({
  walletAddress: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const toast = useToast();

  const connectWallet = useCallback(async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        toast({ title: 'Wallet connected!', status: 'success', duration: 2000 });
      } catch (error) {
        toast({ title: 'User rejected wallet connection', status: 'error' });
      }
    } else {
      toast({ title: 'MetaMask is not installed!', status: 'error' });
    }
  }, [toast]);

  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
    toast({ title: 'Wallet disconnected', status: 'info', duration: 2000 });
  }, [toast]);

  return (
    <WalletContext.Provider value={{ walletAddress, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext); 