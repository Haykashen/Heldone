import { useAppColors } from '@/context/ThemeContext'; // Импортируем хук темы
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
  const insets = useSafeAreaInsets();
  const colors = useAppColors(); // Вся палитра доступна здесь автоматически!

  const handlePress = useCallback(() => {
    router.push(`/new?day=${date}`);
  }, [date]);

  const handlePressIn = useCallback(() => {
    scaleStart(scale, 0.85); // Мягкое вдавление кнопки
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scaleEnd(scale, 1); // ИСПРАВЛЕНО: возвращаем масштаб строго к 1, а не к 1.2
  }, [scale]);

  const dynamicButtonStyles = {
    bottom: Math.max(insets.bottom, 15),
    backgroundColor: colors.fabBg,
    shadowColor: colors.shadowColor,
    shadowOpacity: colors.shadowOpacity,
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.fabButton, dynamicButtonStyles]}
    >
      <Animated.View style={{ transform: [{ scale }], alignItems: 'center', justifyContent: 'center' }}>
        <MaterialDesignIcons name="plus" size={34} color={'white'} />
      </Animated.View>
    </Pressable>
  );
};

export default React.memo(Add);

const styles = StyleSheet.create({
  fabButton: {
    margin: 10,
    height: 60,
    width: 60,
    borderRadius: 30, 
    position: 'absolute',
    right: 15,
    alignItems: 'center',
    justifyContent: 'center',
    
    // Свойства тени
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4.65,
    elevation: 8, 
  },
});
