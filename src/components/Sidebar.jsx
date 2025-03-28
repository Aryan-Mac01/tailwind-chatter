
import React, { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, User, Users, Settings, LogOut, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar = () => {
  const { chats, currentChat, setCurrentChat, isLoadingChats } = useChat();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();
  
  // Filter chats based on search query
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectChat = (chat) => {
    setCurrentChat(chat);
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  if (isCollapsed && isMobile) {
    return (
      <div className="absolute top-0 left-0 z-10 m-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="bg-white"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "border-r border-border bg-gray-50 flex flex-col",
      isMobile 
        ? "absolute inset-0 z-20 bg-white w-full md:w-80 md:relative" 
        : "w-80 min-w-[320px]"
    )}>
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h2 className="font-semibold">WYS Chat</h2>
        </div>
        
        {isMobile && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsCollapsed(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search chats..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="px-2">
        <div className="flex justify-between items-center px-2 mb-2">
          <h3 className="text-sm font-medium text-gray-500">Chats</h3>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {isLoadingChats ? (
          <div className="flex justify-center p-4">
            <div className="text-sm text-gray-500">Loading chats...</div>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            {filteredChats.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No chats found</p>
              </div>
            ) : (
              filteredChats.map(chat => (
                <button
                  key={chat.id}
                  className={cn(
                    "w-full flex items-center p-2 mb-1 rounded-md text-left",
                    chat.id === currentChat?.id
                      ? "bg-gray-200"
                      : "hover:bg-gray-100"
                  )}
                  onClick={() => handleSelectChat(chat)}
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback>{chat.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-medium truncate">{chat.name}</span>
                      {chat.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {new Date(chat.lastMessage.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </div>
                    
                    {chat.lastMessage && (
                      <p className="text-sm text-gray-500 truncate">
                        {chat.lastMessage.senderId === user?.id ? 'You: ' : ''}
                        {chat.lastMessage.content}
                      </p>
                    )}
                  </div>
                </button>
              ))
            )}
          </ScrollArea>
        )}
      </div>
      
      <div className="px-2 mt-4">
        <div className="flex justify-between items-center px-2 mb-2">
          <h3 className="text-sm font-medium text-gray-500">Contacts</h3>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="mt-auto border-t border-border p-4">
        <div className="flex justify-around">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
            <Users className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
            <Settings className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-500 hover:text-gray-700"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
