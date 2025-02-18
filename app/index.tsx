import { EvilIcons, Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ConfirmationModal } from './components/ConfirmationModal';
import { CreateTaskSetModal } from './components/CreateTaskSetModal';
import { LoadingView } from './components/LoadingView';
import { QRModal } from './components/QRModal';
import { useTheme } from './context/ThemeContext';
import { useModals } from './hooks/useModals';
import { useTaskSets } from './hooks/useTaskSets';
import { TaskSet } from "./types";

export default function Index() {
  const { theme } = useTheme();
  const {
    taskSets,
    isLoading,
    loadTaskSets,
    handleAddTaskSet,
    handleDeleteTaskSet,
    handleCloneTaskSet
  } = useTaskSets();
  
  const {
    modalVisible,
    setModalVisible,
    deleteModalVisible,
    setDeleteModalVisible,
    cloneModalVisible,
    setCloneModalVisible,
    qrModalVisible,
    setQRModalVisible,
    taskSetToDelete,
    setTaskSetToDelete,
    taskSetToClone,
    setTaskSetToClone,
    selectedTaskSet,
    setSelectedTaskSet,
  } = useModals();

  const [newSetName, setNewSetName] = useState('');
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (isActive) {
        loadTaskSets();
      }
      return () => { isActive = false; };
    }, [loadTaskSets])
  );

  const handleDeleteConfirmation = async (confirmed: boolean) => {
    if (confirmed && taskSetToDelete) {
      await handleDeleteTaskSet(taskSetToDelete);
    }
    setDeleteModalVisible(false);
    setTaskSetToDelete(null);
  };

  const handleCloneConfirmation = async (confirmed: boolean) => {
    if (confirmed && taskSetToClone) {
      await handleCloneTaskSet(taskSetToClone);
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

  const initiateQRGeneration = (taskSet: TaskSet) => {
    setSelectedTaskSet(taskSet);
    setQRModalVisible(true);
  };

  const renderLeftActions = (taskSet: TaskSet) => {
    return (
      <View style={styles.leftActionContainer}>
        <TouchableOpacity
          style={[styles.qrButton, { backgroundColor: theme.primary }]}
          onPress={() => initiateQRGeneration(taskSet)}
        >
          <Ionicons name="qr-code-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
    );
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
          renderLeftActions={() => renderLeftActions(item)}
          renderRightActions={() => renderRightActions(item)}
          leftThreshold={40}
          overshootLeft={false}
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
      await handleAddTaskSet(newSet);
      setModalVisible(false);
      setNewSetName('');
    }
  };

  if (isLoading) {
    return <LoadingView />;
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
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

        <QRModal
          visible={qrModalVisible}
          onClose={() => setQRModalVisible(false)}
          taskSet={selectedTaskSet}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
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
  leftActionContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrButton: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '100%',
  },
});

