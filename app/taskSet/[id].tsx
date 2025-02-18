import { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, FlatList, TextInput } from "react-native";
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { TaskSet } from "../types";
import { getTaskSets } from '../settings';
import { useTheme } from '../context/ThemeContext';
import { NewTaskModal } from '../components/NewTaskModal';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LoadingView } from '../components/LoadingView';
import { useTaskSetTitle } from '../hooks/useTaskSetTitle';
import { useTaskOperations } from '../hooks/useTaskOperations';
import { useModals } from '../hooks/useModals';
import { styles } from '../styles/taskSet.styles';

export default function TaskSetScreen() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [taskSet, setTaskSet] = useState<TaskSet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { modalVisible, setModalVisible } = useModals();

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
  
  const {
    tasks,
    setTasks,
    newTaskText,
    setNewTaskText,
    addNewTask,
    toggleTask,
    deleteTask,
  } = useTaskOperations(taskSet);

  const {
    isEditingTitle,
    setIsEditingTitle,
    editingTitle,
    setEditingTitle,
    handleTitleSave,
  } = useTaskSetTitle(taskSet, loadTaskSet);

  useEffect(() => {
    loadTaskSet();
  }, [id]);

  const renderRightActions = (taskId: string) => (
    <View style={styles.rightActionContainer}>
      <TouchableOpacity
        style={[styles.deleteButton, { backgroundColor: theme.error }]}
        onPress={() => deleteTask(taskId)}
      >
        <Ionicons name="trash-outline" size={24} color={theme.text} />
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return <LoadingView />;
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <Animated.View 
        entering={FadeIn.duration(200)}
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        {/* Header Section */}
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

        {/* Add Task Button */}
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color={theme.surface} />
          <Text style={[styles.addButtonText, { color: theme.surface }]}>Nueva Tarea</Text>
        </TouchableOpacity>

        {/* Tasks List */}
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

        {/* New Task Modal */}
        <NewTaskModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={addNewTask}
          taskText={newTaskText}
          onChangeText={setNewTaskText}
        />
      </Animated.View>
    </View>
  );
}