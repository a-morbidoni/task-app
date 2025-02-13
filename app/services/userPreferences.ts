import AsyncStorage from '@react-native-async-storage/async-storage';

type UserPreferences = {
  theme?: string;
  colorScheme?: 'light' | 'dark' | 'system';
};

export async function saveUserPreferences(preferences: UserPreferences) {
  try {
    // Guardar localmente
    if (preferences.theme) {
      await AsyncStorage.setItem('selectedTheme', preferences.theme);
    }
    if (preferences.colorScheme) {
      await AsyncStorage.setItem('colorScheme', preferences.colorScheme);
    }

    // Sincronizar con el servidor si hay conexión
    if (navigator.onLine) {
      await updateServerPreferences(preferences);
    } else {
      // Guardar para sincronización posterior
      await queuePreferencesUpdate(preferences);
    }
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
}

async function updateServerPreferences(preferences: UserPreferences) {
  // Implementar llamada a tu API
  // const response = await fetch('/api/user/preferences', {
  //   method: 'PUT',
  //   body: JSON.stringify(preferences),
  // });
  // return response.json();
}

async function queuePreferencesUpdate(preferences: UserPreferences) {
  // Implementar cola de actualizaciones pendientes
  const queue = await AsyncStorage.getItem('preferencesQueue');
  const updates = queue ? JSON.parse(queue) : [];
  updates.push({
    preferences,
    timestamp: Date.now(),
  });
  await AsyncStorage.setItem('preferencesQueue', JSON.stringify(updates));
} 