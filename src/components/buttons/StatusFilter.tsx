import { scaleEnd, scaleStart } from '@/utils/animation';
import { useRef } from 'react';
import { Animated, Pressable, Text, Vibration } from 'react-native';

type TStatusFilter = { status: string, currStatus: string, title: string, changeStatus: (arg: string) => void }

const StatusFilter = ({ status, currStatus, title, changeStatus }: TStatusFilter) => {

    const scale = useRef(new Animated.Value(1)).current;

    // Функция для анимации нажатия
    const handlePressIn = () => {
        scaleStart(scale, 0.8)
        Vibration.vibrate(30)
    };

    // Возврат к обычному размеру
    const handlePressOut = () => {
        scaleEnd(scale, 1)
    };

    const handlePress = () => {
        changeStatus(status)
    };

    return (
        <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            style={{ flexDirection: 'column', justifyContent: 'center', borderRadius: 10, backgroundColor: status === currStatus ? '#007aff' : '#042f41', padding: 10 }}>
            <Animated.View style={{ transform: [{ scale }] }}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{title}</Text>
            </Animated.View>
        </Pressable>
    )
}

export default StatusFilter