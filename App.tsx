import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { AddTaskScreen } from './src/screens/AddTaskScreen';
import { useAuth } from './src/hooks/useAuth';
import { useTasks } from './src/hooks/useTasks';
import { Task } from './src/types';

export default function App() {
  const { user, isLoggedIn, isLoading, signup, login, logout } = useAuth();
  const { tasks, addTask, updateTask, deleteTask } = useTasks(user?.id || null);
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  if (!isLoggedIn || !user) {
    return (
      <LoginScreen
        onLogin={login}
        onSignup={signup}
      />
    );
  }

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    addTask(taskData);
    setIsAddTaskModalVisible(false);
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsAddTaskModalVisible(true);
  };

  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setIsAddTaskModalVisible(false);
      setEditingTask(null);
    }
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (editingTask) {
      handleUpdateTask(taskData);
    } else {
      handleAddTask(taskData);
    }
  };

  return (
    <>
      <HomeScreen
        tasks={tasks}
        onAddTask={() => {
          setEditingTask(null);
          setIsAddTaskModalVisible(true);
        }}
        onEditTask={handleEditTask}
        onDeleteTask={deleteTask}
        onUpdateTaskStatus={(taskId, status) => updateTask(taskId, { status })}
        onLogout={logout}
      />
      <AddTaskScreen
        isVisible={isAddTaskModalVisible}
        task={editingTask}
        onClose={() => {
          setIsAddTaskModalVisible(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
      />
    </>
  );
}
