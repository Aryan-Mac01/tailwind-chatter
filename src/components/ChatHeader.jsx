
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChat } from '@/contexts/ChatContext';
import { Bell, MoreHorizontal } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const ChatHeader = () => {
  const { currentChat } = useChat();
  const isMobile = useIsMobile();

  if (!currentChat) {
    return (
      <div className="h-16 border-b border-border flex items-center justify-between p-4 bg-white">
        <div className="font-medium">Select a chat to start messaging</div>
      </div>
    );
  }

  return (
    <div className="h-16 border-b border-border flex items-center justify-between p-4 bg-white">
      <div className="flex items-center">
        <Avatar className="h-8 w-8 mr-3">
          <AvatarImage src={currentChat.avatar} />
          <AvatarFallback>{currentChat.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div>
          <div className="font-medium">{currentChat.name}</div>
          {currentChat.participants.length > 1 ? (
            <div className="text-xs text-gray-500">
              {currentChat.participants.length} participants
            </div>
          ) : (
            <div className="text-xs text-gray-500">
              {currentChat.participants[0]?.status || 'Online'}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {!isMobile && <Bell className="h-5 w-5 text-gray-500" />}
        <MoreHorizontal className="h-5 w-5 text-gray-500" />
      </div>
    </div>
  );
};

export default ChatHeader;
