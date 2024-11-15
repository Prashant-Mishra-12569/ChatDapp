import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Upload, Send, ImageIcon } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string, type: number, file?: File, amount?: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [messageContent, setMessageContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [amount, setAmount] = useState('');

  const handleSend = () => {
    if (messageContent || selectedFile) {
      const type = amount ? 3 : selectedFile ? (selectedFile.type.startsWith('image/') ? 2 : 1) : 0;
      onSendMessage(messageContent, type, selectedFile || undefined, amount);
      setMessageContent('');
      setSelectedFile(null);
      setAmount('');
    }
  };

  return (
    <div className="p-4 bg-white border-t">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Type a message..."
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          className="flex-1"
        />
        <Button variant="outline" size="icon" onClick={() => document.getElementById('fileInput')?.click()}>
          <Upload className="h-4 w-4" />
        </Button>
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        />
        <Button variant="outline" size="icon" onClick={() => document.getElementById('imageInput')?.click()}>
          <ImageIcon className="h-4 w-4" />
        </Button>
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          className="hidden"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        />
        <Input
          type="number"
          placeholder="ETH Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-24"
        />
        <Button onClick={handleSend}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;