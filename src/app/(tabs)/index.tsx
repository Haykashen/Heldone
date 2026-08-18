import Add from '@/components/buttons/Add';
import AgendaItem from '@/components/items/AgendaItem';
import ListEpmtyComponent from "@/components/items/ListEpmtyComponent";
import Header from '@/components/TabHeader';
import { SettingContext } from '@/context/SettingContext';
import { TaskContext } from '@/context/TaskContext';
import { scaleEnd, scaleStart } from '@/utils/animation';
import { completeTask } from '@/utils/taskUtils';
import { TTask } from '@/utils/types';
import { getFormatedDay } from '@/utils/utils';
import { Redirect, router } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import LottieView from 'lottie-react-native';
import { useContext, useEffect, useRef, useState } from 'react';
import { Animated, DimensionValue, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function Index() {
  const { task, setTask, loadedTask } = useContext(TaskContext);
  const { onboarded } = useContext(SettingContext);  
  const scale = useRef(new Animated.Value(1)).current;
  
  const today = new Date();
  const filtered = task.filter((item: TTask) => item.date.toLocaleDateString() === today.toLocaleDateString());
  const completed: [] = filtered.filter((item: TTask) => item.status.id === 'Completed')

  const [showConfetti, setShowConfetti] = useState((filtered.length > 0 && completed.length === filtered.length))
  let progressPercent = Math.round(completed.length / filtered.length * 100);
  let widthProgress = (progressPercent ? progressPercent : 0) + '%';

  useEffect(() => {
    if (loadedTask) {
      SplashScreen.hide();
    }
  }, [loadedTask]);

  useEffect(() => {
    setShowConfetti((filtered.length > 0 && completed.length === filtered.length))
  }, [task]);

  if (loadedTask && !onboarded) {
    return <Redirect href={'/onboarding'} />
  }

  const handlePress = (id: string) => {
    router.push((`/${id}`))
  }

  const handleComplete = (id: string) => {
    scaleStart(scale, 1.3)
    completeTask(id, task, setTask)
    setTimeout(() => scaleEnd(scale, 1), 50)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#031F2B', paddingTop: 5, flexDirection: 'column', gap: 10 }}>
      <Header title='Сегодня' text={today.toLocaleDateString("ru-RU", { weekday: 'long', year: "numeric", month: "long", day: "numeric", })} />
      <View style={{ marginVertical: 15, borderColor: 'silver', borderRadius: 10, borderWidth: 2, height: 100, marginHorizontal: 10, flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', }}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Прогресс выполнения -</Text>
          <Animated.View style={{ transform: [{ scale }] }}>
            <Text style={{ color: 'white', fontWeight: 'bold', alignItems: 'center' }}> {completed.length} </Text>
          </Animated.View>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>из {filtered.length}</Text>
        </View>
        <View style={{ width: '80%', backgroundColor: 'white', height: 8, borderRadius: 10 }}>
          <View style={{ width: widthProgress as DimensionValue, backgroundColor: '#007aff', height: 8, borderRadius: 10 }}></View>
        </View>
      </View>
      <Text style={{ color: '#7a92a5', fontSize: 16, fontWeight: 'bold', paddingHorizontal: 10 }}>Задачи на сегодня</Text>
      {showConfetti && 
        <LottieView
          style={{ top: 140,height: 200, width: '100%', position: 'absolute' }}
          source={require('@/assets/animation/Confetti.json')}
          autoPlay loop={false}
          onAnimationFinish={() => setShowConfetti(false)}
        />
      }      
      <FlatList
        data={filtered}
        keyExtractor={(item, index) => item.id}
        renderItem={({ item }) => (
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
        )}
        ListEmptyComponent={() => (
          <ListEpmtyComponent
            title='У вас пока нет никаких заданий!'
            text='Добавьте задачу, чтобы сделать ваш день продуктивным.'
            date={getFormatedDay(today)}
          />
        )
        }
      />
      <Add date={getFormatedDay(today)} />
    </SafeAreaView>
  )
}
//"#4894FE"

const style = (Theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bg_Primary,
    alignItems: 'center',
    gap: 5,
    padding: 5
  },
  textHeader: {
    color: Theme.colors.text_Primary,
    fontSize: 22,
    fontWeight: 'bold'
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});