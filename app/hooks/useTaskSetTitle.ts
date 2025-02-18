import { useState } from 'react';
import { TaskSet } from '../types';
import { updateTaskSet } from '../settings';

export const useTaskSetTitle = (taskSet: TaskSet | null, loadTaskSet: () => Promise<void>) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');

  const handleTitleSave = async () => {
    if (editingTitle.trim() && taskSet) {
      const updatedTaskSet = { ...taskSet, name: editingTitle.trim() };
      await updateTaskSet(updatedTaskSet, taskSet.id);
      await loadTaskSet();
    }
    setIsEditingTitle(false);
  };

  return {
    isEditingTitle,
    setIsEditingTitle,
    editingTitle,
    setEditingTitle,
    handleTitleSave,
  };
}; 