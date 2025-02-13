export type ColorTheme = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
};

export type ThemeOption = {
  id: string;
  name: string;
  colors: {
    light: ColorTheme;
    dark: ColorTheme;
  };
};

export const themes: ThemeOption[] = [
  {
    id: 'blue',
    name: 'Azul',
    colors: {
      light: {
        primary: '#007AFF',
        secondary: '#5856D6',
        background: '#f5f5f5',
        surface: '#ffffff',
        text: '#000000',
        textSecondary: '#666666',
        border: '#e0e0e0',
        error: '#FFB3B3',
        success: '#B8E6C0',
      },
      dark: {
        primary: '#0A84FF',
        secondary: '#5E5CE6',
        background: '#000000',
        surface: '#1c1c1e',
        text: '#ffffff',
        textSecondary: '#ebebf5',
        border: '#38383A',
        error: '#FF9999',
        success: '#98D8A1',
      },
    },
  },
  {
    id: 'green',
    name: 'Verde',
    colors: {
      light: {
        primary: '#34C759',
        secondary: '#30B457',
        background: '#f5f5f5',
        surface: '#ffffff',
        text: '#000000',
        textSecondary: '#666666',
        border: '#e0e0e0',
        error: '#FFB3B3',
        success: '#B8E6C0',
      },
      dark: {
        primary: '#32D74B',
        secondary: '#30B457',
        background: '#000000',
        surface: '#1c1c1e',
        text: '#ffffff',
        textSecondary: '#ebebf5',
        border: '#38383A',
        error: '#FF9999',
        success: '#98D8A1',
      },
    },
  },
  {
    id: 'purple',
    name: 'Morado',
    colors: {
      light: {
        primary: '#AF52DE',
        secondary: '#9F44D3',
        background: '#f5f5f5',
        surface: '#ffffff',
        text: '#000000',
        textSecondary: '#666666',
        border: '#e0e0e0',
        error: '#FFB3B3',
        success: '#B8E6C0',
      },
      dark: {
        primary: '#BF5AF2',
        secondary: '#A44AE1',
        background: '#000000',
        surface: '#1c1c1e',
        text: '#ffffff',
        textSecondary: '#ebebf5',
        border: '#38383A',
        error: '#FF9999',
        success: '#98D8A1',
      },
    },
  },
]; 