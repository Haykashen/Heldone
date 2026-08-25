import React, { createContext, use } from "react";
import { useColorScheme } from 'react-native';

interface Props {
  children: React.ReactNode;
}

// Описываем тип контекста
type ThemeType = 'light' | 'dark';

interface ThemeContextProps {
  theme: ThemeType;
}
const ThemeContext = createContext<ThemeContextProps>({ theme: 'dark' });

const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  // Нативно подписываемся на системную тему устройства (iOS/Android)
  const systemScheme = useColorScheme();
  
  // Если система не определила тему, по умолчанию ставим 'dark'
  const theme: ThemeType = systemScheme === 'light' ? 'light' : 'dark';

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};


export {
    ThemeContext,
    ThemeContextProvider
};

// Кастомный хук для удобного и быстрого доступа к теме в стиле React 19
export const useAppTheme = () => {
  const context = use(ThemeContext); // Используем новый хук 'use' из React 19
  return context.theme;
};
