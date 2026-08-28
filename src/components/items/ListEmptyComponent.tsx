import { useAppColors } from '@/context/ThemeContext';
import { scaleEnd, scaleStart } from '@/utils/animation';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { router } from "expo-router";
import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

interface ListEmptyComponentProps {
  date?: string;
  title: string;
  text: string;
  onPress?: () => void;
}

const ListEmptyComponent = ({ date, title, text, onPress }: ListEmptyComponentProps) => {
  const scale = useRef(new Animated.Value(1)).current; 
  // Получаем динамическую палитру цветов
  const colors = useAppColors();
  // Мемоизируем обработчик нажатия
  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
    } else {
      // Маршрут создания новой задачи
      router.push(`/new?day=${date}`);
    }
  }, [date, onPress]);

  // Плавное микро-увеличение при тапе (1.15 вместо резкого 1.5)
  const handlePressIn = useCallback(() => {
    scaleStart(scale, 1.15);
  }, [scale]);

  // Возврат к исходному размеру
  const handlePressOut = useCallback(() => {
    scaleEnd(scale, 1);
  }, [scale]);

  return (
    // ИСПРАВЛЕНО: Заменили SafeAreaView на View, чтобы не ломать отступы внутри FlatList
    <View style={styles.container}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <MaterialDesignIcons name="playlist-plus" size={64} color='#007aff' />
        </Animated.View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.titleText, {color:colors.titleText}]}>{title}</Text>
          <Text numberOfLines={2} style={styles.subtitleText}>
            {text}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default React.memo(ListEmptyComponent);

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: 'transparent', // Позволяет принимать цвет бэкграунда родительского экрана
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressable: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12, // Отступ между анимированной иконкой и текстом
    paddingHorizontal: 10,
  },
  titleText: {
   // color: 'white', // Изменено на white, так как бэкграунд вашего приложения темно-синий (#031F2B)
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitleText: {
    color: '#7a92a5', // Серый приятный оттенок для описания
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 18,
  },
});
