import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorTheme, ThemeOption, themes } from '../constants/themes';

type ThemeContextType = {
  theme: ColorTheme;
  selectedTheme: string;
  colorScheme: 'light' | 'dark' | 'system';
  setSelectedTheme: (themeId: string) => void;
  setColorScheme: (scheme: 'light' | 'dark' | 'system') => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [selectedTheme, setSelectedTheme] = useState('blue');
  const [colorScheme, setColorScheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('selectedTheme');
      const savedColorScheme = await AsyncStorage.getItem('colorScheme');
      
      if (savedTheme) setSelectedTheme(savedTheme);
      if (savedColorScheme) setColorScheme(savedColorScheme as 'light' | 'dark' | 'system');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const currentTheme = themes.find(t => t.id === selectedTheme)?.colors[
    colorScheme === 'system' ? systemColorScheme || 'light' : colorScheme
  ] || themes[0].colors.light;

  const value = {
    theme: currentTheme,
    selectedTheme,
    colorScheme,
    setSelectedTheme,
    setColorScheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 