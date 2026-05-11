import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Task } from '../types';

const USERS_KEY = 'happyhome_users';
const AUTH_KEY = 'happyhome_auth';
const TASKS_KEY = 'happyhome_tasks';

// User storage
export const saveUser = async (user: User): Promise<void> => {
  try {
    const users = await getUsers();
    const updatedUsers = users.filter(u => u.id !== user.id);
    updatedUsers.push(user);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const data = await AsyncStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const users = await getUsers();
    return users.find(u => u.email === email) || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};

// Auth storage
export const setCurrentUser = async (userId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(AUTH_KEY, userId);
  } catch (error) {
    console.error('Error setting current user:', error);
  }
};

export const getCurrentUser = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(AUTH_KEY);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const clearCurrentUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_KEY);
  } catch (error) {
    console.error('Error clearing current user:', error);
  }
};

// Task storage
export const saveTasks = async (tasks: Task[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

export const getTasks = async (): Promise<Task[]> => {
  try {
    const data = await AsyncStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting tasks:', error);
    return [];
  }
};

export const getUserTasks = async (userId: string): Promise<Task[]> => {
  try {
    const tasks = await getTasks();
    return tasks.filter(t => t.userId === userId);
  } catch (error) {
    console.error('Error getting user tasks:', error);
    return [];
  }
};
