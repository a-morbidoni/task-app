import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

export function LoadingView() {
  const { theme } = useTheme();

  return (
    <Animated.View 
      entering={FadeIn.duration(200)}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.loadingContainer}>
        <Text style={[styles.loadingText, { color: theme.text }]}>Cargando...</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    paddingBottom: 70,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
  },
}); 