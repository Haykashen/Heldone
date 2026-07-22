import Add from '@/components/buttons/Add';
import AgendaItem from '@/components/items/AgendaItem';
import ListEpmtyComponent from "@/components/items/ListEpmtyComponent";
import Header from '@/components/TabHeader';
import { Context } from '@/context/context';
import { scaleEnd, scaleStart } from '@/utils/animation';
import { completeTask } from '@/utils/taskManage';
import { TTask } from '@/utils/types';
import { getFormatedDay } from '@/utils/utils';
import { RelativePathString, router } from "expo-router";
import { useContext, useRef } from 'react';
import { Animated, DimensionValue, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Index() {
  const { task, setTask } = useContext(Context);
  const scale = useRef(new Animated.Value(1)).current;
  const today = new Date();
  //const [refresh, setRefresh] = useState(false);
  const filtered = task.filter((item: TTask) => item.date.toLocaleDateString() === today.toLocaleDateString());
  const completed: [] = filtered.filter((item: TTask) => item.status.id === 'Completed')

  const handlePress = (id: string) => {
    router.push(('/' + id) as RelativePathString)
  }

  const handleComplete = (id: string) => {
    scaleStart(scale, 1.3)
    completeTask(id, task, setTask)
    setTimeout(() => scaleEnd(scale, 1), 100)
    //
  }

  let progressPercent = Math.round(completed.length / filtered.length * 100);
  let widthProgress = (progressPercent ? progressPercent : 0) + '%';

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
            onCompletePress={() => handleComplete(item.id)}
            onItemPress={() => handlePress(item.id)}
          />
        )}
        ListEmptyComponent={() => (
          <ListEpmtyComponent
            title = 'У вас пока нет никаких заданий!'
            text = 'Добавьте задачу, чтобы сделать ваш день продуктивным.'
            date = {getFormatedDay(today)}
          />
        )
        }
      // refreshControl={
      //   <RefreshControl refreshing={refresh} onRefresh={() => setRefresh(!refresh)} />
      // }
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