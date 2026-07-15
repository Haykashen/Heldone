import Categorys from '@/data/CategoryData';
import { scaleEnd, scaleStart } from '@/utils/animation';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

export type TCategoryItem = { onPressCategory :(arg:string)=>void, categoryID:string, currentID:string }

const CategoryItem = ({ onPressCategory, categoryID, currentID }: TCategoryItem) => {

    const scale = useRef(new Animated.Value(1)).current;

    // Функция для анимации нажатия
    const handlePressIn = () => {
        scaleStart(scale, 1.5)
    };

    // Возврат к обычному размеру
    const handlePressOut = () => {
        scaleEnd(scale, 1)
    };

    const handlePressCategory = (key: string) => {
        console.log('handlePressCategory')
        onPressCategory(key)//id
    }

    //let categoryID: string = (key.split('').join(''));
    let color = categoryID === currentID ? 'silver' : '#263238'; //Theme.colors.bg_input backgroundColor: Categorys[key].backColor,

    return (
        <Pressable
            onPress={() => handlePressCategory(categoryID)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={{ flexDirection: 'row', gap: 3, padding: 5, borderWidth: 2, borderRadius: 10, borderColor: color, backgroundColor:Categorys[categoryID].backColor }}>
            <Animated.View style={{ transform: [{ scale }] }}>
                <MaterialDesignIcons name={Categorys[categoryID].icon as any} color={Categorys[categoryID].color} size={32} />
            </Animated.View>
            {/* <Text style={{ color: 'white' }}>{Categorys[key].name[language]}</Text> */}
        </Pressable>
    )
}

export default CategoryItem
