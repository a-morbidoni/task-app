import { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, FlatList, TextInput, Modal, StyleSheet } from "react-native";
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { Task, TaskSet } from "../types";
import { getTaskSets, updateTaskSet } from '../settings';
import { useTheme } from '../context/ThemeContext';
import { NewTaskModal } from '../components/NewTaskModal';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LoadingView } from '../components/LoadingView';

export default function TaskSetScreen() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [taskSet, setTaskSet] = useState<TaskSet | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTaskSet();
  }, [id]);

  const loadTaskSet = async () => {
    setIsLoading(true);
    try {
      const allTaskSets = await getTaskSets();
      const currentTaskSet = allTaskSets.find(set => set.id === id);
      if (currentTaskSet) {
        setTaskSet(currentTaskSet);
        setTasks(currentTaskSet.tasks);
        setEditingTitle(currentTaskSet.name);
      }
    } catch (error) {
      console.error('Error loading task set:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleSave = async () => {
    if (editingTitle.trim() && taskSet) {
      const updatedTaskSet = { ...taskSet, name: editingTitle.trim() };
      await updateTaskSet(updatedTaskSet, taskSet.id);
      await loadTaskSet();
    }
    setIsEditingTitle(false);
  };

  const addNewTask = async () => {
    if (newTaskText.trim() && taskSet) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskText.trim(),
        completed: false
      };
      const updatedTasks = [...tasks, newTask];
      const updatedTaskSet = { ...taskSet, tasks: updatedTasks };
      await updateTaskSet(updatedTaskSet, taskSet.id);
      await loadTaskSet();
      setModalVisible(false);
      setNewTaskText('');
    }
  };

  const toggleTask = async (taskId: string) => {
    if (taskSet) {
      const updatedTasks = tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      );
      const updatedTaskSet = { ...taskSet, tasks: updatedTasks };
      await updateTaskSet(updatedTaskSet, taskSet.id);
      await loadTaskSet();
    }
  };

  const deleteTask = async (taskId: string) => {
    if (taskSet) {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      const updatedTaskSet = { ...taskSet, tasks: updatedTasks };
      await updateTaskSet(updatedTaskSet, taskSet.id);
      await loadTaskSet();
    }
  };

  const renderRightActions = (taskId: string) => {
    return (
      <View style={styles.rightActionContainer}>
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: theme.error }]}
          onPress={() => deleteTask(taskId)}
        >
          <Ionicons name="trash-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return <LoadingView />;
  }

  return (
    <Animated.View 
      entering={FadeIn.duration(200)}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.primary} />
        </TouchableOpacity>
        {isEditingTitle ? (
          <View style={[styles.titleEditContainer, { backgroundColor: theme.surface }]}>
            <TextInput
              style={[styles.titleInput, { color: theme.text }]}
              value={editingTitle}
              onChangeText={setEditingTitle}
              onBlur={handleTitleSave}
              onSubmitEditing={handleTitleSave}
              autoFocus
              selectTextOnFocus
            />
            <TouchableOpacity 
              style={styles.saveTitleButton}
              onPress={handleTitleSave}
            >
              <Ionicons name="checkmark" size={24} color={theme.primary} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.titleContainer}
            onPress={() => setIsEditingTitle(true)}
          >
            <Text style={[styles.headerTitle, { color: theme.text }]}>{taskSet?.name}</Text>
            <Ionicons name="pencil" size={16} color={theme.textSecondary} style={styles.editIcon} />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={24} color={theme.surface} />
        <Text style={[styles.addButtonText, { color: theme.surface }]}>Nueva Tarea</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GestureHandlerRootView>
            <Swipeable
              renderRightActions={() => renderRightActions(item.id)}
              rightThreshold={40}
            >
              <TouchableOpacity 
                style={[styles.taskItem, { backgroundColor: theme.surface }]}
                onPress={() => toggleTask(item.id)}
              >
                <View style={[
                  styles.checkbox,
                  { borderColor: theme.primary },
                  item.completed && { backgroundColor: theme.primary }
                ]}>
                  {item.completed && <Ionicons name="checkmark" size={16} color={theme.surface} />}
                </View>
                <Text style={[
                  styles.taskText,
                  { color: theme.text },
                  item.completed && {
                    textDecorationLine: 'line-through',
                    color: theme.textSecondary
                  }
                ]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            </Swipeable>
          </GestureHandlerRootView>
        )}
      />

      <NewTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={addNewTask}
        taskText={newTaskText}
        onChangeText={setNewTaskText}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    paddingBottom: 70,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    marginLeft: -8,
  },
  headerEmoji: {
    fontSize: 32,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  taskText: {
    fontSize: 16,
    flex: 1,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  cancelButton: {
    backgroundColor: '#ff3b30',
  },
  saveButton: {
    backgroundColor: '#34c759',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  rightActionContainer: {
    marginBottom: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  titleEditContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginRight: 10,
  },
  titleInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    padding: 8,
  },
  saveTitleButton: {
    padding: 8,
  },
  editIcon: {
    marginLeft: 8,
    opacity: 0.6,
  },
}); 