import { useState } from 'react';
import { TaskSet } from "../types";

export const useModals = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [cloneModalVisible, setCloneModalVisible] = useState(false);
  const [qrModalVisible, setQRModalVisible] = useState(false);
  const [taskSetToDelete, setTaskSetToDelete] = useState<string | null>(null);
  const [taskSetToClone, setTaskSetToClone] = useState<TaskSet | null>(null);
  const [selectedTaskSet, setSelectedTaskSet] = useState<TaskSet | null>(null);

  return {
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
  };
}; 