
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChat } from '@/contexts/ChatContext';
import { formatDate } from '@/lib/api';
import { User, Home, MessageSquare, Settings, Search, Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar = ({ onClose }) => {
  const { chats, selectChat, currentChat } = useChat();
  const [activeTab, setActiveTab] = useState('people');
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const filteredChats = chats.filter(chat => {
    const matchesTab = activeTab === 'groups' 
      ? chat.participants.length > 1 
      : chat.participants.length === 1;
    
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const handleChatSelect = (chatId) => {
    selectChat(chatId);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <aside className={`${isMobile ? 'w-full' : 'w-80'} border-r border-border h-full flex flex-col bg-white`}>
      <div className="flex items-center p-4 border-b border-border">
        <div className="text-xl font-bold">WYS</div>
        <div className="flex-1 text-center">Chats</div>
        <div className="flex items-center space-x-2">
          {isMobile && onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          )}
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <Bell className="h-5 w-5 text-gray-500" />
        </div>
      </div>
      
      <div className="p-4 border-b border-border">
        <div className="mb-4">
          <div className="font-medium text-sm mb-2">Requests</div>
          <div className="flex space-x-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Request1" />
              <AvatarFallback>R1</AvatarFallback>
            </Avatar>
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Request2" />
              <AvatarFallback>R2</AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        <Tabs defaultValue="people" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="w-full bg-transparent border-b border-border p-0 h-auto">
            <TabsTrigger
              value="people"
              className={`flex-1 pb-2 rounded-none ${activeTab === 'people' ? 'tab-active' : ''}`}
            >
              People
            </TabsTrigger>
            <TabsTrigger
              value="groups"
              className={`flex-1 pb-2 rounded-none ${activeTab === 'groups' ? 'tab-active' : ''}`}
            >
              Groups
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search"
            className="pl-9 bg-gray-100 border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-border">
          {filteredChats.map(chat => (
            <div 
              key={chat.id}
              className={`p-4 flex items-start hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                currentChat?.id === chat.id ? 'bg-gray-50' : ''
              }`}
              onClick={() => handleChatSelect(chat.id)}
            >
              <Avatar className="h-12 w-12 mr-3">
                <AvatarImage src={chat.avatar} />
                <AvatarFallback>{chat.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <div className="font-medium text-sm truncate">{chat.name}</div>
                  <div className="text-xs text-gray-400">
                    {chat.lastMessage ? formatDate(chat.lastMessage.timestamp) : ''}
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 truncate">
                  {chat.lastMessage?.content || 'No messages yet'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-2 border-t border-border">
        <div className="flex justify-around">
          <div className="p-2">
            <Home className="sidebar-icon" />
          </div>
          <div className="p-2">
            <MessageSquare className="sidebar-icon sidebar-icon-active" />
          </div>
          <div className="p-2">
            <User className="sidebar-icon" />
          </div>
          <div className="p-2">
            <Settings className="sidebar-icon" />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
