import Add from '@/components/buttons/Add';
import AgendaItem from '@/components/items/AgendaItem';
import DayProgressBar from '@/components/items/DayProgressBar';
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
import { Animated, FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const { task, setTask, loadedTask } = useContext(TaskContext);
  const { loadedOnboarding, onboarded } = useContext(OnboardingContext);  
  const scale = useRef(new Animated.Value(1)).current;
  
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => getFormatedDay(today), [today]);

  const { filtered, completed } = useMemo(() => {
    const filteredTasks = task.filter((item: TTask) => item.dateString === todayStr);
    const completedTasks = filteredTasks.filter((item: TTask) => item.status.id === 'Completed');
    return { filtered: filteredTasks, completed: completedTasks };
  }, [task, todayStr]);

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (loadedTask) SplashScreen.hide();
  }, [loadedTask]);

  useEffect(() => {
    setShowConfetti(filtered.length > 0 && completed.length === filtered.length);
  }, [completed.length, filtered.length]);

  const handlePress = useCallback((id: string) => {
    router.push(`/${id}`);
  }, []);

  const handleComplete = useCallback((id: string) => {
    scaleStart(scale, 1.3);
    completeTask(id, task, setTask);
    requestAnimationFrame(() => {
      scaleEnd(scale, 1);
    });
  }, [task, setTask, scale]);

  const renderItem = useCallback(({ item }: { item: TTask }) => (
    <AgendaItem {...item} onCompletePress={() => handleComplete(item.id)} onItemPress={() => handlePress(item.id)} />
  ), [handleComplete, handlePress]);

  const renderEmpty = useCallback(() => (
    <ListEpmtyComponent title='У вас пока нет никаких заданий!' text='Добавьте задачу, чтобы сделать ваш день продуктивным.' date={todayStr} />
  ), [todayStr]);

  if (loadedTask && loadedOnboarding && !onboarded) {
    return <Redirect href={'/onboarding'} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title='Сегодня' 
        text={today.toLocaleDateString("ru-RU", { weekday: 'long', year: "numeric", month: "long", day: "numeric" })} 
      />
      
      {/* Использование нового чистого компонента */}
      <DayProgressBar 
        completedCount={completed.length} 
        totalCount={filtered.length} 
        scaleAnimatedValue={scale} 
      />

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
