// import { TNavigationButton } from '@/components/types/types';
// import { scaleEnd, scaleStart } from '@/utils/animation';
// import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
// import React, { useCallback, useRef } from 'react';
// import { Animated, Pressable, StyleSheet } from 'react-native';

// const NavigationButton = ({ onPress, icon, size }: TNavigationButton) => {
//   const scale = useRef(new Animated.Value(1)).current;

//   // ОПТИМИЗАЦИЯ: Кэшируем функции анимации для стабильности ссылок
//   const handlePressIn = useCallback(() => {
//     scaleStart(scale, 0.7); // Отличный эффект вдавления кнопки!
//   }, [scale]);

//   const handlePressOut = useCallback(() => {
//     scaleEnd(scale, 1);
//   }, [scale]);

//   return (
//     <Pressable
//       onPress={onPress} // Передаем функцию напрямую без стрелочной обертки
//       onPressIn={handlePressIn}
//       onPressOut={handlePressOut}
//       style={styles.buttonContainer} // Применяем оптимизированный тач-таргет
//     >
//       <Animated.View style={{ transform: [{ scale }] }}>
//         <MaterialDesignIcons name={icon} color="white" size={size} />
//       </Animated.View>
//     </Pressable>
//   );
// };

// // Мемоизируем, так как кнопка часто сидит в статических или перерисовывающихся шапках экрана
// export default React.memo(NavigationButton);

// const styles = StyleSheet.create({
//   buttonContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
    
//     // ИСПРАВЛЕНО (Good UX): Расширяем область нажатия до стандартов Apple/Google.
//     // Теперь даже если иконка size={24}, попасть пальцем по кнопке будет очень легко.
//     minWidth: 44,
//     minHeight: 44,
//     padding: 4, 
//   },
// });


import { TNavigationButton } from '@/components/types/types';
import { useAppColors } from '@/context/ThemeContext'; // Импортируем хук темы
import { scaleEnd, scaleStart } from '@/utils/animation';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

const NavigationButton = ({ onPress, icon, size }: TNavigationButton) => {
  const scale = useRef(new Animated.Value(1)).current;
  
  // Получаем текущую тему из контекста
  const colors = useAppColors(); // Вся палитра доступна здесь автоматически!

  // Динамический цвет иконки в зависимости от темы
  const iconColor = colors.badgeText;//theme === 'dark' ? 'white' : '#334155';

  const handlePressIn = useCallback(() => {
    scaleStart(scale, 0.7); 
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scaleEnd(scale, 1);
  }, [scale]);

  return (
    <Pressable
      onPress={onPress} 
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.buttonContainer} 
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <MaterialDesignIcons name={icon} color={iconColor} size={size} />
      </Animated.View>
    </Pressable>
  );
};

export default React.memo(NavigationButton);

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
    padding: 4, 
  },
});
