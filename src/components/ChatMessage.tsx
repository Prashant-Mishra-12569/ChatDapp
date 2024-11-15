import React from 'react';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { formatAddress } from '../utils/format';
import { ethers } from 'ethers';

export interface ChatMessageProps {
  sender: string;
  content: React.ReactNode;
  timestamp: number;
  amount: string;
  currentAccount: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  sender,
  content,
  timestamp,
  amount,
  currentAccount
}) => {
  const isCurrentUser = sender.toLowerCase() === currentAccount.toLowerCase();

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <Card className={`max-w-[70%] ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
        <CardContent className="p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Avatar className="w-6 h-6">
              <AvatarFallback>{formatAddress(sender).slice(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="text-xs opacity-75">
              {formatAddress(sender)}
            </span>
            <span className="text-xs opacity-75">
              {new Date(timestamp * 1000).toLocaleTimeString()}
            </span>
          </div>
          <div className="break-words">
            {content}
          </div>
          {amount && Number(amount) > 0 && (
            <p className="text-xs mt-1 opacity-75">
              Amount: {ethers.utils.formatEther(amount)} ETH
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatMessage;