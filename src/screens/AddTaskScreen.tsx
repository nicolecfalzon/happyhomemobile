import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  ScrollView,
  Alert,
  Switch,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Task } from '../types';

interface AddTaskScreenProps {
  isVisible: boolean;
  task?: Task | null;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
}

type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly' | null;

export const AddTaskScreen: React.FC<AddTaskScreenProps> = ({
  isVisible,
  task,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<RecurrenceFrequency>(null);
  const [status, setStatus] = useState<'todo' | 'doing' | 'done'>('todo');
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(new Date(task.dueDate));
      setStatus(task.status);
      setIsRecurring(task.isRecurring);
      setRecurringFrequency((task.recurringFrequency as RecurrenceFrequency) || null);
    } else {
      resetForm();
    }
  }, [task, isVisible]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate(new Date());
    setStatus('todo');
    setIsRecurring(false);
    setRecurringFrequency(null);
    setShowFrequencyPicker(false);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDueDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    if (isRecurring && !recurringFrequency) {
      Alert.alert('Error', 'Please select a recurrence frequency');
      return;
    }

    const taskData = {
      title,
      description,
      dueDate: dueDate.toISOString().split('T')[0],
      status,
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : undefined,
    };

    onSave(taskData);
    resetForm();
    onClose();
  };

  const frequencyOptions = [
    { label: 'Daily', value: 'daily' as const },
    { label: 'Weekly', value: 'weekly' as const },
    { label: 'Monthly', value: 'monthly' as const },
    { label: 'Yearly', value: 'yearly' as const },
  ];

  const statusOptions = [
    { label: 'To Do', value: 'todo' as const },
    { label: 'Doing', value: 'doing' as const },
    { label: 'Done', value: 'done' as const },
  ];

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{task ? 'Edit Task' : 'Add Task'}</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Title */}
          <View style={styles.section}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter task title"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#ccc"
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter task description"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              placeholderTextColor="#ccc"
            />
          </View>

          {/* Due Date */}
          <View style={styles.section}>
            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {dueDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dueDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
              />
            )}
          </View>

          {/* Status */}
          <View style={styles.section}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusButtons}>
              {statusOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.statusButton,
                    status === option.value && styles.statusButtonActive,
                  ]}
                  onPress={() => setStatus(option.value)}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      status === option.value && styles.statusButtonTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recurring */}
          <View style={styles.section}>
            <View style={styles.recurringHeader}>
              <Text style={styles.label}>Recurring Task</Text>
              <Switch
                value={isRecurring}
                onValueChange={setIsRecurring}
                trackColor={{ false: '#ccc', true: '#a7f3d0' }}
                thumbColor={isRecurring ? '#059669' : '#f4f4f4'}
              />
            </View>

            {isRecurring && (
              <View>
                <Text style={styles.sublabel}>How often?</Text>
                <TouchableOpacity
                  style={styles.frequencyButton}
                  onPress={() => setShowFrequencyPicker(!showFrequencyPicker)}
                >
                  <Text style={styles.frequencyButtonText}>
                    {recurringFrequency
                      ? frequencyOptions.find(f => f.value === recurringFrequency)?.label
                      : 'Select frequency'}
                  </Text>
                  <Text style={styles.dropdownArrow}>
                    {showFrequencyPicker ? '▼' : '▶'}
                  </Text>
                </TouchableOpacity>

                {showFrequencyPicker && (
                  <View style={styles.frequencyOptions}>
                    {frequencyOptions.map(option => (
                      <TouchableOpacity
                        key={option.value}
                        style={styles.frequencyOption}
                        onPress={() => {
                          setRecurringFrequency(option.value);
                          setShowFrequencyPicker(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.frequencyOptionText,
                            recurringFrequency === option.value &&
                              styles.frequencyOptionTextActive,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>

          <View style={styles.spacer} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  closeButton: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  saveButton: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  sublabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    color: '#1f2937',
  },
  textArea: {
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f9fafb',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#0ea5e9',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  statusButtonTextActive: {
    color: '#0ea5e9',
  },
  recurringHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  frequencyButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f9fafb',
  },
  frequencyButtonText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#6b7280',
  },
  frequencyOptions: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f9fafb',
  },
  frequencyOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  frequencyOptionText: {
    fontSize: 14,
    color: '#6b7280',
  },
  frequencyOptionTextActive: {
    color: '#059669',
    fontWeight: '600',
  },
  spacer: {
    height: 40,
  },
});
