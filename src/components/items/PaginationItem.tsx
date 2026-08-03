import { scaleEnd, scaleStart } from '@/utils/animation';
import { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

export type TPaginationItem= { onPress :(arg:number)=>void, value:number, currentValue:number }

const PaginationItem = ({ onPress, value, currentValue }: TPaginationItem) => {

    const scale = useRef(new Animated.Value(1)).current;

    // Функция для анимации нажатия
    const handlePressIn = () => {
        scaleStart(scale, 1.5)
    };

    // Возврат к обычному размеру
    const handlePressOut = () => {
        scaleEnd(scale, 1)
    };

    const handlePress = () => {
        onPress(value)//id
    }

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <Pressable
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={{ height: 4, width: 25, backgroundColor: value === currentValue ? '#007aff' : 'white' }} />
        </Animated.View>
    )
}

export default PaginationItem