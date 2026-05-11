import { useEffect, useState } from 'react';
import { Task } from '../types';
import { saveTasks, getUserTasks } from '../utils/storage';
import { generateRecurringTasks, getTasksForMonth } from '../utils/dateUtils';

export const useTasks = (userId: string | null) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks on mount or when userId changes
  useEffect(() => {
    const loadTasks = async () => {
      if (!userId) {
        setTasks([]);
        setIsLoading(false);
        return;
      }

      try {
        const userTasks = await getUserTasks(userId);
        setTasks(userTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [userId]);

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    if (!userId) return false;

    try {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      let tasksToAdd = [newTask];

      // Generate recurring tasks if needed
      if (newTask.isRecurring && newTask.recurringFrequency) {
        tasksToAdd = generateRecurringTasks(newTask, newTask.recurringFrequency, 10);
      }

      const updatedTasks = [...tasks, ...tasksToAdd];
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Error adding task:', error);
      return false;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>): Promise<boolean> => {
    try {
      const updatedTasks = tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : task
      );
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      return false;
    }
  };

  const deleteTask = async (taskId: string): Promise<boolean> => {
    try {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  };

  const getTasksForCurrentMonth = (month: number, year: number) => {
    return getTasksForMonth(tasks, year, month);
  };

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    getTasksForCurrentMonth,
  };
};
