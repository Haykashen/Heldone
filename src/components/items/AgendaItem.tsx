// import { TListItem } from "@/components/types/typesTask";
// import { scaleEnd, scaleStart } from '@/utils/animation';
// import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
// import React, { useCallback, useMemo, useRef } from 'react';
// import { Animated, Pressable, StyleSheet, Text, Vibration, View } from 'react-native';

// const AgendaItem = (props: TListItem) => {
//   const { id, date, title, category, status, priority, files, sendNotify, onItemPress, onCompletePress } = props;
//   const scale = useRef(new Animated.Value(1)).current;

//   // ОПТИМИЗАЦИЯ: Вычисляем состояние колокольчика, только если изменились флаги или дата задачи
//   const { bellIcon, bellColor } = useMemo(() => {
//     if (!sendNotify) {
//       return { bellIcon: 'bell-off', bellColor: 'grey' };
//     }
//     const isUpcoming = new Date().getTime() < new Date(date).getTime();
//     return {
//       bellIcon: isUpcoming ? 'bell-ring' : 'bell',
//       bellColor: isUpcoming ? '#007aff' : 'grey'
//     };
//   }, [sendNotify, date]);

//   // Безопасное форматирование времени задачи
//   const formattedTime = useMemo(() => {
//     if (!(date instanceof Date)) return '00:00';
//     return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
//   }, [date]);

//   // Текст приоритета и файлов
//   const priorityText = useMemo(() => {
//     const baseName = priority?.name?.ru || '';
//     return files && files.length > 0 ? `${baseName} - ${files.length}` : baseName;
//   }, [priority, files]);

//   // Анимация нажатия на чекбокс (уменьшение)
//   const handlePressIn = useCallback(() => {
//     scaleStart(scale, 0.8); // 0.8 вместо 0.7 — так кнопка не сжимается слишком сильно
//     Vibration.vibrate(30);
//   }, [scale]);

//   // Возврат чекбокса к обычному размеру
//   const handlePressOut = useCallback(() => {
//     scaleEnd(scale, 1);
//   }, [scale]);

//   return (
//     <Pressable onPress={onItemPress} style={styles.item}>
//       {/* Левая часть: Иконка категории (Фиксированный размер лучше процентов) */}
//       <View style={styles.categoryContainer}>
//         <View style={[styles.iconWrapper, { backgroundColor: category.color || '#grey' }]}>
//           <MaterialDesignIcons name={(category?.icon as any) || 'folder'} color={'white'} size={32} />
//         </View>
//       </View>

//       {/* Центральная часть: Контент (Занимает всё свободное пространство) */}
//       <View style={styles.contentContainer}>
//         <Text numberOfLines={2} ellipsizeMode="tail" style={styles.itemTitleText}>
//           {title}
//         </Text>
//         <View style={styles.metaRow}>
//           <MaterialDesignIcons name={bellIcon as any} color={bellColor} size={16} />
//           <Text style={styles.itemHourText}>{formattedTime} -</Text>         
//           <MaterialDesignIcons name={(priority?.icon as any) || 'flag'} color={priority?.color || 'grey'} size={16} />
//           <Text style={styles.itemHourText} numberOfLines={1} ellipsizeMode="tail">
//             {priorityText}
//           </Text>
//           {files && files.length > 0 && (
//             <MaterialDesignIcons name='paperclip' color="#63B4FF" size={16} />
//           )}
//         </View>
//       </View>

//       {/* Правая часть: Чекбокс выполнения */}
//       <Pressable
//         onPress={onCompletePress}
//         onPressIn={handlePressIn}
//         onPressOut={handlePressOut}
//         style={styles.checkboxContainer}
//       >
//         <Animated.View style={{ transform: [{ scale }] }}>
//           <MaterialDesignIcons name={(status?.icon as any) || 'checkbox-blank-outline'} color={status?.color || 'grey'} size={32} />
//         </Animated.View>
//       </Pressable>
//     </Pressable>
//   );
// };

// // Идеально: мемоизация защитит списки от лагов при добавлении новых тасок
// export default React.memo(AgendaItem);

// const styles = StyleSheet.create({
//   item: {
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: 'lightgrey',
//     flexDirection: 'row',
//     alignItems: 'center', // Центрируем элементы по вертикали внутри строки
//   },
//   categoryContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   iconWrapper: {
//     height: 48,
//     width: 48,
//     borderRadius: 14,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   contentContainer: {
//     flex: 1, // ИСПРАВЛЕНО: Теперь колонка адаптивно растягивается, не ломая верстку
//     flexDirection: 'column',
//     gap: 4,
//     justifyContent: 'center',
//   },
//   metaRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     flexWrap: 'wrap', // Защита подстроки параметров от вылета за границы
//   },
//   itemTitleText: {
//     color: 'black',
//     fontWeight: 'bold',
//     fontSize: 16,
//     lineHeight: 20,
//   },
//   itemHourText: {
//     color: '#555', // Чуть более мягкий темный цвет для второстепенного текста
//     fontSize: 13,
//   },
//   checkboxContainer: {
//     paddingLeft: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     minWidth: 44, // Минимальная зона тапа по гайдлайнам Apple/Google
//     minHeight: 44,
//   },
// });

