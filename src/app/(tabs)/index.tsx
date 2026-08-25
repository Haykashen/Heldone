import Add from '@/components/buttons/Add';
import AgendaItem from '@/components/items/AgendaItem';
import DayProgressBar from '@/components/items/DayProgressBar';
import ListEmptyComponent from "@/components/items/ListEmptyComponent";
import Header from '@/components/TabHeader';
import { TTask } from '@/components/types/typesTask';
import { OnboardingContext } from '@/context/OnboardingContext';
import { TaskContext } from '@/context/TaskContext';
import { useAppColors } from '@/context/ThemeContext'; // Импортируем хук темы
import { scaleEnd, scaleStart } from '@/utils/animation';
import { completeTask } from '@/utils/taskUtils';
import { getFormatedDay } from '@/utils/utils';
import { Redirect, router } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import LottieView from 'lottie-react-native';
import { use, useCallback, useEffect, useRef, useState } from 'react';
import { Animated, SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const { task, setTask, loadedTask } = use(TaskContext);
  const { loadedOnboarding, onboarded } = use(OnboardingContext);  
  
  const colors = useAppColors(); // Вся палитра доступна здесь автоматически!

  const scale = useRef(new Animated.Value(1)).current;
  const [showConfetti, setShowConfetti] = useState(false);
  
  const today = new Date();
  const todayStr = getFormatedDay(today);
  const upcomingTodayTasks: TTask[] = [];
  const completedTodayTasks: TTask[] = [];
  const missedTasks: TTask[] = [];

  const todayStartOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

  task.forEach((item: TTask) => {
    const itemDate = new Date(item.date);
    const itemTime = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate()).getTime();

    if (item.dateString === todayStr) {
      if (item.status.id === 'Completed') {
        completedTodayTasks.push(item);
      } else {
        upcomingTodayTasks.push(item);
      }
    } else if (itemTime < todayStartOfDay && item.status.id !== 'Completed') {
      missedTasks.push(item);
    }
  });

  const totalTodayCount = upcomingTodayTasks.length + completedTodayTasks.length;
  const completedTodayCount = completedTodayTasks.length;

  const sections = [];
  
  if (upcomingTodayTasks.length > 0) {
    sections.push({ 
      title: 'Предстоящие на сегодня', 
      data: upcomingTodayTasks, 
      count: upcomingTodayTasks.length, 
      isMissed: false, 
      isCompletedSection: false 
    });
  }
  
  if (completedTodayTasks.length > 0) {
    sections.push({ 
      title: 'Выполненные за сегодня', 
      data: completedTodayTasks, 
      count: completedTodayTasks.length, 
      isMissed: false, 
      isCompletedSection: true 
    });
  }

  if (missedTasks.length > 0) {
    sections.push({ 
      title: 'Пропущенные задачи', 
      data: missedTasks, 
      count: missedTasks.length, 
      isMissed: true, 
      isCompletedSection: false 
    });
  }

  useEffect(() => {
    if (loadedTask) SplashScreen.hide();
  }, [loadedTask]);

  useEffect(() => {
    if (totalTodayCount > 0 && completedTodayCount === totalTodayCount) {
      setShowConfetti(true);
    } else {
      setShowConfetti(false);
    }
  }, [completedTodayCount, totalTodayCount]);

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

  const renderSectionHeader = useCallback(({ section }: { section: any }) => (
    <View style={[styles.headerRow, { backgroundColor: colors.headerRowBg }]}>
      <Text style={[
        styles.sectionTitle, 
        { color: colors.sectionTitle },
        section.isMissed && { color: colors.missedSectionTitle },
        section.isCompletedSection && { color: colors.completedSectionTitle }
      ]}>
        {section.title}
      </Text>
      <View style={[
        styles.badge, 
        { backgroundColor: colors.badgeBg },
        section.isMissed && { backgroundColor: colors.missedBadgeBg },
        section.isCompletedSection && { backgroundColor: colors.completedBadgeBg }
      ]}>
        <Text style={[
          styles.badgeText,
          { color: (!section.isMissed && !section.isCompletedSection) ? colors.badgeText : (section.isMissed ? colors.missedSectionTitle : colors.completedSectionTitle)},
        ]}>
          {section.count}
        </Text>
      </View>
    </View>
  ), [colors, colors]);

  const renderEmpty = useCallback(() => (
    <ListEmptyComponent
      title='У вас пока нет никаких заданий!'
      text='Добавьте задачу, чтобы сделать ваш день продуктивным.'
      date={todayStr}
    />
  ), [todayStr]);

  const renderListHeader = useCallback(() => (
    <DayProgressBar 
      completedCount={completedTodayCount} 
      totalCount={totalTodayCount} 
      scaleAnimatedValue={scale} 
    />
  ), [completedTodayCount, totalTodayCount, scale]);

  if (loadedTask && loadedOnboarding && !onboarded) {
    return <Redirect href={'/onboarding'} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.containerBg }]}>
      <Header 
        title='Сегодня' 
        text={today.toLocaleDateString("ru-RU", { weekday: 'long', year: "numeric", month: "long", day: "numeric" })}
      />

      {showConfetti && (
        <LottieView
          style={styles.confetti}
          source={require('@/assets/animation/Confetti.json')}
          autoPlay
          loop={false}
          onAnimationFinish={() => setShowConfetti(false)}
        />
      )}      

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmpty}
        stickySectionHeadersEnabled={true}
        contentContainerStyle={styles.listContent}
      />
      
      {/* Передаем тему в кнопку добавления таски, чтобы кнопка меняла свой акцент */}
      <Add date={todayStr}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    flexDirection: 'column',
    gap: 10,
  },
  listContent: {
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  confetti: {
    top: 90,
    height: 200,
    width: '100%',
    position: 'absolute',
    zIndex: 10,
  },
});

