import { IAppColors, ThemeColors } from '@/components/constants/ThemeColors';
import { getData } from '@/store/getData';
import { setData } from '@/store/setData';
import React, { createContext, use, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';
type ActiveTheme = 'light' | 'dark';

interface ThemeContextProps {
  theme: ThemeMode;
  activeTheme: ActiveTheme;
  colors: IAppColors;
  setTheme: (theme: ThemeMode) => Promise<void>; // Теперь функция асинхронная
}

const STORAGE_KEY = '@app_theme_mode';

export const ThemeContext = createContext<ThemeContextProps | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  
  // Состояние темы. На старте ставим 'dark', пока идет чтение из AsyncStorage
  const [theme, setThemeState] = useState<ThemeMode>('dark');

  // Читаем сохраненную тему при монтировании компонента
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await getData(STORAGE_KEY);
        
        if (savedTheme) {
          setThemeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        //console.error('Ошибка при загрузке темы:', error);
      }
    };

    loadTheme();
  }, []);

  // Фактическая тема для компонентов
  const activeTheme: ActiveTheme = 
    theme === 'system' 
      ? (systemScheme === 'light' ? 'light' : 'dark') 
      : theme;

  // Асинхронная функция смены темы с сохранением в память
  const setTheme = async (newTheme: ThemeMode) => {
    try {
      setThemeState(newTheme);
      await setData(STORAGE_KEY, newTheme);
    } catch (error) {
      //console.error('Ошибка при сохранении темы:', error);
    }
  };

  const colors = ThemeColors[activeTheme];

  return (
    <ThemeContext.Provider value={{ theme, activeTheme, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Внутренний хелпер
const useThemeContext = () => {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

// ХУКИ ДЛЯ ИСПОЛЬЗОВАНИЯ В КОМПОНЕНТАХ
export const useAppThemeMode = () => useThemeContext().activeTheme;
export const useAppColors = () => useThemeContext().colors;

export const useThemeSettings = () => {
  const { theme, setTheme } = useThemeContext();
  return { currentTheme: theme, setTheme };
};
