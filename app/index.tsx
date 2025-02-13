import { useState } from "react";
import { Text, View, TouchableOpacity, FlatList, TextInput, Modal, StyleSheet } from "react-native";
import { EvilIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { Task, TaskSet } from "./types";
import { getTaskSets } from "./services/mockData";

export default function Index() {
  const [taskSets, setTaskSets] = useState<TaskSet[]>(getTaskSets());
  const [modalVisible, setModalVisible] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  const [newSetEmoji, setNewSetEmoji] = useState('');
  const router = useRouter();

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
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <EvilIcons name="plus" size={30} color="white" />
        <Text style={styles.addButtonText}>Nuevo Conjunto</Text>
      </TouchableOpacity>

      <FlatList
        data={taskSets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.taskSetItem}
            onPress={() => router.push({
              pathname: "/taskSet/[id]",
              params: { id: item.id }
            })}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.taskSetName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Conjunto de Tareas</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del conjunto"
              value={newSetName}
              onChangeText={setNewSetName}
            />
            <TextInput
              style={styles.input}
              placeholder="Emoji (opcional)"
              value={newSetEmoji}
              onChangeText={setNewSetEmoji}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={addNewSet}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
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
});

