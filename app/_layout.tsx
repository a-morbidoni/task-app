import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Mis Conjuntos de Tareas"
        }} 
      />
      <Stack.Screen 
        name="taskSet/[id]" 
        options={{ 
          title: "Tareas"
        }} 
      />
    </Stack>
  );
}
