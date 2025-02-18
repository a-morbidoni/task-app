import { useState } from 'react';
import { Task, TaskSet } from '../types';
import { updateTaskSet } from '../settings';

export const useTaskOperations = (taskSet: TaskSet | null) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');

  const addNewTask = async () => {
    if (newTaskText.trim() && taskSet) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskText.trim(),
        completed: false
      };
      
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      
      const updatedTaskSet = { ...taskSet, tasks: updatedTasks };
      await updateTaskSet(updatedTaskSet, taskSet.id);
      
      setNewTaskText('');
      return true;
    }
    return false;
  };

  const toggleTask = async (taskId: string) => {
    if (taskSet) {
      const updatedTasks = tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      );
      setTasks(updatedTasks);
      
      const updatedTaskSet = { ...taskSet, tasks: updatedTasks };
      await updateTaskSet(updatedTaskSet, taskSet.id);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (taskSet) {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      
      const updatedTaskSet = { ...taskSet, tasks: updatedTasks };
      await updateTaskSet(updatedTaskSet, taskSet.id);
    }
  };

  return {
    tasks,
    setTasks,
    newTaskText,
    setNewTaskText,
    addNewTask,
    toggleTask,
    deleteTask,
  };
}; 