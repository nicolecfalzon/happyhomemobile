export const generateRecurringTasks = (
  baseTask: any,
  frequency: string,
  years: number = 10
): any[] => {
  const tasks = [baseTask];
  const startDate = new Date(baseTask.dueDate);
  
  for (let i = 1; i < years * 12; i++) {
    const newDate = new Date(startDate);
    
    switch (frequency) {
      case 'daily':
        newDate.setDate(newDate.getDate() + i);
        break;
      case 'weekly':
        newDate.setDate(newDate.getDate() + i * 7);
        break;
      case 'monthly':
        newDate.setMonth(newDate.getMonth() + i);
        break;
      case 'yearly':
        newDate.setFullYear(newDate.getFullYear() + i);
        break;
    }
    
    tasks.push({
      ...baseTask,
      id: `${baseTask.id}-${i}`,
      dueDate: newDate.toISOString().split('T')[0],
    });
  }
  
  return tasks;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatMonthYear = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
};

export const getTasksForMonth = (tasks: any[], year: number, month: number): any[] => {
  return tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return taskDate.getFullYear() === year && taskDate.getMonth() === month;
  });
};

export const isOverdue = (dueDate: string, status: string): boolean => {
  if (status === 'done') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

export const getCurrentMonthYear = () => {
  const today = new Date();
  return {
    month: today.getMonth(),
    year: today.getFullYear(),
  };
};
