import React from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface CreateTaskSetModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  newSetName: string;
  setNewSetName: (name: string) => void;
  newSetEmoji: string;
  setNewSetEmoji: (emoji: string) => void;
}

export function CreateTaskSetModal({
  visible,
  onClose,
  onSave,
  newSetName,
  setNewSetName,
  newSetEmoji,
  setNewSetEmoji,
}: CreateTaskSetModalProps) {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={[
        styles.modalContainer,
        { backgroundColor: 'rgba(0,0,0,0.5)' }
      ]}>
        <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>
            Nuevo Conjunto de Tareas
          </Text>
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
              style={[styles.button, { backgroundColor: theme.border }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: theme.text }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={onSave}
            >
              <Text style={[styles.buttonText, { color: theme.surface }]}>
                Guardar
              </Text>
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
    textAlign: 'center',
    fontSize: 16,
  },
}); 