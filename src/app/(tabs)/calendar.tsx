import Add from '@/components/buttons/Add';
import AgendaItem from '@/components/items/AgendaItem';
import ListEpmtyComponent from "@/components/items/ListEmptyComponent";
import Header from '@/components/TabHeader';
import { TaskContext } from '@/context/TaskContext';
import { completeTask } from '@/utils/taskUtils';
import { getCalendarTitle, getDayTasks, getFormatedDay, getMultiDotsDays } from '@/utils/utils';
import { router } from "expo-router";
import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { AgendaList, CalendarProvider, DateData, ExpandableCalendar, LocaleConfig } from 'react-native-calendars';
import { DayState } from 'react-native-calendars/src/types';
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
  'stylesheet.calendar.header': {
    dayTextAtIndex5: {
      color: '#4ca0fa'
    },
    dayTextAtIndex6: {
      color: '#4ca0fa'
    },
  },
  arrowColor: 'black',
  // selectedDayBackgroundColor: "#b1d6f9",
  // selectedDayTextColor: 'white',
  // dotColor: '#007aff',
};

const CalendarScreen = () => {
  const { task, setTask } = useContext(TaskContext);
  const today = useMemo(() => getFormatedDay(new Date()), []);
  const [selDate, setDate] = useState(today);
  
  // Мемоизируем тяжелые вычисления, чтобы они не перезапускались при анимации
  const dayTasks = useMemo(() => getDayTasks(task, selDate), [task, selDate]);
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

  const renderDay = useCallback(
    ( currDate: (string & DateData) | undefined, state: DayState | undefined, selDate:string) => {
      let dayData = multiDots[currDate?.dateString as any];
      if(selDate === currDate?.dateString)
        console.log(currDate?.dateString,today, selDate )

      return (
        <Pressable style={{ gap: 2 }} onPress={() => setDate(currDate?.dateString ? currDate.dateString : today)}>
          <Text style={{
            textAlign: 'center',
            fontSize: 14,
            color: currDate?.dateString === today ? '#007aff' : 'grey',
            backgroundColor: currDate?.dateString === selDate ? '#c0defa' : 'white',
            padding:3,
            borderRadius: 25
          }}>
            {currDate?.day}
          </Text>
          {dayData && <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, height: 14 }}>
            {dayData.dots[0] && <View style={{ height: 6, width: 6, backgroundColor: dayData.dots[0]?.color, borderRadius: 25 }} />}
            {dayData.dots[1] && <View style={{ height: 6, width: 6, backgroundColor: dayData.dots[1]?.color, borderRadius: 25 }} />}
            {dayData.dots.length > 2 && <Text style={{
              textAlign: 'center',
              fontSize: 10,
              color: 'gray',
            }}>
              +{multiDots[currDate?.dateString as any]?.dots.length - 2}
            </Text>}
          </View>}
        </Pressable>
      );
    },
    [selDate]
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
      date={selDate}
      title='У вас пока нет никаких заданий!'
      text='Добавьте задачу, чтобы сделать ваш день продуктивным.'
    />
  ), [selDate]);

  const providerStyle = useMemo(() => ({ 
    gap: dayTasks[0] ? 0 : 40 
  }), [dayTasks]);
  console.log('render calendar')
  return (
    <SafeAreaView style={styles.container}>
      <Header title='Календарь' text='в месячном и недельном виде' />
      <Text style={{color:'white'}}>{today} !== {selDate}  {(today !== selDate)? "true": "false"}</Text>
      <CalendarProvider
        date={selDate}//today
        onDateChanged={changeDate}
        showTodayButton={today !== selDate}
        style={providerStyle}
        theme={PROVIDER_THEME}
      >
        <ExpandableCalendar
          renderHeader={renderHeader}
          closeOnDayPress={false}
          ref={calendarRef}
          onCalendarToggled={onCalendarToggled}
          //date={date}
          // markingType="custom"
          // markedDates={multiDots}
          firstDay={1}
          theme={CALENDAR_THEME}
          dayComponent={({ date, state }) =>renderDay(date, state, selDate)}           
        />
        <AgendaList
          dayFormat='dddd d MMM'
          markToday={false}
          sections={dayTasks}
          ListEmptyComponent={listEmptyComponent}
          sectionStyle={styles.sectionStyle}
          renderItem={renderAgendaItem}
        />
      </CalendarProvider>
      <Add date={selDate} />
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