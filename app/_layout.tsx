import { Stack } from "expo-router";
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomNav } from './components/BottomNav';
import { ThemeProvider } from './context/ThemeContext';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 200,
            contentStyle: {
              backgroundColor: 'transparent',
            },
          }}
        >
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
          <Stack.Screen 
            name="scan-qr" 
            options={{ 
              title: "Escanear QR"
            }} 
          />
        </Stack>
        <BottomNav />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
