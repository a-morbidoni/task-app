import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { themes } from './constants/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from './context/ThemeContext';

export default function Settings() {
  const { 
    theme, 
    selectedTheme, 
    colorScheme, 
    setSelectedTheme, 
    setColorScheme 
  } = useTheme();

  const handleThemeSelect = async (themeId: string) => {
    setSelectedTheme(themeId);
    try {
      await AsyncStorage.setItem('selectedTheme', themeId);
      // Opcional: Sincronizar con el servidor
      // await updateUserPreferences({ theme: themeId });
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const handleColorSchemeSelect = async (scheme: 'light' | 'dark' | 'system') => {
    setColorScheme(scheme);
    try {
      await AsyncStorage.setItem('colorScheme', scheme);
      // Opcional: Sincronizar con el servidor
      // await updateUserPreferences({ colorScheme: scheme });
    } catch (error) {
      console.error('Error saving color scheme:', error);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Modo de Color
      </Text>
      <View style={styles.optionsContainer}>
        {(['light', 'dark', 'system'] as const).map((scheme) => (
          <TouchableOpacity
            key={scheme}
            style={[
              styles.schemeOption,
              { 
                backgroundColor: theme.surface,
                borderColor: colorScheme === scheme ? theme.primary : theme.border 
              }
            ]}
            onPress={() => handleColorSchemeSelect(scheme)}
          >
            <Ionicons
              name={
                scheme === 'light' ? 'sunny' :
                scheme === 'dark' ? 'moon' : 'settings'
              }
              size={24}
              color={colorScheme === scheme ? theme.primary : theme.textSecondary}
            />
            <Text style={[
              styles.optionText,
              { color: colorScheme === scheme ? theme.primary : theme.text }
            ]}>
              {scheme === 'light' ? 'Claro' :
               scheme === 'dark' ? 'Oscuro' : 'Sistema'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Tema de Color
      </Text>
      <View style={styles.optionsContainer}>
        {themes.map((themeOption) => (
          <TouchableOpacity
            key={themeOption.id}
            style={[
              styles.themeOption,
              { 
                backgroundColor: theme.surface,
                borderColor: selectedTheme === themeOption.id ? theme.primary : theme.border 
              }
            ]}
            onPress={() => handleThemeSelect(themeOption.id)}
          >
            <View style={styles.themePreview}>
              <View style={[styles.colorPreview, { backgroundColor: themeOption.colors.light.primary }]} />
              <View style={[styles.colorPreview, { backgroundColor: themeOption.colors.light.secondary }]} />
            </View>
            <Text style={[
              styles.optionText,
              { color: selectedTheme === themeOption.id ? theme.primary : theme.text }
            ]}>
              {themeOption.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  schemeOption: {
    flex: 1,
    minWidth: '30%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeOption: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  themePreview: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  optionText: {
    fontSize: 16,
    marginTop: 8,
  },
}); 