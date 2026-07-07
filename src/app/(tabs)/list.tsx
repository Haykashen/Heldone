
import Add from '@/components/buttons/Add';
import AgendaItem from '@/components/items/AgendaItem';
import ListEpmtyComponent from "@/components/items/ListEpmtyComponent";
import { Context } from '@/context/context';
import TaskStatus from '@/data/TaskStatus';
import { completeTask } from '@/utils/taskManage';
import { getFormatedDay, getTaskByDays } from '@/utils/utils';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { RelativePathString, router } from "expo-router";
import { useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AgendaList, CalendarProvider, LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

LocaleConfig.locales['rus'] = {
  monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
  monthNamesShort: ['Янв.', 'Фев.', 'Мар.', 'Апр.', 'Май', 'Июнь', 'Июль', 'Авг.', 'Сен.', 'Окт.', 'Ноя.', 'Дек.'],
  dayNames: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
  dayNamesShort: ['Пон.', 'Вт.', 'Ср.', 'Чет.', 'Пят.', 'Суб.', 'Вос.'],
  today: "Сегодня"
};

LocaleConfig.defaultLocale = 'rus';

const list = () => {
  const { task, setTask } = useContext(Context);
  const [status, setStatus]  = useState(TaskStatus.Upcoming.id)

  let sortTask = getTaskByDays(task, status)

  useEffect(()=>{
    sortTask = getTaskByDays(task, status)
  },[task, status])
 
  const handlePress = (id: string) => {
    router.push(('/' + id) as RelativePathString)
  }

  const handleComplete = (id: string) => {
    completeTask(id, task, setTask)
  }

  const changeStatus = (status:string) =>{
    setStatus(status)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#031F2B', paddingTop: 5, flexDirection: 'column', gap: 10 }}>
      <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
        <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Задачи</Text>
        <Pressable onPress={() => router.push('/notice')}>
          <MaterialDesignIcons name={'bell'} color={'white'} size={26} />
        </Pressable>
      </View> 
      <View style={{ backgroundColor: '#545759', padding: 5, gap: 5, flexDirection: 'row', marginHorizontal: 10, marginTop:15, borderRadius: 10 }}>
        <Pressable
          onPress={() => changeStatus(TaskStatus.Upcoming.id)}
          style={{ flex: 1, backgroundColor: status === 'Upcoming' ? '#4894FE' : '#263238', paddingVertical: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Предстоящие</Text>
        </Pressable>
        <Pressable
          onPress={() => changeStatus(TaskStatus.Completed.id)}
          style={{ flex: 1, backgroundColor: status === 'Completed' ? '#4894FE' : '#263238',paddingVertical: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Выполненно</Text>
        </Pressable>
        <Pressable
          onPress={() => changeStatus('')}
          style={{ flex: 1, backgroundColor: status === '' ? '#4894FE' : '#263238', paddingVertical: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Все</Text>
        </Pressable>
      </View>     
      <CalendarProvider
        date={sortTask[0]?.title ? sortTask[0]?.title : getFormatedDay(new Date())}
        onDateChanged={(date, updateSource) => { console.log('onDateChanged', date) }}
        showTodayButton
        theme={{
          todayButtonTextColor: '#007aff',
          todayButtonFontWeight: 'bold'
        }}
      >
        <AgendaList
          sections={sortTask}
          sectionStyle={{ backgroundColor: '#031F2B', }}
          ListEmptyComponent={<ListEpmtyComponent />}
          renderItem={({ item }: any) => <AgendaItem
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
          />}
        />
      </CalendarProvider>
      <Add />
    </SafeAreaView>
  )
}
//"#4894FE"
export default list

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