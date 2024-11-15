import React from 'react';
import { Avatar, AvatarFallback } from "./ui/avatar";

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: number;
}

interface ChatListProps {
  messages: Message[];
  onSelectChat: (sender: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ messages, onSelectChat }) => {
  return (
    <div className="overflow-y-auto h-[calc(100vh-73px)]">
      {messages.map((msg) => (
        <div 
          key={msg.id} 
          className="p-4 border-b hover:bg-gray-50 cursor-pointer"
          onClick={() => onSelectChat(msg.sender)}
        >
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>{msg.sender.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {msg.sender}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {msg.content}
              </p>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(msg.timestamp * 1000).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;