import { scaleEnd, scaleStart } from '@/utils/animation';
import { TNavigationButton } from '@/utils/types';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

const NavigationButton = ({onPress, icon, size}:TNavigationButton) => {

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
            onPress={() => onPress()}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={{alignItems:'center', justifyContent:'center',}}
        >
            <Animated.View style={{ transform: [{ scale }] }}>
                <MaterialDesignIcons name={icon} color={'white'} size={size} />
            </Animated.View>
        </Pressable>
    )
}

export default NavigationButton


