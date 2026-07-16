import { scaleEnd, scaleStart } from '@/utils/animation';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { RelativePathString, router } from "expo-router";
import { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

const Add = ({ date }:{date?:string}) => {

  const scale = useRef(new Animated.Value(1)).current;

  const hanlePress = () => {
    router.push(('/new?day='+date) as RelativePathString)
  }

  // Функция для анимации нажатия
  const handlePressIn = () => {
    scaleStart(scale, 1.7)
  };

  // Возврат к обычному размеру
  const handlePressOut = () => {
    scaleEnd(scale, 1)
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