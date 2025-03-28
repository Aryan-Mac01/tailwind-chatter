
// Time formatting utility
export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// User type for mock authentication
export const User = {
  id: '',
  name: '',
  email: '',
  avatar: ''
};

// Mock API functions for authentication
export const login = async (email, password) => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // In a real app, this would be a server request
      if (email === 'john@example.com' && password === 'password123') {
        resolve({
          id: '1',
          name: 'John Doe',
          email,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
        });
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 1000);
  });
};

export const register = async (name, email, password) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: '1',
        name,
        email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
      });
    }, 1000);
  });
};

export const logout = async () => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
};
