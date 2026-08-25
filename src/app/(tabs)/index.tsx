import Add from '@/components/buttons/Add';
import AgendaItem from '@/components/items/AgendaItem';
import ListEpmtyComponent from "@/components/items/ListEmptyComponent";
import Header from '@/components/TabHeader';
import { TTask } from '@/components/types/typesTask';
import { OnboardingContext } from '@/context/OnboardingContext';
import { TaskContext } from '@/context/TaskContext';
import { scaleEnd, scaleStart } from '@/utils/animation'; // Предполагаю, там Animated.timing
import { completeTask } from '@/utils/taskUtils';
import { getFormatedDay } from '@/utils/utils';
import { Redirect, router } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import LottieView from 'lottie-react-native';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, DimensionValue, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const { task, setTask, loadedTask } = useContext(TaskContext);
  const { loadedOnboarding, onboarded } = useContext(OnboardingContext);  
  const scale = useRef(new Animated.Value(1)).current;
  
  // Создаем дату один раз при рендере (или мемоизируем строковое значение)
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => getFormatedDay(today), [today]);

  // МЕМОИЗАЦИЯ: Фильтруем таски эффективно по строке даты, а не через toLocaleDateString
  const { filtered, completed } = useMemo(() => {
    const filteredTasks = task.filter((item: TTask) => item.dateString === todayStr);
    const completedTasks = filteredTasks.filter((item: TTask) => item.status.id === 'Completed');
    return { filtered: filteredTasks, completed: completedTasks };
  }, [task, todayStr]);

  const [showConfetti, setShowConfetti] = useState(false);

  // Безопасный расчет процентов (защита от деления на 0 и NaN)
  const widthProgress = useMemo((): DimensionValue => {
    if (filtered.length === 0) return '0%';
    const percent = Math.round((completed.length / filtered.length) * 100);
    return `${percent}%`;
  }, [completed.length, filtered.length]);

  // Управление сплэш-скрином
  useEffect(() => {
    if (loadedTask) {
      SplashScreen.hide();
    }
  }, [loadedTask]);

  // Триггер конфетти только при изменении количества выполненных
  useEffect(() => {
    if (filtered.length > 0 && completed.length === filtered.length) {
      setShowConfetti(true);
    } else {
      setShowConfetti(false);
    }
  }, [completed.length, filtered.length]);

  // Оптимизированные хэндлеры
  const handlePress = useCallback((id: string) => {
    router.push(`/${id}`);
  }, []);

  const handleComplete = useCallback((id: string) => {
    // Безопасная анимация: сначала увеличиваем, по окончании уменьшаем назад
    // Вместо setTimeout используем встроенный коллбэк старта анимации
    scaleStart(scale, 1.3);
    completeTask(id, task, setTask);
    
    // Передаем откат анимации в очередь макрозадач корректно через requestAnimationFrame или встроенный механизм
    requestAnimationFrame(() => {
      scaleEnd(scale, 1);
    });
  }, [task, setTask, scale]);

  // Мемоизированный renderItem для FlatList
  const renderItem = useCallback(({ item }: { item: TTask }) => (
    <AgendaItem
      id={item.id}
      date={item.date}
      category={item.category}
      status={item.status}
      title={item.title}
      priority={item.priority}
      notes={item.notes}
      sendNotify={item.sendNotify}
      files={item.files}
      onCompletePress={() => handleComplete(item.id)}
      onItemPress={() => handlePress(item.id)}
    />
  ), [handleComplete, handlePress]);

  const renderEmpty = useCallback(() => (
    <ListEpmtyComponent
      title='У вас пока нет никаких заданий!'
      text='Добавьте задачу, чтобы сделать ваш день продуктивным.'
      date={todayStr}
    />
  ), [todayStr]);

  const progressTextStyle = useMemo(() => ({ transform: [{ scale }] }), [scale]);
  const progressBarSubStyle = useMemo(() => ({ width: widthProgress, backgroundColor: '#007aff' }), [widthProgress]);

  // Навигация на Onboarding
  if (loadedTask && loadedOnboarding && !onboarded) {
    return <Redirect href={'/onboarding'} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title='Сегодня' 
        text={today.toLocaleDateString("ru-RU", { weekday: 'long', year: "numeric", month: "long", day: "numeric" })} 
      />
      
      <View style={styles.progressCard}>
        <View style={styles.row}>
          <Text style={styles.whiteBoldText}>Прогресс выполнения -</Text>
          <Animated.View style={progressTextStyle}>
            <Text style={styles.progressCountText}> {completed.length} </Text>
          </Animated.View>
          <Text style={styles.whiteBoldText}>из {filtered.length}</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, progressBarSubStyle]} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Задачи на сегодня</Text>

      {showConfetti && (
        <LottieView
          style={styles.confetti}
          source={require('@/assets/animation/Confetti.json')}
          autoPlay
          loop={false}
          onAnimationFinish={() => setShowConfetti(false)}
        />
      )}      

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
      />
      
      <Add date={todayStr} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#031F2B',
    paddingTop: 5,
    flexDirection: 'column',
    gap: 10,
  },
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
  sectionTitle: {
    color: '#7a92a5',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  confetti: {
    top: 140,
    height: 200,
    width: '100%',
    position: 'absolute',
  },
});