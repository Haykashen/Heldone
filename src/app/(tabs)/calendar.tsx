// import Add from '@/components/buttons/Add';
// import AgendaItem from '@/components/items/AgendaItem';
// import ListEpmtyComponent from "@/components/items/ListEpmtyComponent";
// import Header from '@/components/TabHeader';
// import { TaskContext } from '@/context/TaskContext';
// import { completeTask } from '@/utils/taskUtils';
// import { getCalendarTitle, getDayTasks, getFormatedDay, getMultiDotsDays } from '@/utils/utils';
// import { router } from "expo-router";
// import { useCallback, useContext, useRef, useState } from 'react';
// import { Animated, Easing, Pressable, Text } from 'react-native';
// import { AgendaList, CalendarProvider, ExpandableCalendar, LocaleConfig } from 'react-native-calendars';
// import { SafeAreaView } from 'react-native-safe-area-context';

// LocaleConfig.locales['rus'] = {
//   monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
//   monthNamesShort: ['Янв.', 'Фев.', 'Мар.', 'Апр.', 'Май', 'Июнь', 'Июль', 'Авг.', 'Сен.', 'Окт.', 'Ноя.', 'Дек.'],
//   dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
//   dayNamesShort: ['Вос.', 'Пон.', 'Вт.', 'Ср.', 'Чет.', 'Пят.', 'Суб.'],
//   today: "Сегодня"
// };
// LocaleConfig.defaultLocale = 'rus';

// const calendar = () => {
//   const { task, setTask } = useContext(TaskContext);
//   const CHEVRON = require('@/assets/images/next.png');  
//   //const {weekView} = props;///????
//   const today = getFormatedDay(new Date());
//   const [date, setDate] = useState(today)
//   let dayTasks = getDayTasks(task, date)
//   const multiDots = getMultiDotsDays(task)
  
//   const calendarRef = useRef<{toggleCalendarPosition: () => boolean}>(null);
//   const rotation = useRef(new Animated.Value(0));

//   const toggleCalendarExpansion = useCallback(() => {
//     const isOpen = calendarRef.current?.toggleCalendarPosition();
//     Animated.timing(rotation.current, {
//       toValue: isOpen ? 1 : 0,
//       duration: 200,
//       useNativeDriver: true,
//       easing: Easing.out(Easing.ease)
//     }).start();
//   }, []);

//   const renderHeader = useCallback(
//     (date: Date) => {
//       const title = getCalendarTitle(new Date(date))
//       const rotationInDegrees = rotation.current.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-180deg'] });

//       return (
//         <Pressable style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10, gap:5}} onPress={toggleCalendarExpansion}>
//           <Text style={{fontSize: 16, fontWeight: 'bold', marginRight: 6}}>{title}</Text>
//           <Animated.Image source={CHEVRON} style={{transform: [{rotate: '90deg'}, {rotate: rotationInDegrees}]}}/>
//         </Pressable>
//       );
//     },
//     [toggleCalendarExpansion]
//   );

//   const onCalendarToggled = useCallback(
//     (isOpen: boolean) => {
//       rotation.current.setValue(isOpen ? 1 : 0);
//     },
//     [rotation]);
    
//   const handleComplete = (id: string) => {
//     completeTask(id, task, setTask)
//   }

//   const handlePress = (id: string) => {
//     /*router.push({pathname: '/components/cards/placeCard',params: { placeID: item.id, otherParam: 'anything you want here' }})*/
//     router.push((`/${id}`))
//   }

//   const changeDate = (date:string) =>{
//     setDate(date)
//     dayTasks = getDayTasks(task, date)//getFormatedDay(new Date(date))
      
//   }

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#031F2B', paddingTop: 5, flexDirection: 'column', gap: 10 }}>
//       <Header title='Календарь' text='в месячном и недельном виде' />
//       <CalendarProvider
//         date= {today}
//         onDateChanged={(date, updateSource) => changeDate(date)}//
//         showTodayButton={today !== date ? true : false}
//         style={{ gap: dayTasks[0] ? 0 : 40 }}
//         theme={{
//           todayButtonTextColor: '#007aff',
//           todayButtonFontWeight: 'bold',
//         }}
//       >
//         <ExpandableCalendar
//           //showWeekNumbers
//           //onDayPress={(date)=> changeDate(date.dateString)}
//           renderHeader={renderHeader}
//           closeOnDayPress={false}
//           ref={calendarRef}
//           onCalendarToggled={onCalendarToggled}
//           markingType="multi-dot"
//           markedDates={multiDots}
//           firstDay={1}
//           theme={{
//             // arrows
//             arrowColor: 'black',
//             // selected date
//             selectedDayBackgroundColor: "#b1d6f9",
//             selectedDayTextColor: 'white',
//             // dot (marked date)
//             dotColor: '#007aff',
//           }}

//         />
//         <AgendaList
//          //markToday={false}
//           dayFormat='dddd d MMM'
//           sections={dayTasks}
//           ListEmptyComponent={
//             <ListEpmtyComponent
//               date={date}
//               title='У вас пока нет никаких заданий!'
//               text='Добавьте задачу, чтобы сделать ваш день продуктивным.'
//             />
//           }
//           sectionStyle={{ backgroundColor: '#031F2B', }}
//           renderItem={({ item }: any) => <AgendaItem
//             id={item.id}
//             date={item.date}
//             category={item.category}
//             status={item.status}
//             title={item.title}
//             priority={item.priority}
//             notes={item.notes}
//             sendNotify={item.sendNotify}
//             files={item.files}
//             onCompletePress={() => handleComplete(item.id)}
//             onItemPress={() => handlePress(item.id)}
//           />}
//         />
//       </CalendarProvider>
//       <Add date={date} />
//     </SafeAreaView>
//   );
// };

