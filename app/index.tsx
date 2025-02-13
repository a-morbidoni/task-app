import { useState } from "react";
import { Text, View, TouchableOpacity, FlatList, TextInput, Modal, StyleSheet } from "react-native";
import { EvilIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Task, TaskSet } from "./types";
import { getTaskSets } from "./services/mockData";
import { ConfirmationModal } from './components/ConfirmationModal';
import { useTheme } from './context/ThemeContext';

export default function Index() {
  const { theme } = useTheme();
  const [taskSets, setTaskSets] = useState<TaskSet[]>(getTaskSets());
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [cloneModalVisible, setCloneModalVisible] = useState(false);
  const [taskSetToDelete, setTaskSetToDelete] = useState<string | null>(null);
  const [taskSetToClone, setTaskSetToClone] = useState<TaskSet | null>(null);
  const [newSetName, setNewSetName] = useState('');
  const [newSetEmoji, setNewSetEmoji] = useState('');
  const router = useRouter();

  const handleDeleteConfirmation = (confirmed: boolean) => {
    if (confirmed && taskSetToDelete) {
      setTaskSets(taskSets.filter(set => set.id !== taskSetToDelete));
    }
    setDeleteModalVisible(false);
    setTaskSetToDelete(null);
  };

  const handleCloneConfirmation = (confirmed: boolean) => {
    if (confirmed && taskSetToClone) {
      const clonedSet: TaskSet = {
        ...taskSetToClone,
        id: Date.now().toString(),
        name: `${taskSetToClone.name} (copia)`,
        tasks: [...taskSetToClone.tasks]
      };
      setTaskSets([...taskSets, clonedSet]);
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

  const renderTaskSet = ({ item }: { item: TaskSet }) => (
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
          <Text style={styles.emoji}>{item.emoji}</Text>
          <Text style={[styles.taskSetName, { color: theme.text }]}>{item.name}</Text>
        </TouchableOpacity>
      </Swipeable>
    </GestureHandlerRootView>
  );

  const addNewSet = () => {
    if (newSetName.trim()) {
      const newSet: TaskSet = {
        id: Date.now().toString(),
        name: newSetName.trim(),
        emoji: newSetEmoji || '📝',
        tasks: []
      };
      setTaskSets([...taskSets, newSet]);
      setModalVisible(false);
      setNewSetName('');
      setNewSetEmoji('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Nuevo Conjunto de Tareas</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: theme.border,
                color: theme.text,
                backgroundColor: theme.background
              }]}
              placeholder="Nombre del conjunto"
              placeholderTextColor={theme.textSecondary}
              value={newSetName}
              onChangeText={setNewSetName}
            />
            <TextInput
              style={[styles.input, { 
                borderColor: theme.border,
                color: theme.text,
                backgroundColor: theme.background
              }]}
              placeholder="Emoji (opcional)"
              placeholderTextColor={theme.textSecondary}
              value={newSetEmoji}
              onChangeText={setNewSetEmoji}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.button, { backgroundColor: theme.error }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, { backgroundColor: theme.success }]}
                onPress={addNewSet}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    </View>
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

