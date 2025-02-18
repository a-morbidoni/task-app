import React from 'react';
import { Modal, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '../context/ThemeContext';
import { TaskSet } from '../types';

interface QRModalProps {
  visible: boolean;
  onClose: () => void;
  taskSet: TaskSet | null;
}

export function QRModal({ visible, onClose, taskSet }: QRModalProps) {
  const { theme } = useTheme();

  if (!taskSet) return null;

  // Convertir el conjunto de tareas a string para el QR
  const taskSetData = JSON.stringify(taskSet);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: theme.surface }]}>
          <Text style={[styles.title, { color: theme.text }]}>
            {taskSet.name}
          </Text>
          <View style={styles.qrContainer}>
            <QRCode
              value={taskSetData}
              size={200}
              backgroundColor={theme.surface}
              color={theme.text}
            />
          </View>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={onClose}
          >
            <Text style={[styles.buttonText, { color: theme.surface }]}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  qrContainer: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 15,
    minWidth: 100,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 