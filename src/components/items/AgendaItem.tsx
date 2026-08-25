import { TListItem } from "@/components/types/typesTask";
import { scaleEnd, scaleStart } from '@/utils/animation';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import React, { useCallback, useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, Vibration, View } from 'react-native';

const AgendaItem = (props: TListItem) => {
  const { id, date, title, category, status, priority, files, sendNotify, onItemPress, onCompletePress } = props;
  const scale = useRef(new Animated.Value(1)).current;

  // ОПТИМИЗАЦИЯ: Вычисляем состояние колокольчика, только если изменились флаги или дата задачи
  const { bellIcon, bellColor } = useMemo(() => {
    if (!sendNotify) {
      return { bellIcon: 'bell-off', bellColor: 'grey' };
    }
    const isUpcoming = new Date().getTime() < new Date(date).getTime();
    return {
      bellIcon: isUpcoming ? 'bell-ring' : 'bell',
      bellColor: isUpcoming ? '#007aff' : 'grey'
    };
  }, [sendNotify, date]);

  // Безопасное форматирование времени задачи
  const formattedTime = useMemo(() => {
    if (!(date instanceof Date)) return '00:00';
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }, [date]);

  // Текст приоритета и файлов
  const priorityText = useMemo(() => {
    const baseName = priority?.name?.ru || '';
    return files && files.length > 0 ? `${baseName} - ${files.length}` : baseName;
  }, [priority, files]);

  // Анимация нажатия на чекбокс (уменьшение)
  const handlePressIn = useCallback(() => {
    scaleStart(scale, 0.8); // 0.8 вместо 0.7 — так кнопка не сжимается слишком сильно
    Vibration.vibrate(30);
  }, [scale]);

  // Возврат чекбокса к обычному размеру
  const handlePressOut = useCallback(() => {
    scaleEnd(scale, 1);
  }, [scale]);

  return (
    <Pressable onPress={onItemPress} style={styles.item}>
      {/* Левая часть: Иконка категории (Фиксированный размер лучше процентов) */}
      <View style={styles.categoryContainer}>
        <View style={[styles.iconWrapper, { backgroundColor: category?.backColor || '#grey' }]}>
          <MaterialDesignIcons name={(category?.icon as any) || 'folder'} color={category?.color || 'white'} size={32} />
        </View>
      </View>

      {/* Центральная часть: Контент (Занимает всё свободное пространство) */}
      <View style={styles.contentContainer}>
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.itemTitleText}>
          {title}
        </Text>
        <View style={styles.metaRow}>
          <MaterialDesignIcons name={bellIcon as any} color={bellColor} size={16} />
          <Text style={styles.itemHourText}>{formattedTime} -</Text>         
          <MaterialDesignIcons name={(priority?.icon as any) || 'flag'} color={priority?.color || 'grey'} size={16} />
          <Text style={styles.itemHourText} numberOfLines={1} ellipsizeMode="tail">
            {priorityText}
          </Text>
          {files && files.length > 0 && (
            <MaterialDesignIcons name='paperclip' color="#63B4FF" size={16} />
          )}
        </View>
      </View>

      {/* Правая часть: Чекбокс выполнения */}
      <Pressable
        onPress={onCompletePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.checkboxContainer}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <MaterialDesignIcons name={(status?.icon as any) || 'checkbox-blank-outline'} color={status?.color || 'grey'} size={32} />
        </Animated.View>
      </Pressable>
    </Pressable>
  );
};

// Идеально: мемоизация защитит списки от лагов при добавлении новых тасок
export default React.memo(AgendaItem);

const styles = StyleSheet.create({
  item: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    flexDirection: 'row',
    alignItems: 'center', // Центрируем элементы по вертикали внутри строки
  },
  categoryContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconWrapper: {
    height: 48,
    width: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1, // ИСПРАВЛЕНО: Теперь колонка адаптивно растягивается, не ломая верстку
    flexDirection: 'column',
    gap: 4,
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap', // Защита подстроки параметров от вылета за границы
  },
  itemTitleText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 20,
  },
  itemHourText: {
    color: '#555', // Чуть более мягкий темный цвет для второстепенного текста
    fontSize: 13,
  },
  checkboxContainer: {
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44, // Минимальная зона тапа по гайдлайнам Apple/Google
    minHeight: 44,
  },
});
