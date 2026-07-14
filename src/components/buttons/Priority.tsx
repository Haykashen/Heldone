import { scaleEnd, scaleStart } from '@/utils/animation';
import { TDataItem } from '@/utils/types';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { useRef } from 'react';
import { Animated, Pressable, Text } from 'react-native';

type TPriority = {priority:TDataItem,currValue: string, changePriority: (arg: string) => void}

const Priority = ({priority, currValue, changePriority}:TPriority) => {

    const scale = useRef(new Animated.Value(1)).current;

    // Функция для анимации нажатия
    const handlePressIn = () => {
        scaleStart(scale, 0.7)
    };

    // Возврат к обычному размеру
    const handlePressOut = () => {
        scaleEnd(scale, 1)
    };

    const handlePress = () => {
        changePriority(priority.id)
    };

    return (
        <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 3, borderColor: priority.id === currValue ? 'silver' : '#263238', borderWidth: 2, borderRadius: 10, padding: 10 }}>
            <Text style={{ color: 'white' }}>{priority.name.ru}</Text>
            <Animated.View style={{ transform: [{ scale }] }}>
                <MaterialDesignIcons name={priority.icon as any} color={priority.color} size={32} />
            </Animated.View>
        </Pressable>
    )
}

export default Priority