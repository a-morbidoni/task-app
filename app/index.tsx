import { EvilIcons, Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ConfirmationModal } from './components/ConfirmationModal';
import { CreateTaskSetModal } from './components/CreateTaskSetModal';
import { useTheme } from './context/ThemeContext';
import { addTaskSet, deleteTaskSet, getTaskSets } from './settings';
import { TaskSet } from "./types";
import { LoadingView } from './components/LoadingView';

export default function Index() {
  const { theme } = useTheme();
  const [taskSets, setTaskSets] = useState<TaskSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [cloneModalVisible, setCloneModalVisible] = useState(false);
  const [taskSetToDelete, setTaskSetToDelete] = useState<string | null>(null);
  const [taskSetToClone, setTaskSetToClone] = useState<TaskSet | null>(null);
  const [newSetName, setNewSetName] = useState('');
  const [newSetEmoji, setNewSetEmoji] = useState('');
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadData = async () => {
        setIsLoading(true);
        try {
          const savedTaskSets = await getTaskSets();
          if (isActive) {
            setTaskSets(savedTaskSets);
          }
        } catch (error) {
          console.error('Error loading task sets:', error);
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      };

      loadData();

      // Cleanup function
      return () => {
        isActive = false;
      };
    }, []) // Empty dependency array
  );

  const handleDeleteConfirmation = async (confirmed: boolean) => {
    if (confirmed && taskSetToDelete) {
      await deleteTaskSet(taskSetToDelete);
      const updatedTaskSets = await getTaskSets();
      setTaskSets(updatedTaskSets);
    }
    setDeleteModalVisible(false);
    setTaskSetToDelete(null);
  };

  const handleCloneConfirmation = async (confirmed: boolean) => {
    if (confirmed && taskSetToClone) {
      const clonedSet: TaskSet = {
        ...taskSetToClone,
        id: Date.now().toString(),
        name: `${taskSetToClone.name} (copia)`,
        tasks: [...taskSetToClone.tasks]
      };
      await addTaskSet(clonedSet);
      await getTaskSets();
    }
    setCloneModalVisible(false);
    setTaskSetToClone(null);
  };

  const initiateDelete = (id: string) => {
    setTaskSetToDelete(id);
    setDeleteModalVisible(true);
  };

  const initiateClone = (taskSet: TaskSet) => {
    setTaskSetToClone(taskSet);
    setCloneModalVisible(true);
  };

  const renderRightActions = (taskSet: TaskSet) => {
    return (
      <View style={styles.rightActionContainer}>
        <TouchableOpacity
          style={[styles.cloneButton, { backgroundColor: theme.success }]}
          onPress={() => initiateClone(taskSet)}
        >
          <Ionicons name="copy-outline" size={24} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: theme.error }]}
          onPress={() => initiateDelete(taskSet.id)}
        >
          <Ionicons name="trash-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderTaskSet = ({ item }: { item: TaskSet }) => {
    const completedTasks = item.tasks.filter(task => task.completed).length;
    const totalTasks = item.tasks.length;

    return (
      <GestureHandlerRootView>
        <Swipeable
          renderRightActions={() => renderRightActions(item)}
          rightThreshold={40}
        >
          <TouchableOpacity 
            style={[styles.taskSetItem, { backgroundColor: theme.surface }]}
            onPress={() => router.push({
              pathname: "/taskSet/[id]",
              params: { id: item.id }
            })}
          >
            <Text style={[styles.taskSetName, { color: theme.text }]}>{item.name}</Text>
            <Text style={[styles.taskCounter, { color: theme.text }]}>
              {completedTasks}/{totalTasks}
            </Text>
          </TouchableOpacity>
        </Swipeable>
      </GestureHandlerRootView>
    );
  };

  const addNewSet = async () => {
    if (newSetName.trim()) {
      const newSet: TaskSet = {
        id: Date.now().toString(),
        name: newSetName.trim(),
        tasks: []
      };
      await addTaskSet(newSet);
      const updatedTaskSets = await getTaskSets();
      setTaskSets(updatedTaskSets);
      setModalVisible(false);
      setNewSetName('');
      setNewSetEmoji('');
    }
  };

  if (isLoading) {
    return <LoadingView />;
  }

  return (
    <Animated.View 
      entering={FadeIn.duration(200)}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        onPress={() => setModalVisible(true)}
      >
        <EvilIcons name="plus" size={30} color={theme.surface} />
        <Text style={[styles.addButtonText, { color: theme.surface }]}>Nuevo Conjunto</Text>
      </TouchableOpacity>

      <FlatList
        data={taskSets}
        keyExtractor={(item) => item.id}
        renderItem={renderTaskSet}
      />

      <CreateTaskSetModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={addNewSet}
        newSetName={newSetName}
        setNewSetName={setNewSetName}
        newSetEmoji={newSetEmoji}
        setNewSetEmoji={setNewSetEmoji}
      />

      <ConfirmationModal
        visible={deleteModalVisible}
        title="Eliminar Conjunto"
        message="¿Estás seguro que deseas eliminar este conjunto y todas sus tareas?"
        onConfirm={() => handleDeleteConfirmation(true)}
        onCancel={() => handleDeleteConfirmation(false)}
        confirmText="Eliminar"
      />

      <ConfirmationModal
        visible={cloneModalVisible}
        title="Clonar Conjunto"
        message={`¿Deseas crear una copia de "${taskSetToClone?.name}"?`}
        onConfirm={() => handleCloneConfirmation(true)}
        onCancel={() => handleCloneConfirmation(false)}
        confirmText="Clonar"
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
  taskSetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  emoji: {
    fontSize: 24,
    marginRight: 10,
  },
  taskSetName: {
    fontSize: 16,
    flex: 1,
  },
  taskCounter: {
    fontSize: 14,
    marginLeft: 10,
  },
  rightActionContainer: {
    flexDirection: 'row',
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
    width: 70,
    height: '100%',
  },
  cloneButton: {
    backgroundColor: '#34c759',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '100%',
  },
});

