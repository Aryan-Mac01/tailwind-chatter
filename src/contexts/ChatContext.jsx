
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { useAuth } from './AuthContext';

// Mock data and API functions
const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock initial chats data
const mockChats = [
  {
    id: '1',
    name: 'Alice',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    lastMessage: {
      content: 'Hey, how are you?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      senderId: '2'
    },
    participants: [
      { id: '2', status: 'Online' }
    ]
  },
  {
    id: '2',
    name: 'Bob',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    lastMessage: {
      content: 'Can we meet tomorrow?',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      senderId: '3'
    },
    participants: [
      { id: '3', status: 'Offline' }
    ]
  },
  {
    id: '3',
    name: 'Group Chat',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Group',
    lastMessage: {
      content: 'I\'ll be there in 5 minutes',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      senderId: '4'
    },
    participants: [
      { id: '4', status: 'Online' },
      { id: '5', status: 'Offline' },
      { id: '6', status: 'Online' }
    ]
  }
];

// Mock messages for each chat
const mockMessages = {
  '1': [
    {
      id: 'm1',
      content: 'Hey there!',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      senderId: '1'
    },
    {
      id: 'm2',
      content: 'Hi! How are you?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      senderId: '2'
    }
  ],
  '2': [
    {
      id: 'm3',
      content: 'Are you free tomorrow?',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      senderId: '1'
    },
    {
      id: 'm4',
      content: 'Can we meet tomorrow?',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      senderId: '3'
    }
  ],
  '3': [
    {
      id: 'm5',
      content: 'Where should we meet?',
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      senderId: '5'
    },
    {
      id: 'm6',
      content: 'Let\'s meet at the cafe',
      timestamp: new Date(Date.now() - 172801000).toISOString(),
      senderId: '1'
    },
    {
      id: 'm7',
      content: 'I\'ll be there in 5 minutes',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      senderId: '4'
    }
  ]
};

// Mock contacts
const mockContacts = [
  {
    id: '2',
    name: 'Alice',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    status: 'Online'
  },
  {
    id: '3',
    name: 'Bob',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    status: 'Offline'
  },
  {
    id: '4',
    name: 'Charlie',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
    status: 'Online'
  }
];

// Mock API functions
const getChats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockChats);
    }, 1000);
  });
};

const getMessages = async (chatId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMessages[chatId] || []);
    }, 800);
  });
};

const getContacts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockContacts);
    }, 1200);
  });
};

// Format time utility function
export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatContext = createContext(undefined);

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch chats when user changes
  useEffect(() => {
    if (user) {
      fetchChats();
      fetchContacts();
    } else {
      setChats([]);
      setCurrentChat(null);
      setMessages([]);
      setContacts([]);
    }
  }, [user]);

  // Fetch messages when currentChat changes
  useEffect(() => {
    if (currentChat) {
      fetchMessages(currentChat.id);
    } else {
      setMessages([]);
    }
  }, [currentChat]);

  const fetchChats = async () => {
    if (!user) return;
    
    try {
      setIsLoadingChats(true);
      const fetchedChats = await getChats();
      setChats(fetchedChats);
      
      // Select the first chat if none is selected
      if (fetchedChats.length > 0 && !currentChat) {
        setCurrentChat(fetchedChats[0]);
      }
    } catch (error) {
      toast({
        title: "Failed to load chats",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      sonnerToast.error("Failed to load chats", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsLoadingChats(false);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      setIsLoadingMessages(true);
      const fetchedMessages = await getMessages(chatId);
      setMessages(fetchedMessages);
    } catch (error) {
      toast({
        title: "Failed to load messages",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      sonnerToast.error("Failed to load messages", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const fetchedContacts = await getContacts();
      setContacts(fetchedContacts);
    } catch (error) {
      toast({
        title: "Failed to load contacts",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      sonnerToast.error("Failed to load contacts", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  const sendMessage = (content) => {
    if (!user || !currentChat) return;
    
    const newMessage = {
      id: generateId(),
      content,
      timestamp: new Date().toISOString(),
      senderId: user.id
    };
    
    // Add message to current chat
    setMessages(prev => [...prev, newMessage]);
    
    // Update last message in chats list
    setChats(prev => 
      prev.map(chat => 
        chat.id === currentChat.id 
          ? { ...chat, lastMessage: newMessage } 
          : chat
      )
    );
    
    // In a real app, you would send the message to the server here
    sonnerToast.success("Message sent");
  };

  const value = {
    chats,
    currentChat,
    setCurrentChat,
    messages,
    contacts,
    isLoadingChats,
    isLoadingMessages,
    sendMessage,
    fetchChats,
    fetchMessages,
    fetchContacts
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
