import { scaleEnd, scaleStart } from '@/utils/animation';
import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

export type TPaginationItem = { 
  onPress: (arg: number) => void; 
  value: number; 
  currentValue: number; 
};

const PaginationItem = ({ onPress, value, currentValue }: TPaginationItem) => {
  const scale = useRef(new Animated.Value(1)).current;
  const isActive = value === currentValue;

  // ОПТИМИЗАЦИЯ: Кэшируем функции для идеальной плавности слайдера
  const handlePressIn = useCallback(() => {
    scaleStart(scale, 1.3); // 1.3 вместо 1.5, чтобы полоска не перекрывала соседние элементы
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scaleEnd(scale, 1);
  }, [scale]);

  const handlePress = useCallback(() => {
    onPress(value);
  }, [value, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.touchTarget} // Расширенная невидимая зона нажатия (Good UX)
    >
      {/* Анимированный индикатор находится ВНУТРИ Pressable */}
      <Animated.View 
        style={[
          styles.indicator, 
          { 
            backgroundColor: isActive ? '#007aff' : 'white',
            transform: [{ scale }] 
          }
        ]} 
      />
    </Pressable>
  );
};

// Мемоизация спасет онбординг от просадки FPS при горизонтальном свайпе страниц
export default React.memo(PaginationItem);

const styles = StyleSheet.create({
  touchTarget: {
    paddingVertical: 15,     // Создает комфортную невидимую высоту 34px для легкого нажатия пальцем
    paddingHorizontal: 6,    // Расширяет расстояние между точками, защищая от случайных ложных тапов
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    height: 4, 
    width: 25,
    borderRadius: 2, // Добавим легкое скругление краев полоски, чтобы интерфейс выглядел современно
  }
});
