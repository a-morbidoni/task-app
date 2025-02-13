import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmationModal({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Aceptar",
  cancelText = "Cancelar"
}: ConfirmationModalProps) {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
    >
      <View style={[
        styles.modalContainer,
        { backgroundColor: 'rgba(0,0,0,0.5)' }
      ]}>
        <View style={[
          styles.modalContent,
          { backgroundColor: theme.surface }
        ]}>
          <Text style={[
            styles.modalTitle,
            { color: theme.text }
          ]}>
            {title}
          </Text>
          <Text style={[
            styles.modalMessage,
            { color: theme.textSecondary }
          ]}>
            {message}
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[
                styles.button,
                { backgroundColor: theme.border }
              ]}
              onPress={onCancel}
            >
              <Text style={[
                styles.buttonText,
                { color: theme.text }
              ]}>
                {cancelText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.button,
                { backgroundColor: theme.primary }
              ]}
              onPress={onConfirm}
            >
              <Text style={[
                styles.buttonText,
                { color: theme.surface }
              ]}>
                {confirmText}
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
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
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