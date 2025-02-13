export type Task = {
  id: string;
  text?: string;
  title?: string;
  completed: boolean;
}

export type TaskSet = {
  id: string;
  name: string;
  emoji: string;
  tasks: Task[];
} 