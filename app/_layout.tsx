import { Stack } from "expo-router";
import { View, StyleSheet, Text } from 'react-native';
import { BottomNav } from './components/BottomNav';
import { ThemeProvider } from './context/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <View style={styles.container}>
          <View style={styles.content}>
            <Stack
              screenOptions={{
                headerShown: false,
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
            </Stack>
          </View>
          <BottomNav />
        </View>
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
