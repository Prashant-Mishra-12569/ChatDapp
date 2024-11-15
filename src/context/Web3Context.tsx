import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractABI from './EnhancedChatDApp.json';

interface Web3ContextType {
  account: string;
  contract: ethers.Contract | null;
  connectWallet: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType>({
  account: '',
  contract: null,
  connectWallet: async () => {},
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  const connectWallet = async () => {
    try {
      const { ethereum } = window as any;
      if (ethereum) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const chatContract = new ethers.Contract(
          process.env.REACT_APP_CONTRACT_ADDRESS!,
          contractABI.abi,
          signer
        );
        setContract(chatContract);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <Web3Context.Provider value={{ account, contract, connectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};