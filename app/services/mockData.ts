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
  },
  {
    id: '4',
    name: 'Proyecto Trabajo',
    emoji: '💼',
    tasks: [
      { id: '4-1', title: 'Preparar presentación', completed: false },
      { id: '4-2', title: 'Enviar informes', completed: true },
      { id: '4-3', title: 'Reunión con cliente', completed: false },
      { id: '4-4', title: 'Actualizar documentación', completed: false },
      { id: '4-5', title: 'Revisar presupuesto', completed: true },
    ]
  },
  {
    id: '5',
    name: 'Ejercicio Semanal',
    emoji: '🏃',
    tasks: [
      { id: '5-1', title: 'Correr 5km', completed: false },
      { id: '5-2', title: 'Yoga', completed: false },
      { id: '5-3', title: 'Natación', completed: true },
    ]
  },
  {
    id: '6',
    name: 'Estudios',
    emoji: '📚',
    tasks: [
      { id: '6-1', title: 'Repasar matemáticas', completed: false },
      { id: '6-2', title: 'Hacer tarea de inglés', completed: true },
      { id: '6-3', title: 'Preparar examen', completed: false },
      { id: '6-4', title: 'Estudiar historia', completed: false },
      { id: '6-5', title: 'Practicar programación', completed: true },
      { id: '6-6', title: 'Leer capítulo 5', completed: false },
    ]
  },
  {
    id: '7',
    name: 'Mascotas',
    emoji: '🐾',
    tasks: [
      { id: '7-1', title: 'Comprar comida', completed: true },
      { id: '7-2', title: 'Visita al veterinario', completed: false },
    ]
  },
  {
    id: '8',
    name: 'Viaje Vacaciones',
    emoji: '✈️',
    tasks: [
      { id: '8-1', title: 'Reservar vuelos', completed: true },
      { id: '8-2', title: 'Reservar hotel', completed: true },
      { id: '8-3', title: 'Hacer maletas', completed: false },
      { id: '8-4', title: 'Cambiar dinero', completed: false },
      { id: '8-5', title: 'Revisar documentos', completed: false },
      { id: '8-6', title: 'Comprar seguro', completed: true },
      { id: '8-7', title: 'Planear itinerario', completed: false },
    ]
  },
  {
    id: '9',
    name: 'Mantenimiento Coche',
    emoji: '🚗',
    tasks: [
      { id: '9-1', title: 'Cambiar aceite', completed: true },
      { id: '9-2', title: 'Revisar frenos', completed: false },
      { id: '9-3', title: 'Lavar coche', completed: false },
      { id: '9-4', title: 'Verificar presión neumáticos', completed: true },
    ]
  },
  {
    id: '10',
    name: 'Jardinería',
    emoji: '🌱',
    tasks: [
      { id: '10-1', title: 'Plantar flores', completed: false },
      { id: '10-2', title: 'Podar arbustos', completed: true },
      { id: '10-3', title: 'Regar plantas', completed: false },
    ]
  },
  {
    id: '11',
    name: 'Tecnología',
    emoji: '💻',
    tasks: [
      { id: '11-1', title: 'Actualizar software', completed: true },
      { id: '11-2', title: 'Hacer backup', completed: false },
      { id: '11-3', title: 'Limpiar archivos', completed: false },
      { id: '11-4', title: 'Organizar fotos', completed: false },
      { id: '11-5', title: 'Cambiar contraseñas', completed: true },
    ]
  },
  {
    id: '12',
    name: 'Cocina',
    emoji: '👨‍🍳',
    tasks: [
      { id: '12-1', title: 'Preparar menú semanal', completed: false },
      { id: '12-2', title: 'Organizar despensa', completed: true },
      { id: '12-3', title: 'Limpiar nevera', completed: false },
      { id: '12-4', title: 'Hacer lista de compras', completed: true },
    ]
  },
  {
    id: '13',
    name: 'Desarrollo Personal',
    emoji: '🎯',
    tasks: [
      { id: '13-1', title: 'Escribir diario', completed: false },
      { id: '13-2', title: 'Practicar mindfulness', completed: true },
      { id: '13-3', title: 'Establecer metas mensuales', completed: false },
      { id: '13-4', title: 'Leer libro autoayuda', completed: false },
      { id: '13-5', title: 'Evaluar progreso', completed: true },
      { id: '13-6', title: 'Planificar siguiente mes', completed: false },
    ]
  }
];

export const getTaskSets = (): TaskSet[] => {
  return mockTaskSets;
};

export const getTaskSetById = (id: string): TaskSet | undefined => {
  return mockTaskSets.find(taskSet => taskSet.id === id);
}; 