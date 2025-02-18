import { useState, useCallback } from 'react';
import { TaskSet } from "../types";
import { addTaskSet, deleteTaskSet, getTaskSets } from '../settings';

export const useTaskSets = () => {
  const [taskSets, setTaskSets] = useState<TaskSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTaskSets = useCallback(async () => {
    setIsLoading(true);
    try {
      const savedTaskSets = await getTaskSets();
      setTaskSets(savedTaskSets);
    } catch (error) {
      console.error('Error loading task sets:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAddTaskSet = async (newSet: TaskSet) => {
    await addTaskSet(newSet);
    setTaskSets(currentSets => [...currentSets, newSet]);
  };

  const handleDeleteTaskSet = async (id: string) => {
    await deleteTaskSet(id);
    setTaskSets(currentSets => currentSets.filter(set => set.id !== id));
  };

  const handleCloneTaskSet = async (taskSet: TaskSet) => {
    const clonedSet: TaskSet = {
      ...taskSet,
      id: Date.now().toString(),
      name: `${taskSet.name} (copia)`,
      tasks: [...taskSet.tasks]
    };
    await addTaskSet(clonedSet);
    setTaskSets(currentSets => [...currentSets, clonedSet]);
  };

  return {
    taskSets,
    isLoading,
    loadTaskSets,
    handleAddTaskSet,
    handleDeleteTaskSet,
    handleCloneTaskSet
  };
}; 