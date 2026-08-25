import React, { useMemo } from 'react';
import { Animated, DimensionValue, StyleSheet, Text, View } from 'react-native';

interface DayProgressBarProps {
  completedCount: number;
  totalCount: number;
  scaleAnimatedValue: Animated.Value; // Передаем анимированное значение из родителя для синхронизации с handleComplete
}

const DayProgressBar = ({ completedCount, totalCount, scaleAnimatedValue }: DayProgressBarProps) => {
  // Безопасный расчет процентов (защита от деления на 0 и NaN)
  const widthProgress = useMemo((): DimensionValue => {
    if (totalCount === 0) return '0%';
    const percent = Math.round((completedCount / totalCount) * 100);
    return `${percent}%`;
  }, [completedCount, totalCount]);

  // Мемоизируем стили для предотвращения лишних вычислений в рантайме
  const progressTextStyle = useMemo(() => ({ 
    transform: [{ scale: scaleAnimatedValue }] 
  }), [scaleAnimatedValue]);

  const progressBarSubStyle = useMemo(() => ({ 
    width: widthProgress, 
    backgroundColor: '#007aff' 
  }), [widthProgress]);

  return (
    <View style={styles.progressCard}>
      <View style={styles.row}>
        <Text style={styles.whiteBoldText}>Прогресс выполнения -</Text>
        <Animated.View style={progressTextStyle}>
          <Text style={styles.progressCountText}> {completedCount} </Text>
        </Animated.View>
        <Text style={styles.whiteBoldText}>из {totalCount}</Text>
      </View>
      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, progressBarSubStyle]} />
      </View>
    </View>
  );
};

export default React.memo(DayProgressBar);

const styles = StyleSheet.create({
  progressCard: {
    marginVertical: 15,
    borderColor: 'silver',
    borderRadius: 10,
    borderWidth: 2,
    height: 100,
    marginHorizontal: 10,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  whiteBoldText: {
    color: 'white',
    fontWeight: 'bold',
  },
  progressCountText: {
    color: 'white',
    fontWeight: 'bold',
    alignItems: 'center',
  },
  progressBarTrack: {
    width: '80%',
    backgroundColor: 'white',
    height: 8,
    borderRadius: 10,
  },
  progressBarFill: {
    height: 8,
    borderRadius: 10,
  },
});
