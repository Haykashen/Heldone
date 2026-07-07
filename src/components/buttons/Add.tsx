import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { router } from "expo-router";
import { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

const Add = () => {

  const scale = useRef(new Animated.Value(1)).current;

  const hanlePress = () => {
    router.push('/new')
  }

  // Функция для анимации нажатия
  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 1.7, // уменьшение размера
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
      onPress={hanlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ margin: 10, height: 60, width: 60, borderRadius: 45, backgroundColor: '#007aff', position: 'absolute', bottom: 15, right: 15, alignItems: 'center', justifyContent: 'center' }}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <MaterialDesignIcons name={"plus"} size={34} color={"white"} />
      </Animated.View>
    </Pressable>
  )
}

export default Add