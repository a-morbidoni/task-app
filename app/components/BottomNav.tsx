import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();

  return (
    <View style={[
      styles.bottomNav, 
      { 
        backgroundColor: theme.surface,
        borderTopColor: theme.border
      }
    ]}>
      <TouchableOpacity 
        style={styles.bottomNavButton}
        onPress={() => router.push("/settings")}
      >
        <Ionicons 
          name={pathname === "/settings" ? "settings" : "settings-outline"} 
          size={24} 
          color={theme.primary}
        />
        <Text style={[styles.bottomNavText, { color: theme.primary }]}>
          Configuración
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.bottomNavButton}
        onPress={() => router.push("/")}
      >
        <Ionicons 
          name={pathname === "/" ? "home" : "home-outline"} 
          size={24} 
          color={theme.primary}
        />
        <Text style={[styles.bottomNavText, { color: theme.primary }]}>
          Inicio
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
  },
  bottomNavButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  bottomNavText: {
    fontSize: 12,
    marginTop: 4,
  },
}); 