
import React, { useEffect, useRef } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatTime } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChatMessages = () => {
  const { messages, currentChat, isLoadingMessages } = useChat();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="text-center">
          <h3 className="text-xl font-medium mb-2">Plan your next experience</h3>
          <p className="text-gray-500">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  if (isLoadingMessages) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="text-center">
          <h3 className="text-xl font-medium mb-2">Start a conversation</h3>
          <p className="text-gray-500">Send a message to {currentChat.name}</p>
        </div>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages: { [date: string]: typeof messages } = {};
  
  messages.forEach(message => {
    const date = new Date(message.timestamp).toDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="mb-6">
          <div className="text-center mb-4">
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
              {new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
          
          {dateMessages.map((message, index) => {
            const isCurrentUser = message.senderId === user?.id;
            const showAvatar = !isCurrentUser && (index === 0 || 
              dateMessages[index - 1]?.senderId !== message.senderId);
            
            return (
              <div 
                key={message.id} 
                className={cn(
                  "flex mb-2",
                  isCurrentUser ? "justify-end" : "justify-start"
                )}
              >
                {!isCurrentUser && showAvatar && (
                  <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                    <AvatarImage src={currentChat.avatar} />
                    <AvatarFallback>{currentChat.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
                
                {!isCurrentUser && !showAvatar && <div className="w-10" />}
                
                <div 
                  className={cn(
                    "message-bubble animate-message-appear",
                    isCurrentUser 
                      ? "message-bubble-sent" 
                      : "message-bubble-received"
                  )}
                >
                  {message.content}
                  <div 
                    className={cn(
                      "text-xs mt-1",
                      isCurrentUser ? "text-white/70" : "text-gray-500"
                    )}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
