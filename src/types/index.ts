export interface User {
  id: string;
  email: string;
  password: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'todo' | 'doing' | 'done';
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}
