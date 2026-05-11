import { useEffect, useState } from 'react';
import { User } from '../types';
import {
  saveUser,
  getUserByEmail,
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
} from '../utils/storage';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userId = await getCurrentUser();
        if (userId) {
          setIsLoggedIn(true);
          // In a real app, fetch user data from storage
          setUser({ id: userId, email: '', password: '' });
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signup = async (email: string, password: string): Promise<boolean> => {
    try {
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        console.error('User already exists');
        return false;
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        password, // In production, hash this!
      };

      await saveUser(newUser);
      await setCurrentUser(newUser.id);
      setUser(newUser);
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const existingUser = await getUserByEmail(email);
      if (!existingUser || existingUser.password !== password) {
        console.error('Invalid credentials');
        return false;
      }

      await setCurrentUser(existingUser.id);
      setUser(existingUser);
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await clearCurrentUser();
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user,
    isLoggedIn,
    isLoading,
    signup,
    login,
    logout,
  };
};
