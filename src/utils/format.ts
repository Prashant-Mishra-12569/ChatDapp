import { ethers } from 'ethers';

export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatEther = (wei: string): string => {
  return ethers.utils.formatEther(wei);
};

export const parseEther = (ether: string): ethers.BigNumber => {
  return ethers.utils.parseEther(ether);
};