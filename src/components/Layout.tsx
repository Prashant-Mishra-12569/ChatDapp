import React from 'react';
import { Button } from "./ui/button";

interface LayoutProps {
  children: React.ReactNode;
  account: string;
  onConnectWallet: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, account, onConnectWallet }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 bg-white border-r">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Messages</h1>
            <Button variant="ghost" size="sm" onClick={onConnectWallet}>
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
            </Button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;