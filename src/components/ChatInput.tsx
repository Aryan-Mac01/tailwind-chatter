
import React, { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, Smile, Paperclip, Send } from 'lucide-react';

const ChatInput = () => {
  const [message, setMessage] = useState('');
  const { sendMessage, currentChat } = useChat();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && currentChat) {
      sendMessage(message.trim());
      setMessage('');
    }
  };

  if (!currentChat) {
    return null;
  }

  return (
    <div className="p-3 border-t border-border bg-white">
      <form onSubmit={handleSendMessage} className="flex items-center">
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          className="text-gray-500 hover:text-gray-700"
        >
          <Image className="h-5 w-5" />
        </Button>
        
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          className="text-gray-500 hover:text-gray-700"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        
        <div className="flex-1 mx-2">
          <Input
            placeholder="Send a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="h-10"
          />
        </div>
        
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          className="text-gray-500 hover:text-gray-700"
        >
          <Smile className="h-5 w-5" />
        </Button>
        
        <Button 
          type="submit" 
          size="icon" 
          disabled={!message.trim()}
          className="text-white bg-chat-accent hover:bg-chat-accent/90 transition-colors"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
