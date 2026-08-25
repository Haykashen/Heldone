import { scaleEnd, scaleStart } from '@/utils/animation';
import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, Vibration } from 'react-native';

type TStatusFilter = { 
  status: string; 
  currStatus: string; 
  title: string; 
  changeStatus: (arg: string) => void; 
};

const StatusFilter = ({ status, currStatus, title, changeStatus }: TStatusFilter) => {
  const scale = useRef(new Animated.Value(1)).current;
  const isActive = status === currStatus;

  // ОПТИМИЗАЦИЯ: Кэшируем функции анимации для стабильности ссылок
  const handlePressIn = useCallback(() => {
    scaleStart(scale, 0.8);
    Vibration.vibrate(30);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scaleEnd(scale, 1);
  }, [scale]);

  // Передаем статус напрямую при клике
  const handlePress = useCallback(() => {
    changeStatus(status);
  }, [status, changeStatus]);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      // Динамически меняем цвет фона в зависимости от активности таба
      style={[
        styles.button, 
        { backgroundColor: isActive ? '#007aff' : '#042f41' }
      ]}
    >
      <Animated.View style={{ transform: [{ scale }], alignItems: 'center' }}>
        <Text style={styles.text}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
};

// Экспортируем через React.memo, чтобы табы не перерисовывались зря
export default React.memo(StatusFilter);

const styles = StyleSheet.create({
  button: {
    flex: 1, // ИСПРАВЛЕНО (Good UX): Теперь все табы будут иметь абсолютно одинаковую ширину и ровно заполнят строку
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: 10, 
    paddingVertical: 12, // Фиксированный вертикальный паддинг для аккуратной высоты табов
    paddingHorizontal: 5,
    minHeight: 44, // Соответствие гайдлайнам доступности тач-зон
  },
  text: {
    color: 'white', 
    fontSize: 15, // 15px выглядит на табах чуть более изящно и гарантированно не перенесется
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