import { TListItem } from "@/components/types/typesTask";
import { scaleEnd, scaleStart } from '@/utils/animation';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, Vibration, View } from 'react-native';

const AgendaItem = (props: TListItem) => {
  const { id, date, title, category, status, priority, files, sendNotify, onItemPress, onCompletePress } = props;
  const scale = useRef(new Animated.Value(1)).current;

  // Проверяем, выполнена ли задача
  const isCompleted = status?.id === 'Completed';

  // Вычисляем состояние уведомлений (React 19 оптимизирует это автоматически)
  let bellIcon = 'bell-off';
  let bellColor = '#7a92a5';
  
  if (sendNotify) {
    const isUpcoming = new Date().getTime() < new Date(date).getTime();
    bellIcon = isUpcoming ? 'bell-ring' : 'bell';
    bellColor = isUpcoming ? '#007aff' : '#7a92a5';
  }

  // Безопасное форматирование времени задачи
  const formattedTime = date instanceof Date 
    ? date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    : '00:00';

  // Обработчики анимации чекбокса
  const handlePressIn = useCallback(() => {
    scaleStart(scale, 0.85);
    Vibration.vibrate(20);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scaleEnd(scale, 1);
  }, [scale]);

  return (
    <Pressable 
      onPress={onItemPress} 
      style={[
        styles.itemCard, 
        isCompleted && styles.completedCard
      ]}
    >
      {/* Левая часть: Иконка категории в аккуратной круглой подложке */}
      <View style={[styles.iconWrapper, { backgroundColor: category.color || '#263238' }]}>
        <MaterialDesignIcons name={(category?.icon as any) || 'folder'} color={'white'} size={24} />
      </View>

      {/* Центральная часть: Контент */}
      <View style={styles.contentContainer}>
        <Text 
          numberOfLines={2} 
          style={[
            styles.itemTitleText, 
            isCompleted && styles.completedTitleText
          ]}
        >
          {title}
        </Text>
        
        <View style={styles.metaRow}>
          {/* Время */}
          <Text style={styles.metaText}>{formattedTime}</Text>
          
          <Text style={styles.bullet}>•</Text>

          {/* Приоритет */}
          <View style={styles.metaGroup}>
            <MaterialDesignIcons name={(priority?.icon as any) || 'flag'} color={priority?.color || '#7a92a5'} size={14} />
            <Text style={styles.metaText} numberOfLines={1}>
              {priority?.name?.ru || 'Без приоритета'}
            </Text>
          </View>

          {/* Индикатор напоминания (показываем только если включено) */}
          {sendNotify && (
            <>
              <Text style={styles.bullet}>•</Text>
              <MaterialDesignIcons name={bellIcon as any} color={bellColor} size={14} />
            </>
          )}

          {/* Файлы */}
          {files && files.length > 0 && (
            <>
              <Text style={styles.bullet}>•</Text>
              <View style={styles.metaGroup}>
                <MaterialDesignIcons name='paperclip' color="#63B4FF" size={14} />
                <Text style={[styles.metaText, { color: '#63B4FF' }]}>{files.length}</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Правая часть: Чекбокс выполнения с мягкой анимацией */}
      <Pressable
        onPress={onCompletePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.checkboxContainer}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <MaterialDesignIcons 
            name={isCompleted ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
            color={isCompleted ? "#4CD964" : "#7a92a5"} 
            size={26} 
          />
        </Animated.View>
      </Pressable>
    </Pressable>
  );
};

export default React.memo(AgendaItem);

const styles = StyleSheet.create({
  itemCard: {
    backgroundColor: '#1C3542',
    borderWidth: 1,
    borderColor: '#263238',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 10,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    // Легкая нативная тень для объема на iOS/Android
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  // Стиль для выполненной карточки (приглушаем прозрачность)
  completedCard: {
    opacity: 0.5,
    backgroundColor: '#142731',
    borderColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  iconWrapper: {
    height: 44,
    width: 44,
    borderRadius: 22, // Сделали круглым — так интерфейс выглядит мягче
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 6,
    justifyContent: 'center',
  },
  itemTitleText: {
    color: 'white', // Изменено на белый для темной темы
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 20,
  },
  // Зачеркивание текста для выполненной задачи
  completedTitleText: {
    textDecorationLine: 'line-through',
    color: '#7a92a5',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: '#9BB0C1', // Приятный пастельный цвет для второстепенного текста
    fontSize: 12,
    fontWeight: '500',
  },
  bullet: {
    color: '#263238',
    paddingHorizontal: 6,
    fontSize: 12,
  },
  checkboxContainer: {
    paddingLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    minHeight: 40,
  },
});

