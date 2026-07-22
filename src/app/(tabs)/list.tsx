
import Add from '@/components/buttons/Add';
import StatusFilter from '@/components/buttons/StatusFilter';
import AgendaItem from '@/components/items/AgendaItem';
import ListEpmtyComponent from "@/components/items/ListEpmtyComponent";
import Header from '@/components/TabHeader';
import { Context } from '@/context/context';
import TaskStatus from '@/data/StatusData';
import { completeTask } from '@/utils/taskManage';
import { getFormatedDay, getTaskByDays } from '@/utils/utils';
import { RelativePathString, router } from "expo-router";
import { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
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
  const today = new Date();
  //let comletedCount = task.filter((item:TTask)=> item.status.id == TaskStatus.Completed.id)
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
      <Header title='Мои задачи' text='по дням и статусам'/>
      <CalendarProvider
        date={sortTask[0]?.title ? sortTask[0]?.title : getFormatedDay(today)}
        showTodayButton = {sortTask[0] ? true: false}
        theme={{
          todayButtonTextColor: '#007aff',
          todayButtonFontWeight: 'bold'
        }}
        style={{ gap: sortTask[0] ? 0 : 40}}
      >
      <View style={{ padding: 5, gap: 7, flexDirection: 'row', marginHorizontal: 5, marginTop: 15, borderRadius: 10 }}>
        <StatusFilter 
          status={TaskStatus.Upcoming.id} 
          currStatus={status} 
          title={'Предстоит'} 
          changeStatus={changeStatus}
        />
        <StatusFilter 
          status={TaskStatus.Completed.id} 
          currStatus={status} 
          title={'Выполненно'} 
          changeStatus={changeStatus}
        />
        <StatusFilter 
          status={''} 
          currStatus={status} 
          title={'Все'} 
          changeStatus={changeStatus}
        />                
      </View>          
        <AgendaList
          sections={sortTask}
          sectionStyle={{ backgroundColor: '#031F2B', }}
          ListEmptyComponent={
            <ListEpmtyComponent 
              date=''
              title = {status === TaskStatus.Completed.id? 'У вас пока нет выполненных заданий!' :'У вас пока нет никаких заданий!'}
              text  = {status === TaskStatus.Completed.id? 'Выполняйте задачи, чтобы ваши дни были продуктивными.' :'Добавьте задачу, чтобы быть продуктивным.'}   
            />
          }
          renderItem={({ item }: any) => <AgendaItem
            id={item.id}
            date={item.date}
            category={item.category}
            status={item.status}
            title={item.title}
            notes={item.notes}
            priority={item.priority}
            onCompletePress={() => handleComplete(item.id)}
            onItemPress={() => handlePress(item.id)}
            onDeletePress={() => null}
          />}
        />
      </CalendarProvider>
      <Add date={getFormatedDay(today)}/>
    </SafeAreaView>
  )
}
//"#4894FE"
export default list
