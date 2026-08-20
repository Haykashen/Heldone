// import { scaleEnd, scaleStart } from '@/utils/animation';
// import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
// import { router } from "expo-router";
// import { useRef } from 'react';
// import { Animated, Pressable } from 'react-native';

// const Add = ({ date }:{date?:string}) => {

//   const scale = useRef(new Animated.Value(1)).current;

//   const hanlePress = () => {
//     router.push((`/new?day=${date}`))
//   }

//   // Функция для анимации нажатия
//   const handlePressIn = () => {
//     scaleStart(scale, 1.7)
//   };

//   // Возврат к обычному размеру
//   const handlePressOut = () => {
//     scaleEnd(scale, 1)
//   };

//   return (
//     <Pressable
//       onPress={hanlePress}
//       onPressIn={handlePressIn}
//       onPressOut={handlePressOut}
//       style={{ margin: 10, height: 60, width: 60, borderRadius: 45, backgroundColor: '#007aff', position: 'absolute', bottom: 15, right: 15, alignItems: 'center', justifyContent: 'center' }}
//     >
//       <Animated.View style={{ transform: [{ scale }] }}>
//         <MaterialDesignIcons name={"plus"} size={34} color={"white"} />
//       </Animated.View>
//     </Pressable>
//   )
// }

// export default Add

import { scaleEnd, scaleStart } from '@/utils/animation';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { router } from "expo-router";
import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AddProps {
  date?: string;
}

const Add = ({ date }: AddProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets(); // Получаем динамический безопасный отступ снизу устройства

  // Мемоизируем переход на экран создания таски
  const handlePress = useCallback(() => {
    router.push(`/new?day=${date}`);
  }, [date]);

  // Микро-анимация «вдавления» при нажатии (0.9 вместо огромного 1.7)
  const handlePressIn = useCallback(() => {
    scaleStart(scale, 0.8);
  }, [scale]);

  // Возврат кнопки в исходное состояние
  const handlePressOut = useCallback(() => {
    scaleEnd(scale, 1.2);
  }, [scale]);

  // Вычисляем безопасную позицию кнопки снизу экрана динамически
  const dynamicButtonStyles = {
    bottom: Math.max(insets.bottom, 15), // Если экран безрамочный, добавится нужный отступ, иначе останется 15
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.fabButton, dynamicButtonStyles]}
    >
      {/* Анимируем саму кнопку целиком, а не только иконку внутри, чтобы эффект нажатия был красивым */}
      <Animated.View style={{ transform: [{ scale }], alignItems: 'center', justifyContent: 'center' }}>
        <MaterialDesignIcons name="plus" size={34} color="white" />
      </Animated.View>
    </Pressable>
  );
};

// Мемоизируем компонент, так как он лежит на главных экранах списков 
// и не должен перерисовываться при скролле или вводе текста
export default React.memo(Add);

const styles = StyleSheet.create({
  fabButton: {
    margin: 10,
    height: 60,
    width: 60,
    borderRadius: 30, // Свойство borderRadius должно быть ровно в 2 раза меньше высоты/ширины для идеального круга
    backgroundColor: '#007aff',
    position: 'absolute',
    right: 15,
    alignItems: 'center',
    justifyContent: 'center',
    
    // Добавим легкую нативную тень, чтобы кнопка красиво парила над списками (Good UX)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8, // Тень для Android
  },
});
