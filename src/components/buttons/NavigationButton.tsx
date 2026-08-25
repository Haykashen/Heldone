import { TNavigationButton } from '@/components/types/types';
import { useAppColors } from '@/context/ThemeContext'; // Импортируем хук темы
import { scaleEnd, scaleStart } from '@/utils/animation';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

const NavigationButton = ({ onPress, icon, size }: TNavigationButton) => {
  const scale = useRef(new Animated.Value(1)).current;
  
  // Получаем текущую тему из контекста
  const colors = useAppColors(); // Вся палитра доступна здесь автоматически!

  // Динамический цвет иконки в зависимости от темы
  const iconColor = colors.badgeText;//theme === 'dark' ? 'white' : '#334155';

  const handlePressIn = useCallback(() => {
    scaleStart(scale, 0.7); 
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scaleEnd(scale, 1);
  }, [scale]);

  return (
    <Pressable
      onPress={onPress} 
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.buttonContainer} 
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <MaterialDesignIcons name={icon} color={iconColor} size={size} />
      </Animated.View>
    </Pressable>
  );
};

export default React.memo(NavigationButton);

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
    padding: 4, 
  },
});
