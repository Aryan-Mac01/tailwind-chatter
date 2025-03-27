
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/ChatHeader';
import ChatMessages from '@/components/ChatMessages';
import ChatInput from '@/components/ChatInput';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Chat = () => {
  const { user, isLoading } = useAuth();
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(!isMobile);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {showSidebar && (
        <div className={`${isMobile ? 'absolute z-10 h-full' : ''}`}>
          <Sidebar onClose={isMobile ? toggleSidebar : undefined} />
        </div>
      )}
      
      <div className="flex-1 flex flex-col">
        <div className="flex items-center">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="ml-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex-1">
            <ChatHeader />
          </div>
        </div>
        <ChatMessages />
        <ChatInput />
      </div>
    </div>
  );
};

export default Chat;
