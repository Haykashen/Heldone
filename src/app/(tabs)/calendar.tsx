
import AgendaItem from '@/components/items/AgendaItem';
import { Context } from '@/context/context';
import { setData } from '@/store/setData';
import { TTask } from "@/utils/types";
import { getFormatedDay, getMarkedDays, getNewTask, getTaskByDays } from '@/utils/utils';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { RelativePathString, router } from "expo-router";
import { useCallback, useContext, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { AgendaList, CalendarProvider, ExpandableCalendar, LocaleConfig, WeekCalendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

LocaleConfig.locales['rus'] = {
  monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
  monthNamesShort: ['Янв.', 'Фев.', 'Мар.', 'Апр.', 'Май', 'Июнь', 'Июль', 'Авг.', 'Сен.', 'Окт.', 'Ноя.', 'Дек.'],
  dayNames: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
  dayNamesShort: ['Пон.', 'Вт.', 'Ср.', 'Чет.', 'Пят.', 'Суб.', 'Вос.'],
  today: "Сегодня"
};

LocaleConfig.defaultLocale = 'rus';

interface Props {
  weekView?: boolean;
}

const code = { key: 'code', color: 'green' };

function getTaskByDay(task:[]){
  let res:{[key:string]:{dots:any}} = {}
  task.forEach((item:TTask)=> {
    let date = new Date(item.date)
    let dateArray = (date).toLocaleDateString().split('.');
    let strDate = dateArray[2]+'-'+dateArray[1]+'-'+dateArray[0];//(date).toLocaleDateString().split('.').join('-')
    if(!(res[strDate]))
      res[strDate] = {dots:[]};
    res[strDate].dots.push({...code, key: res[strDate].dots.length})  
  })
  return res;
}

const calendar = (props: Props) => {
  const { task, setTask } = useContext(Context);
  const {weekView} = props;
  const sortTask = getTaskByDays(task)
  const markedDays = getMarkedDays(task)
  const CHEVRON = require('@/assets/images/next.png');

  const taskMultiDots = getTaskByDay(task);
  
  
  const renderItem = useCallback(({item}: any) => {
    return <AgendaItem item={item}/>;
  }, []);

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
    (date: Date) => {

      const rotationInDegrees = rotation.current.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-180deg']
      });
      let title = new Date(date).toLocaleDateString("ru-RU", { year: "numeric", month: "long"}).split('')
      title[0] = title[0].toUpperCase()

      return (
        <Pressable style={{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  }} onPress={toggleCalendarExpansion}>
          <Text style={{fontSize: 16, fontWeight: 'bold', marginRight: 6}}>{title.join('')}</Text>
          <Animated.Image source={CHEVRON} style={{transform: [{rotate: '90deg'}, {rotate: rotationInDegrees}]}}/>
        </Pressable>
      );
    },
    [toggleCalendarExpansion]
  );

  const onCalendarToggled = useCallback(
    (isOpen: boolean) => {
      rotation.current.setValue(isOpen ? 1 : 0);
    },
    [rotation]
  );

  const handlePress = (id: string) => {
    /*router.push({pathname: '/components/cards/placeCard',params: { placeID: item.id, otherParam: 'anything you want here' }})*/
    router.push(('/' + id) as RelativePathString)
  }

  const handleAdd = () => {
    const newTask = getNewTask()
    task.push(newTask)
    const sortedArray = task.sort((first:TTask, second:TTask)=> {return (first.date.getTime() - second.date.getTime())})
    setTask(sortedArray)
    setData("todo", JSON.stringify(sortedArray))
    handlePress(newTask.id)
    //router.push(('/components/cards/' + newItem.id) as RelativePathString)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#031F2B', paddingTop: 5, flexDirection: 'column', gap: 10 }}>
      <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
        <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Календарь</Text>
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
        {weekView ? (
          <WeekCalendar firstDay={1} markedDates={markedDays} />
        ) : (
          <ExpandableCalendar
            showWeekNumbers
            renderHeader={renderHeader}
            ref={calendarRef}
            onCalendarToggled={onCalendarToggled}
            markingType="multi-dot"
            // horizontal={false}
            // hideArrows
            // disablePan
            // hideKnob
            // initialPosition={ExpandableCalendar.positions.OPEN}
            // calendarStyle={styles.calendar}
            // headerStyle={styles.header} // for horizontal only
            // disableWeekScroll

            //theme={theme.current}
            theme={{
              // arrows
              arrowColor: 'black',
              // selected date
              selectedDayBackgroundColor: '#63B4FF',
              selectedDayTextColor: 'white',
              // dot (marked date)
              dotColor: '#63B4FF',
            }}
            // disableAllTouchEventsForDisabledDays
            firstDay={1}
            //markedDates= {markedDays}
            markedDates={taskMultiDots}
          //   leftArrowImageSource={leftArrowIcon}
          //   rightArrowImageSource={rightArrowIcon}
          // animateScroll
          // closeOnDayPress={false}

          />
        )}
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
  );
};

export default calendar;

const style = (Theme:any)=> StyleSheet.create({

});