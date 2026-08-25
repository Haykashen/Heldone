// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { Animated, DimensionValue, StyleSheet, Text, View } from 'react-native';

// interface DayProgressBarProps {
//   completedCount: number;
//   totalCount: number;
//   scaleAnimatedValue: Animated.Value;
// }

// const DayProgressBar = ({ completedCount, totalCount, scaleAnimatedValue }: DayProgressBarProps) => {
//   const isDayEmptyOrDone = totalCount === 0 || completedCount === totalCount;
//   const [renderMode, setRenderMode] = useState(isDayEmptyOrDone);
//   const fadeAnim = useRef(new Animated.Value(1)).current;

//   useEffect(() => {
//     if (isDayEmptyOrDone !== renderMode) {
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 180,
//         useNativeDriver: true,
//       }).start(() => {
//         setRenderMode(isDayEmptyOrDone);
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 220,
//           useNativeDriver: true,
//         }).start();
//       });
//     }
//   }, [isDayEmptyOrDone, renderMode, fadeAnim]);

//   const widthProgress = useMemo((): DimensionValue => {
//     if (totalCount === 0) return '0%';
//     const percent = Math.round((completedCount / totalCount) * 100);
//     return `${percent}%`;
//   }, [completedCount, totalCount]);

//   const progressTextStyle = useMemo(() => ({ 
//     transform: [{ scale: scaleAnimatedValue }] 
//   }), [scaleAnimatedValue]);

//   const progressBarSubStyle = useMemo(() => ({ 
//     width: widthProgress, 
//     backgroundColor: '#007aff' 
//   }), [widthProgress]);

//   return (
//     <Animated.View style={[styles.cardContainer, { opacity: fadeAnim }]}>
//       {renderMode ? (
//         /* 🎉 ВАРИАНТ 1: Мотивирующая плашка (Все сделано / Нет задач) */
//         <View style={styles.centerContent}>
//           <Text style={styles.statusTitle}>
//             {totalCount === 0 ? '🎉 На сегодня предстоящих задач нет!' : '💪 Все задачи на сегодня выполнены!'}
//           </Text>
//           <Text style={styles.statusSubtitle} numberOfLines={2}>
//             {totalCount === 0 
//               ? 'Отличный шанс закрыть старые долги или просто отдохнуть.' 
//               : 'Вы отлично потрудились. Время перевести дух или разгрести бэклог!'}
//           </Text>
//         </View>
//       ) : (
//         /* 📊 ВАРИАНТ 2: Шкала прогресса (День в процессе) */
//         <View style={styles.progressContent}>
//           <View style={styles.row}>
//             <Text style={styles.whiteBoldText}>Прогресс выполнения —</Text>
//             <Animated.View style={progressTextStyle}>
//               <Text style={styles.progressCountText}> {completedCount} </Text>
//             </Animated.View>
//             <Text style={styles.whiteBoldText}>из {totalCount}</Text>
//           </View>
//           <View style={styles.progressBarTrack}>
//             <View style={[styles.progressBarFill, progressBarSubStyle]} />
//           </View>
//         </View>
//       )}
//     </Animated.View>
//   );
// };

// export default React.memo(DayProgressBar);

