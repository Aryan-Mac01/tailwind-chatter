
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from './AuthContext';
import {
  Chat,
  Message,
  Contact,
  getChats,
  getMessages,
  sendMessage as apiSendMessage,
  getContacts
} from '@/lib/api';

type ChatContextType = {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  contacts: Contact[];
  sendMessage: (content: string) => Promise<void>;
  selectChat: (chatId: string) => void;
  isLoadingChats: boolean;
  isLoadingMessages: boolean;
  createNewChat: (contactId: string) => Promise<void>;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
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
    } finally {
      setIsLoadingChats(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
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
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentChat || !user) return;
    
    try {
      const newMessage = await apiSendMessage(currentChat.id, content);
      
      // Update messages state
      setMessages(prev => [...prev, newMessage]);
      
      // Update the last message in the chat
      setChats(prev =>
        prev.map(chat =>
          chat.id === currentChat.id
            ? { ...chat, lastMessage: newMessage }
            : chat
        )
      );
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const selectChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChat(chat);
    }
  };

  const createNewChat = async (contactId: string) => {
    try {
      // In a real implementation, you'd create a new chat with the API
      // For now, let's simulate it with a local update
      const contact = contacts.find(c => c.id === contactId);
      
      if (!contact) {
        throw new Error("Contact not found");
      }
      
      const newChat: Chat = {
        id: `new-${Date.now()}`,
        name: contact.name,
        avatar: contact.avatar,
        lastMessage: null,
        participants: [contact]
      };
      
      setChats(prev => [newChat, ...prev]);
      setCurrentChat(newChat);
      
      toast({
        title: "Chat created",
        description: `You can now chat with ${contact.name}`,
      });
    } catch (error) {
      toast({
        title: "Failed to create chat",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <ChatContext.Provider 
      value={{ 
        chats, 
        currentChat, 
        messages, 
        contacts,
        sendMessage, 
        selectChat,
        isLoadingChats,
        isLoadingMessages,
        createNewChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
