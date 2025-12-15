import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState([
    {
      id: 1,
      email: 'admin@parking.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
      phone: '06 12 34 56 78',
      vehicle: { plate: 'ABC123', type: 'Voiture' }
    },
    {
      id: 2,
      email: 'employee@parking.com',
      password: 'emp123',
      name: 'Employee User',
      role: 'employee',
      phone: '06 98 76 54 32',
      vehicle: { plate: 'DEF456', type: 'Moto' }
    },
    {
      id: 3,
      email: 'user@parking.com',
      password: 'user123',
      name: 'Regular User',
      role: 'user',
      phone: '06 55 55 55 55',
      vehicle: { plate: 'GHI789', type: 'Voiture' }
    }
  ]);

  const addUser = (newUserData) => {
    const newUser = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      ...newUserData,
      vehicle: newUserData.vehicle || { plate: '', type: 'Voiture' }
    };
    setUsers([...users, newUser]);
    return newUser;
  };

  const login = (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    updateProfile,
    users,
    addUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