// const styles = StyleSheet.create({
//   // ИСПРАВЛЕНО: Задана жесткая фиксированная высота для предотвращения скачков UI'#1C3542'
//   cardContainer: {
//     backgroundColor: '#052d3e',
//     borderWidth: 1,
//     borderColor: '#263238',
//     borderRadius: 14,
//     height: 100, // Строгие габариты для идеального бесшовного перехода
//     marginHorizontal: 10,
//     marginVertical: 15,
//     justifyContent: 'center', // Контент всегда центрируется по вертикали
//     paddingHorizontal: 16,
//   },
//   centerContent: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   progressContent: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 12, 
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   whiteBoldText: {
//     color: 'white',
//     fontWeight: '700',
//     fontSize: 15,
//   },
//   progressCountText: {
//     color: '#007aff',
//     fontWeight: '800',
//     fontSize: 16,
//   },
//   progressBarTrack: {
//     width: '90%',
//     backgroundColor: '#263238',
//     height: 8,
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   progressBarFill: {
//     height: '100%',
//     borderRadius: 10,
//   },
//   statusTitle: {
//     color: '#4CD964',
//     fontSize: 15,
//     fontWeight: '700',
//     marginBottom: 4,
//     textAlign: 'center',
//   },
//   statusSubtitle: {
//     color: '#A4B3C1',
//     fontSize: 13,
//     textAlign: 'center',
//     lineHeight: 18,
//   },
// });


import { useAppColors } from '@/context/ThemeContext';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, DimensionValue, StyleSheet, Text, View } from 'react-native';

interface DayProgressBarProps {
  completedCount: number;
  totalCount: number;
  scaleAnimatedValue: Animated.Value;
}

const DayProgressBar = ({ completedCount, totalCount, scaleAnimatedValue }: DayProgressBarProps) => {
  const isDayEmptyOrDone = totalCount === 0 || completedCount === totalCount;
  const [renderMode, setRenderMode] = useState(isDayEmptyOrDone);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const colors = useAppColors(); // Вся палитра доступна здесь автоматически!
  // Получаем текущую системную тему из контекста
 // const theme = useAppTheme();

  // // Динамическая палитра цветов для прогресс-бара
  // const colors = theme === 'dark' ? {
  //   cardBg: '#1C3542',
  //   borderColor: '#263238',
  //   whiteBoldText: '#FFFFFF',
  //   progressCountText: '#007aff',
  //   progressBarTrack: '#263238',
  //   statusTitle: '#4CD964',
  //   statusSubtitle: '#A4B3C1',
  //   shadowColor: '#000000',
  // } : {
  //   cardBg: '#FFFFFF',
  //   borderColor: '#E2E8F0',
  //   whiteBoldText: '#1E293B',
  //   progressCountText: '#007aff',
  //   progressBarTrack: '#E2E8F0',
  //   statusTitle: '#22C55E', // Более насыщенный зеленый для светлой темы
  //   statusSubtitle: '#64748B',
  //   shadowColor: '#0F172A',
  // };

  useEffect(() => {
    if (isDayEmptyOrDone !== renderMode) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(() => {
        setRenderMode(isDayEmptyOrDone);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [isDayEmptyOrDone, renderMode, fadeAnim]);

  const widthProgress = useMemo((): DimensionValue => {
    if (totalCount === 0) return '0%';
    const percent = Math.round((completedCount / totalCount) * 100);
    return `${percent}%`;
  }, [completedCount, totalCount]);

  const progressTextStyle = useMemo(() => ({ 
    transform: [{ scale: scaleAnimatedValue }] 
  }), [scaleAnimatedValue]);

  const progressBarSubStyle = useMemo(() => ({ 
    width: widthProgress, 
    backgroundColor: '#007aff' 
  }), [widthProgress]);

  return (
    <Animated.View style={[
      styles.cardContainer, 
      { 
        backgroundColor: colors.cardBg,
        borderColor: colors.borderColor,
        shadowColor: colors.shadowColor,
        opacity: fadeAnim,
        // Небольшая тень для светлой темы, чтобы карточка не сливалась с экраном
        shadowOpacity: colors.name === 'light' ? 0.06 : 0,
        elevation: colors.name  === 'light' ? 2 : 0,
      }
    ]}>
      {renderMode ? (
        /* 🎉 ВАРИАНТ 1: Мотивирующая плашка (Все сделано / Нет задач) */
        <View style={styles.centerContent}>
          <Text style={[styles.statusTitle, { color: colors.completedSectionTitle }]}>
            {totalCount === 0 ? '🎉 На сегодня предстоящих задач нет!' : '💪 Все задачи на сегодня выполнены!'}
          </Text>
          <Text style={[styles.statusSubtitle, { color: colors.subtitleText }]} numberOfLines={2}>
            {totalCount === 0 
              ? 'Отличный шанс закрыть старые долги или просто отдохнуть.' 
              : 'Вы отлично потрудились. Время перевести дух или разгрести бэклог!'}
          </Text>
        </View>
      ) : (
        /* 📊 ВАРИАНТ 2: Шкала прогресса (День в процессе) */
        <View style={styles.progressContent}>
          <View style={styles.row}>
            <Text style={[styles.whiteBoldText, { color: colors.titleText }]}>Прогресс выполнения —</Text>
            <Animated.View style={progressTextStyle}>
              <Text style={[styles.progressCountText, { color: colors.fabBg }]}> {completedCount} </Text>
            </Animated.View>
            <Text style={[styles.whiteBoldText, { color: colors.titleText }]}>из {totalCount}</Text>
          </View>
          <View style={[styles.progressBarTrack, { backgroundColor: colors.bulletColor }]}>
            <View style={[styles.progressBarFill, progressBarSubStyle]} />
          </View>
        </View>
      )}
    </Animated.View>
  );
};

export default React.memo(DayProgressBar);

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    borderRadius: 14,
    height: 100, 
    marginHorizontal: 10,
    marginVertical: 15,
    justifyContent: 'center', 
    paddingHorizontal: 16,
    // Настройки тени для iOS
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12, 
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  whiteBoldText: {
    fontWeight: '700',
    fontSize: 15,
  },
  progressCountText: {
    fontWeight: '800',
    fontSize: 16,
  },
  progressBarTrack: {
    width: '90%',
    height: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  statusSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
