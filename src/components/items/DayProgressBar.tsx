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
    <Animated.View style={[styles.cardContainer, { opacity: fadeAnim }]}>
      {renderMode ? (
        /* 🎉 ВАРИАНТ 1: Мотивирующая плашка (Все сделано / Нет задач) */
        <View style={styles.centerContent}>
          <Text style={styles.statusTitle}>
            {totalCount === 0 ? '🎉 На сегодня предстоящих задач нет!' : '💪 Все задачи на сегодня выполнены!'}
          </Text>
          <Text style={styles.statusSubtitle} numberOfLines={2}>
            {totalCount === 0 
              ? 'Отличный шанс закрыть старые долги или просто отдохнуть.' 
              : 'Вы отлично потрудились. Время перевести дух или разгрести бэклог!'}
          </Text>
        </View>
      ) : (
        /* 📊 ВАРИАНТ 2: Шкала прогресса (День в процессе) */
        <View style={styles.progressContent}>
          <View style={styles.row}>
            <Text style={styles.whiteBoldText}>Прогресс выполнения —</Text>
            <Animated.View style={progressTextStyle}>
              <Text style={styles.progressCountText}> {completedCount} </Text>
            </Animated.View>
            <Text style={styles.whiteBoldText}>из {totalCount}</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, progressBarSubStyle]} />
          </View>
        </View>
      )}
    </Animated.View>
  );
};

export default React.memo(DayProgressBar);

const styles = StyleSheet.create({
  // ИСПРАВЛЕНО: Задана жесткая фиксированная высота для предотвращения скачков UI'#1C3542'
  cardContainer: {
    backgroundColor: '#052d3e',
    borderWidth: 1,
    borderColor: '#263238',
    borderRadius: 14,
    height: 100, // Строгие габариты для идеального бесшовного перехода
    marginHorizontal: 10,
    marginVertical: 15,
    justifyContent: 'center', // Контент всегда центрируется по вертикали
    paddingHorizontal: 16,
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
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
  },
  progressCountText: {
    color: '#007aff',
    fontWeight: '800',
    fontSize: 16,
  },
  progressBarTrack: {
    width: '90%',
    backgroundColor: '#263238',
    height: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  statusTitle: {
    color: '#4CD964',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  statusSubtitle: {
    color: '#A4B3C1',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
