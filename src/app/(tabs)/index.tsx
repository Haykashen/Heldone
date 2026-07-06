import Add from '@/components/buttons/Add';
import AgendaItem from '@/components/items/AgendaItem';
import ListEpmtyComponent from "@/components/items/ListEpmtyComponent";
import { Context } from '@/context/context';
import { completeTask } from '@/utils/taskManage';
import { TTask } from '@/utils/types';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { RelativePathString, router } from "expo-router";
import { useContext, useState } from 'react';
import { DimensionValue, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const { task, setTask } = useContext(Context);
  const [refresh, setRefresh] = useState(false);
  const filtered = task.filter((item:TTask) => item.date.toLocaleDateString()=== new Date().toLocaleDateString());
  const completed:[] = filtered.filter((item:TTask) => item.status.id === 'Completed')

  const handlePress = (id: string) => {
    router.push(('/' + id) as RelativePathString)
  }

  const handleComplete = (id: string) => {
    completeTask(id, task, setTask)
  }

  let progressPercent = Math.round(completed.length/filtered.length*100);
  let widthProgress = (progressPercent ? progressPercent : 0)+'%';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#031F2B', paddingTop: 5, flexDirection: 'column', gap: 10 }}>
      <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
        <View style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
          <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Сегодня</Text>
          <Text style={{ color: '#7a92a5', fontSize: 16 }}>{new Date().toLocaleDateString("ru-RU", { weekday: 'long', year: "numeric", month: "long", day: "numeric", })}</Text>
        </View>
        <Pressable onPress={() => router.push('/notice')}>
          <MaterialDesignIcons name={'bell'} color={'white'} size={26} />
        </Pressable>
      </View>     
      <View style={{ width: '80%', backgroundColor: '#545759', height: 100, margin: 'auto', borderRadius: 10, flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Прогресс выполнения - {completed.length} из {filtered.length}</Text>
        <View style={{ width: '80%', backgroundColor: 'white', height: 6, borderRadius: 10 }}>
          <View style={{ width: widthProgress as DimensionValue, backgroundColor: '#007aff', height: 6, borderRadius: 10 }}></View>
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
            timeStatus={item.timeStatus}
            notes={item.notes}
            onCompletePress={() => handleComplete(item.id)}
            onItemPress={() => handlePress(item.id)}
            onDeletePress={() => null}
          />
        )}
        ListEmptyComponent={() => (
          <ListEpmtyComponent />
        )
        }
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={() => setRefresh(!refresh)} />
        }
      />
      <Add />
    </SafeAreaView>
  )
}
//"#4894FE"


const style = (Theme:any)=> StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bg_Primary,
    alignItems:'center',
    gap:5,
    padding:5
  },
 textHeader:{
    color: Theme.colors.text_Primary, 
    fontSize:22,
    fontWeight:'bold'
  },
  button:{
    flex:1,  
    alignItems:'center', 
    justifyContent:'center',
    color:'white',
    fontWeight: 'bold', 
    fontSize: 16 
  }
});