import { scaleEnd, scaleStart } from '@/utils/animation';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { router } from "expo-router";
import { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

const Notice = () => {

  const scale = useRef(new Animated.Value(1)).current;

  // Функция для анимации нажатия
  const handlePressIn = () => {
    scaleStart(scale, 0.7)
  };

  // Возврат к обычному размеру
  const handlePressOut = () => {
    scaleEnd(scale, 1)
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


