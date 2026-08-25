import { IAppColors, ThemeColors } from '@/components/constants/ThemeColors';
import React, { createContext, use } from 'react';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark';

interface ThemeContextProps {
  theme: ThemeMode;
  colors: IAppColors; // Добавляем объект цветов в контекст
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: 'dark',
  colors: ThemeColors.dark,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const theme: ThemeMode = systemScheme === 'light' ? 'light' : 'dark';

  // Выбираем нужную палитру на основе темы
  const colors = ThemeColors[theme];

  return (
    <ThemeContext.Provider value={{ theme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ХУК 1: Возвращает только название темы ('light' | 'dark'), если нужно для Lottie или сторонних библиотек
export const useAppThemeMode = () => {
  const context = use(ThemeContext);
  return context.theme;
};

// ХУК 2: Глобальный хук для моментального получения палитры цветов во всех компонентах!
export const useAppColors = () => {
  const context = use(ThemeContext);
  return context.colors;
};
