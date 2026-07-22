import { Animated } from 'react-native';

// Функция для анимации нажатия
export const scaleStart = (scale: Animated.Value, toValue: number) => {
  Animated.spring(scale, {
    toValue: toValue, // уменьшение размера
    useNativeDriver: true
  }).start();
};

// Возврат к обычному размеру
export const scaleEnd = (scale: Animated.Value, toValue: number) => {
  Animated.spring(scale, {
    toValue: toValue,
    friction: 3,
    useNativeDriver: true
  }).start();
};