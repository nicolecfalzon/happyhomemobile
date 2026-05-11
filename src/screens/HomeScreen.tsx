import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Task } from '../types';
import { formatMonthYear, isOverdue } from '../utils/dateUtils';

interface HomeScreenProps {
  tasks: Task[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, status: 'todo' | 'doing' | 'done') => void;
  onLogout: () => void;
}

type ViewMode = 'tiles' | 'status';

export const HomeScreen: React.FC<HomeScreenProps> = ({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onUpdateTaskStatus,
  onLogout,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('tiles');
  const [monthTasks, setMonthTasks] = useState<Task[]>([]);

  useEffect(() => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const filtered = tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.getMonth() === month && taskDate.getFullYear() === year;
    });
    setMonthTasks(filtered);
  }, [tasks, currentDate]);

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to remove this task?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => onDeleteTask(taskId),
          style: 'destructive',
        },
      ]
    );
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const overdue = isOverdue(task.dueDate, task.status);
    const taskDate = new Date(task.dueDate);
    const dateStr = taskDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return (
      <TouchableOpacity
        style={[styles.taskCard, { borderLeftColor: getStatusColor(task.status) }]}
        onPress={() => onEditTask(task)}
      >
        <View style={styles.taskHeader}>
          <Text style={[styles.taskTitle, overdue && styles.overdueText]}>
            {task.title}
          </Text>
          {overdue && <Text style={styles.overdueLabel}>Overdue</Text>}
        </View>
        <Text style={styles.taskDescription}>{task.description}</Text>
        <View style={styles.taskFooter}>
          <Text style={styles.taskDate}>{dateStr}</Text>
          <View style={styles.taskActions}>
            <TouchableOpacity
              onPress={() => handleDeleteTask(task.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return '#ef4444';
      case 'doing':
        return '#f59e0b';
      case 'done':
        return '#059669';
      default:
        return '#999';
    }
  };

  const StatusColumn = ({ status, label }: { status: 'todo' | 'doing' | 'done'; label: string }) => {
    const columnTasks = monthTasks.filter(t => t.status === status);

    return (
      <View style={styles.statusColumn}>
        <Text style={styles.columnLabel}>{label}</Text>
        <FlatList
          data={columnTasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TaskCard task={item} />}
          scrollEnabled={false}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>HappyHome</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={handlePreviousMonth}>
          <Text style={styles.arrowButton}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>{formatMonthYear(currentDate)}</Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Text style={styles.arrowButton}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'tiles' && styles.toggleActive]}
          onPress={() => setViewMode('tiles')}
        >
          <Text style={styles.toggleButtonText}>Tiles</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'status' && styles.toggleActive]}
          onPress={() => setViewMode('status')}
        >
          <Text style={styles.toggleButtonText}>Status</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {viewMode === 'tiles' ? (
          <FlatList
            data={monthTasks}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <TaskCard task={item} />}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No tasks for this month</Text>
            }
          />
        ) : (
          <View style={styles.statusView}>
            <StatusColumn status="todo" label="To Do" />
            <StatusColumn status="doing" label="Doing" />
            <StatusColumn status="done" label="Done" />
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={onAddTask}>
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
  },
  logoutButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#ef4444',
    borderRadius: 6,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginHorizontal: 16,
  },
  arrowButton: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
    paddingHorizontal: 8,
  },
  viewToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  toggleActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  overdueText: {
    color: '#ef4444',
  },
  overdueLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ef4444',
    backgroundColor: '#fee2e2',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  taskDescription: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 8,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  taskActions: {
    flexDirection: 'row',
    gap: 8,
  },
  deleteButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#fee2e2',
    borderRadius: 4,
  },
  deleteButtonText: {
    fontSize: 11,
    color: '#ef4444',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 32,
    fontSize: 16,
  },
  statusView: {
    flexDirection: 'row',
    gap: 8,
  },
  statusColumn: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 8,
  },
  columnLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  addButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#059669',
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
