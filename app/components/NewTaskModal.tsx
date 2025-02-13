import { Text, View, TouchableOpacity, TextInput, Modal, StyleSheet } from "react-native";
import { useTheme } from '../context/ThemeContext';

interface NewTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  taskText: string;
  onChangeText: (text: string) => void;
}

export function NewTaskModal({ visible, onClose, onSave, taskText, onChangeText }: NewTaskModalProps) {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Nueva Tarea</Text>
          <TextInput
            style={[styles.input, { 
              borderColor: theme.border,
              color: theme.text,
              backgroundColor: theme.background
            }]}
            placeholder="Descripción de la tarea"
            placeholderTextColor={theme.textSecondary}
            value={taskText}
            onChangeText={onChangeText}
            multiline
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.border }]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={onSave}
            >
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
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
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
}); 