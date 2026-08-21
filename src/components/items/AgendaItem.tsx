// import { scaleEnd, scaleStart } from '@/utils/animation';
// import { TListItem } from "@/utils/types";
// import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
// import React, { useRef } from 'react';
// import { Animated, Pressable, StyleSheet, Text, Vibration, View } from 'react-native';

// const AgendaItem = (props: TListItem) => {
//   const { id, date, title, category, status, priority, files, sendNotify, onItemPress, onCompletePress, } = props;
//   const scale = useRef(new Animated.Value(1)).current;
//   const currDate = new Date();
//   const bellIcon = sendNotify?((currDate < date)?'bell-ring':'bell'):'bell-off';
//   const bellColor = (sendNotify && currDate < date)?'#007aff':'grey';
  
//   const handleComplete = () => {
//     onCompletePress()
//   }

//   const handleOpen = () => {
//     onItemPress()
//   }
//   // Функция для анимации нажатия
//   const handlePressIn = () => {
//     scaleStart(scale, 0.7)
//     Vibration.vibrate(30)
//   };

//   // Возврат к обычному размеру
//   const handlePressOut = () => {
//     scaleEnd(scale, 1)
//   };

//   return (
//     <Pressable onPress={handleOpen} style={styles.item}>
//       <View style={{ width: '20%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 5 }}>
//         <View style={{ height: 50, width: 50, backgroundColor: category.backColor, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
//           <MaterialDesignIcons name={category.icon as any} color={category.color} size={38} />
//         </View>
//       </View>
//       <View style={{ width: '60%', flexDirection: 'column', gap: 3 }}>
//         <Text numberOfLines={2} ellipsizeMode="tail" style={styles.itemTitleText}>{title}</Text>
//         <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', gap: 3 }}>
//           {/* <MaterialDesignIcons name={status.clockIcon as any} color={'black'} size={18} /> */}
//           <MaterialDesignIcons name={bellIcon} color={bellColor} size={18} />
//           <Text style={styles.itemHourText}>
//             {date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} -
//           </Text>         
//           <MaterialDesignIcons name={priority.icon as any} color={priority.color} size={18} />
//           <Text style={styles.itemHourText}>{(files.length>0)?priority.name.ru+' - '+files.length:priority.name.ru}</Text>
//           {files.length >0 && <MaterialDesignIcons name={'file-outline'} color={"#63B4FF"} size={18} />}
//         </View>
//       </View>
//       <Pressable
//         onPress={handleComplete}
//         onPressIn={handlePressIn}
//         onPressOut={handlePressOut}
//         style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
//         <Animated.View style={{ transform: [{ scale }] }}>
//           <MaterialDesignIcons name={status.icon as any} color={status.color} size={32} />
//         </Animated.View>
//       </Pressable>
//     </Pressable>
//   );
// };

// export default React.memo(AgendaItem);

// const styles = StyleSheet.create({
//   item: {
//     padding: 20,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: 'lightgrey',
//     flexDirection: 'row',
//     gap: 10
//   },
//   itemHourText: {
//     color: 'black'
//   },
//   itemTitleText: {
//     color: 'black',
//     fontWeight: 'bold',
//     fontSize: 16
//   },
//   itemButtonContainer: {
//     flex: 1,
//     alignItems: 'flex-end'
//   },
//   emptyItem: {
//     paddingLeft: 20,
//     height: 52,
//     justifyContent: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: 'lightgrey'
//   },
//   emptyItemText: {
//     color: 'lightgrey',
//     fontSize: 14
//   },
//   actionsContainer: {
//     flexDirection: 'row',
//     marginBottom: 2,
//     height: 70,
//   },
//   button: {
//     borderRadius: 15,
//     marginVertical: 5,
//     marginHorizontal: 2,
//     width: 70,
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   edit: {
//     backgroundColor: '#ffab00',
//   },
//   delete: {
//     backgroundColor: '#ff1744',
//   },
//   complete: {
//     backgroundColor: 'green',
//   }
// });


import { scaleEnd, scaleStart } from '@/utils/animation';
import { TListItem } from "@/utils/types";
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
