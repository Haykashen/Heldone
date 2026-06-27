
import AgendaItem from '@/components/items/AgendaItem';
import { Context } from '@/context/context';
import { setData } from '@/store/setData';
import { TTask } from "@/utils/types";
import { getFormatedDay, getNewTask, getTaskByDays } from '@/utils/utils';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { RelativePathString, router } from "expo-router";
import { useCallback, useContext } from 'react';
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
  const sortTask = getTaskByDays(task)
  const renderItem = useCallback(({ item }: any) => {
    return <AgendaItem item={item} />;
  }, []);

  const handlePress = (id: string) => {
    /*router.push({pathname: '/components/cards/placeCard',params: { placeID: item.id, otherParam: 'anything you want here' }})*/
    router.push(('/' + id) as RelativePathString)
  }

  const handleAdd = () => {
    const newTask = getNewTask()
    task.push(newTask)
    const sortedArray = task.sort((first: TTask, second: TTask) => { return (first.date.getTime() - second.date.getTime()) })
    setTask(sortedArray)
    setData("todo", JSON.stringify(sortedArray))
    handlePress(newTask.id)
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#031F2B', paddingTop: 5, flexDirection: 'column', gap: 10 }}>
      <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
        <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Мои задачи</Text>
        <Pressable onPress={() => router.push('/notice')}>
          <MaterialDesignIcons name={'bell'} color={'white'} size={24} />
        </Pressable>
      </View>
      <CalendarProvider
        date={sortTask[0]?.title ? sortTask[0]?.title : getFormatedDay(new Date())}//
        // onDateChanged={onDateChanged}
        onDateChanged={(date, updateSource) => { console.log('onDateChanged', date) }}
        showTodayButton

        // disabledOpacity={0.6}
        theme={{
          todayButtonTextColor: '#63B4FF'
        }}
      // todayBottomMargin={16}
      // disableAutoDaySelection={[ExpandableCalendar.navigationTypes.MONTH_SCROLL, ExpandableCalendar.navigationTypes.MONTH_ARROWS]}
      >
        <AgendaList
          sections={sortTask}
          renderItem={renderItem}
          // scrollToNextEvent
          sectionStyle={{ backgroundColor: '#031F2B', }}
        // dayFormat={'yyyy-MM-d'}
        />
      </CalendarProvider>

      <Pressable
        onPress={handleAdd}
        style={{ margin: 10, height: 60, width: 60, borderRadius: 45, backgroundColor: "#4894FE", position: 'absolute', bottom: 15, right: 15, alignItems: 'center', justifyContent: 'center' }}>
        <MaterialDesignIcons name={"plus"} size={34} color={"white"} />
      </Pressable>
    </SafeAreaView>
  )
}

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