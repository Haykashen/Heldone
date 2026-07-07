import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { router } from "expo-router";
import { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

const Notice = () => {

  const scale = useRef(new Animated.Value(1)).current;

  // Функция для анимации нажатия
  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.7, // уменьшение размера
      useNativeDriver: true
    }).start();
  };

  // Возврат к обычному размеру
  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true
    }).start();
  };

    return (
        <Pressable
            onPress={() => router.push('/notice')}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <Animated.View style={{ transform: [{ scale }] }}>
                <MaterialDesignIcons name={'bell'} color={'white'} size={26} />
            </Animated.View>
        </Pressable>
    )
}

export default Notice


