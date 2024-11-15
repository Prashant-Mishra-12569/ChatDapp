'use client'

import { ethers } from 'ethers';
import React, { useState, useEffect } from 'react';
import { useWeb3 } from './context/Web3Context';
import Layout from './components/Layout';
import ChatList from './components/ChatList';
import ChatMessage from './components/ChatMessage';
import MessageInput from './components/MessageInput';
import { uploadToIPFS } from './utils/ipfs';
import { formatAddress } from './utils/format';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';

declare global {
  interface Window {
    ethereum: any;
  }
}

interface Message {
  id: number;
  sender: string;
  messageType: number;
  content: string;
  timestamp: number;
  amount: string;
}

const App: React.FC = () => {
  const { account, contract, connectWallet } = useWeb3();
  const [messages, setMessages] = useState<Message[]>([]);
  const [recipient, setRecipient] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (contract) {
      fetchMessages();
    }
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [contract]);

  const fetchMessages = async () => {
    try {
      const fetchedMessages = await contract!.getMessages();
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (content: string, type: number, file?: File, amount?: string) => {
    try {
      if (!recipient) {
        alert("Please enter a recipient address");
        return;
      }

      let finalContent = content;
      if (file && (type === 1 || type === 2)) {
        finalContent = await uploadToIPFS(file);
      }

      let tx;
      if (type === 3 && amount) { // Payment
        tx = await contract!.sendMessage(recipient, finalContent, type, {
          value: ethers.utils.parseEther(amount)
        });
      } else {
        tx = await contract!.sendMessage(recipient, finalContent, type);
      }

      await tx.wait();
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const renderMessageContent = (content: string, messageType: number): React.ReactNode => {
    if (messageType === 2) { // Image message
      return (
        <img 
          src={`https://gateway.pinata.cloud/ipfs/${content.replace('ipfs://', '')}`}
          alt="Shared image"
          className="max-w-full h-auto rounded-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg'
          }}
        />
      )
    } else if (messageType === 1) { // File message
      return (
        <a 
          href={`https://gateway.pinata.cloud/ipfs/${content.replace('ipfs://', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline break-all"
        >
          View File
        </a>
      )
    }
    return <span className="break-words">{content}</span>
  }

  return (
    <Layout account={formatAddress(account)} onConnectWallet={connectWallet}>
      <div className="flex flex-col h-full max-h-screen">
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Input
              placeholder="Enter recipient's Ethereum address (0x...)"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full sm:flex-grow"
            />
            <Button onClick={connectWallet} className="w-full sm:w-auto">
              {account ? `Connected: ${formatAddress(account)}` : 'Connect Wallet'}
            </Button>
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          {!isMobile && (
            <div className="w-1/4 border-r overflow-y-auto">
              <ChatList messages={messages} onSelectChat={(sender) => setRecipient(sender)} />
            </div>
          )}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  sender={msg.sender}
                  content={renderMessageContent(msg.content, msg.messageType)}
                  timestamp={msg.timestamp}
                  amount={msg.amount}
                  currentAccount={account}
                />
              ))}
            </div>
            <div className="p-4 border-t">
              <MessageInput onSendMessage={handleSendMessage} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;