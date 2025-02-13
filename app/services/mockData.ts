import { TaskSet, Task } from '../types';

export const mockTaskSets: TaskSet[] = [
  {
    id: '1',
    name: 'Tareas Diarias',
    emoji: '📅',
    tasks: [
      { id: '1-1', title: 'Hacer ejercicio', completed: false },
      { id: '1-2', title: 'Leer 30 minutos', completed: true },
      { id: '1-3', title: 'Meditar', completed: false },
    ]
  },
  {
    id: '2',
    name: 'Compras Supermercado',
    emoji: '🛒',
    tasks: [
      { id: '2-1', title: 'Frutas y verduras', completed: false },
      { id: '2-2', title: 'Leche y huevos', completed: false },
      { id: '2-3', title: 'Pan', completed: true },
      { id: '2-4', title: 'Carne', completed: false },
    ]
  },
  {
    id: '3',
    name: 'Proyecto Casa',
    emoji: '🏠',
    tasks: [
      { id: '3-1', title: 'Pintar habitación', completed: false },
      { id: '3-2', title: 'Arreglar grifo', completed: true },
      { id: '3-3', title: 'Limpiar jardín', completed: false },
      { id: '3-4', title: 'Ordenar garage', completed: false },
    ]
  }
];

export const getTaskSets = (): TaskSet[] => {
  return mockTaskSets;
};

export const getTaskSetById = (id: string): TaskSet | undefined => {
  return mockTaskSets.find(taskSet => taskSet.id === id);
}; 