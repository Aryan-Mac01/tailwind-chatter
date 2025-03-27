import { v4 as uuidv4 } from 'uuid';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  status?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: number;
  status: 'sent' | 'delivered' | 'read';
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  participants: Contact[];
  lastMessage: Message | null;
}

// Mock database
let currentUser: User | null = null;

const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
  }
];

const contacts: Contact[] = [
  {
    id: '3',
    name: 'Alice Wonderland',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    status: 'Last seen: I\'m writing to Paulo'
  },
  {
    id: '4',
    name: 'Bob Roberts',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    status: 'Online'
  },
  {
    id: '5',
    name: 'Charlie Chapman',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
    status: 'Last seen: 2 hours ago'
  },
  {
    id: '6',
    name: 'David Davidson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    status: 'Last seen: yesterday'
  }
];

// Initialize with some sample messages
const messages: Message[] = [
  {
    id: '1',
    chatId: '1',
    senderId: '3',
    content: 'Hey, how are you doing?',
    timestamp: Date.now() - 86400000, // 1 day ago
    status: 'read'
  },
  {
    id: '2',
    chatId: '1',
    senderId: '1',
    content: 'I\'m good, thanks! How about you?',
    timestamp: Date.now() - 86000000,
    status: 'read'
  },
  {
    id: '3',
    chatId: '1',
    senderId: '3',
    content: 'Great! Just working on some projects. Do you want to catch up this weekend?',
    timestamp: Date.now() - 85000000,
    status: 'read'
  },
  {
    id: '4',
    chatId: '2',
    senderId: '4',
    content: 'Did you see the latest updates?',
    timestamp: Date.now() - 3600000, // 1 hour ago
    status: 'delivered'
  },
  {
    id: '5',
    chatId: '3',
    senderId: '5',
    content: 'Hello! When are we meeting?',
    timestamp: Date.now() - 7200000, // 2 hours ago
    status: 'delivered'
  }
];

// Sample chats
const chats: Chat[] = [
  {
    id: '1',
    name: 'Alice Wonderland',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    participants: [contacts[0]],
    lastMessage: messages[2]
  },
  {
    id: '2',
    name: 'Bob Roberts',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    participants: [contacts[1]],
    lastMessage: messages[3]
  },
  {
    id: '3',
    name: 'Charlie Chapman',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
    participants: [contacts[2]],
    lastMessage: messages[4]
  },
  {
    id: 'himalaya',
    name: 'Himalayas Trek',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Himalayas',
    participants: [contacts[0], contacts[1], contacts[2]],
    lastMessage: {
      id: 'group-1',
      chatId: 'himalaya',
      senderId: '3',
      content: 'Random text about the event some more random',
      timestamp: Date.now() - 1000000,
      status: 'read'
    }
  }
];

// API functions
// Auth
export const login = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(u => u.email === email);
      if (user) {
        currentUser = user;
        resolve(user);
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 800); // Simulate network delay
  });
};

export const register = async (name: string, email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (users.some(u => u.email === email)) {
        reject(new Error('Email already in use'));
        return;
      }
      
      const newUser: User = {
        id: uuidv4(),
        name,
        email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s+/g, '')}`
      };
      
      users.push(newUser);
      currentUser = newUser;
      resolve(newUser);
    }, 800);
  });
};

export const logout = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      currentUser = null;
      resolve();
    }, 300);
  });
};

// Chat
export const getChats = async (): Promise<Chat[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...chats]);
    }, 600);
  });
};

export const getMessages = async (chatId: string): Promise<Message[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const chatMessages = messages.filter(m => m.chatId === chatId);
      resolve([...chatMessages].sort((a, b) => a.timestamp - b.timestamp));
    }, 500);
  });
};

export const sendMessage = async (chatId: string, content: string): Promise<Message> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!currentUser) {
        reject(new Error('You must be logged in to send messages'));
        return;
      }
      
      const newMessage: Message = {
        id: uuidv4(),
        chatId,
        senderId: currentUser.id,
        content,
        timestamp: Date.now(),
        status: 'sent'
      };
      
      messages.push(newMessage);
      
      // Update last message in chat
      const chatIndex = chats.findIndex(c => c.id === chatId);
      if (chatIndex !== -1) {
        chats[chatIndex] = {
          ...chats[chatIndex],
          lastMessage: newMessage
        };
      }
      
      resolve(newMessage);
      
      // Simulate response after a delay for demo purposes
      if (Math.random() > 0.3) { // 70% chance of getting a reply
        setTimeout(() => {
          const chat = chats.find(c => c.id === chatId);
          if (!chat) return;
          
          const participant = chat.participants[0];
          const responseMessage: Message = {
            id: uuidv4(),
            chatId,
            senderId: participant.id,
            content: `This is an automated response from ${participant.name}`,
            timestamp: Date.now(),
            status: 'sent'
          };
          
          messages.push(responseMessage);
          
          // Update last message in chat
          const chatIndex = chats.findIndex(c => c.id === chatId);
          if (chatIndex !== -1) {
            chats[chatIndex] = {
              ...chats[chatIndex],
              lastMessage: responseMessage
            };
          }
          
          // In a real app, we would notify the user about the new message
        }, 2000 + Math.random() * 3000);
      }
    }, 300);
  });
};

export const getContacts = async (): Promise<Contact[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...contacts]);
    }, 600);
  });
};

// Helper function to format time
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Helper function to format date
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  
  // If same day, return time
  if (date.toDateString() === now.toDateString()) {
    return formatTime(timestamp);
  }
  
  // If yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  // If within the last 7 days
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);
  if (date > oneWeekAgo) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }
  
  // Otherwise return the date
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};