// export default calendar;

import Add from '@/components/buttons/Add';
import AgendaItem from '@/components/items/AgendaItem';
import ListEpmtyComponent from "@/components/items/ListEmptyComponent";
import Header from '@/components/TabHeader';
import { TaskContext } from '@/context/TaskContext';
import { completeTask } from '@/utils/taskUtils';
import { getCalendarTitle, getDayTasks, getFormatedDay, getMultiDotsDays } from '@/utils/utils';
import { router } from "expo-router";
import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text } from 'react-native';
import { AgendaList, CalendarProvider, ExpandableCalendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

// Изображения импортируем НАВЕРХУ
const CHEVRON_IMG = require('@/assets/images/next.png');  

LocaleConfig.locales['rus'] = {
  monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
  monthNamesShort: ['Янв.', 'Фев.', 'Мар.', 'Апр.', 'Май', 'Июнь', 'Июль', 'Авг.', 'Сен.', 'Окт.', 'Ноя.', 'Дек.'],
  dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  dayNamesShort: ['Вос.', 'Пон.', 'Вт.', 'Ср.', 'Чет.', 'Пят.', 'Суб.'],
  today: "Сегодня"
};
LocaleConfig.defaultLocale = 'rus';

// Статичные конфигурации тем выносим за пределы компонента
const PROVIDER_THEME = {
  todayButtonTextColor: '#007aff',
  todayButtonFontWeight: 'bold' as const,
};

const CALENDAR_THEME = {
  arrowColor: 'black',
  selectedDayBackgroundColor: "#b1d6f9",
  selectedDayTextColor: 'white',
  dotColor: '#007aff',
};

const CalendarScreen = () => {
  const { task, setTask } = useContext(TaskContext);
  const today = useMemo(() => getFormatedDay(new Date()), []);
  const [date, setDate] = useState(today);
  
  // Мемоизируем тяжелые вычисления, чтобы они не перезапускались при анимации
  const dayTasks = useMemo(() => getDayTasks(task, date), [task, date]);
  const multiDots = useMemo(() => getMultiDotsDays(task), [task]);
  
  const calendarRef = useRef<{toggleCalendarPosition: () => boolean}>(null);
  const rotation = useRef(new Animated.Value(0));

  const toggleCalendarExpansion = useCallback(() => {
    const isOpen = calendarRef.current?.toggleCalendarPosition();
    Animated.timing(rotation.current, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease)
    }).start();
  }, []);

  const renderHeader = useCallback(
    (renderDate: any) => {
      // Исполняем getCalendarTitle только при изменении даты в шапке
      const title = getCalendarTitle(new Date(renderDate));
      const rotationInDegrees = rotation.current.interpolate({ 
        inputRange:[0, 1], 
        outputRange: ['0deg', '-180deg'] 
      });

      return (
        <Pressable style={styles.headerPressable} onPress={toggleCalendarExpansion}>
          <Text style={styles.headerText}>{title}</Text>
          <Animated.Image 
            source={CHEVRON_IMG} 
            style={[styles.chevron, { transform: [{ rotate: '90deg' }, { rotate: rotationInDegrees }] }]}
          />
        </Pressable>
      );
    },
    [toggleCalendarExpansion]
  );

  const onCalendarToggled = useCallback((isOpen: boolean) => {
    rotation.current.setValue(isOpen ? 1 : 0);
  }, []);
    
  const handleComplete = useCallback((id: string) => {
    completeTask(id, task, setTask);
  }, [task, setTask]);

  const handlePress = useCallback((id: string) => {
    router.push(`/${id}`);
  }, []);

  const changeDate = useCallback((newDate: string) => {
    setDate(newDate);
  }, []);

  // Мемоизируем renderItem для AgendaList
  const renderAgendaItem = useCallback(({ item }: { item: any }) => (
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

  const listEmptyComponent = useMemo(() => (
    <ListEpmtyComponent
      date={date}
      title='У вас пока нет никаких заданий!'
      text='Добавьте задачу, чтобы сделать ваш день продуктивным.'
    />
  ), [date]);

  const providerStyle = useMemo(() => ({ 
    gap: dayTasks[0] ? 0 : 40 
  }), [dayTasks]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title='Календарь' text='в месячном и недельном виде' />
      <CalendarProvider
        date={today}
        onDateChanged={changeDate}
        showTodayButton={today !== date}
        style={providerStyle}
        theme={PROVIDER_THEME}
      >
        <ExpandableCalendar
          renderHeader={renderHeader}
          closeOnDayPress={false}
          ref={calendarRef}
          onCalendarToggled={onCalendarToggled}
          markingType="multi-dot"
          markedDates={multiDots}
          firstDay={1}
          theme={CALENDAR_THEME}
        />
        <AgendaList
          dayFormat='dddd d MMM'
          sections={dayTasks}
          ListEmptyComponent={listEmptyComponent}
          sectionStyle={styles.sectionStyle}
          renderItem={renderAgendaItem}
        />
      </CalendarProvider>
      <Add date={date} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#031F2B',
    paddingTop: 5,
    flexDirection: 'column',
    gap: 10,
  },
  headerPressable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    gap: 5,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 6,
  },
  chevron: {
    // Если у картинки должны быть фиксированные размеры, укажите их тут, например:
    // width: 24,
    // height: 24,
  },
  sectionStyle: {
    backgroundColor: '#031F2B',
  },
});

export default CalendarScreen;