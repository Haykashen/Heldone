import Add from '@/components/buttons/Add';
import AgendaItem from '@/components/items/AgendaItem';
import ListEpmtyComponent from "@/components/items/ListEpmtyComponent";
import Header from '@/components/TabHeader';
import { Context } from '@/context/context';
import { completeTask } from '@/utils/taskManage';
import { getCalendarTitle, getDayTasks, getFormatedDay, getMultiDotsDays } from '@/utils/utils';
import { RelativePathString, router } from "expo-router";
import { useCallback, useContext, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text } from 'react-native';
import { AgendaList, CalendarProvider, ExpandableCalendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

LocaleConfig.locales['rus'] = {
  monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
  monthNamesShort: ['Янв.', 'Фев.', 'Мар.', 'Апр.', 'Май', 'Июнь', 'Июль', 'Авг.', 'Сен.', 'Окт.', 'Ноя.', 'Дек.'],
  dayNames: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
  dayNamesShort: ['Пон.', 'Вт.', 'Ср.', 'Чет.', 'Пят.', 'Суб.', 'Вос.'],
  today: "Сегодня"
};

LocaleConfig.defaultLocale = 'rus';

// interface Props {
//   weekView?: boolean;
// }props: Props

const calendar = () => {
  const { task, setTask } = useContext(Context);
  const CHEVRON = require('@/assets/images/next.png');  
  //const {weekView} = props;///????
  const [date, setDate] = useState(getFormatedDay(new Date()))
  let dayTasks = getDayTasks(task, date)
  const multiDots = getMultiDotsDays(task)
  
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
      const title = getCalendarTitle(new Date(date))
      const rotationInDegrees = rotation.current.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-180deg'] });

      return (
        <Pressable style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10, gap:5}} onPress={toggleCalendarExpansion}>
          <Text style={{fontSize: 16, fontWeight: 'bold', marginRight: 6}}>{title}</Text>
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
    [rotation]);
    
  const handleComplete = (id: string) => {
    completeTask(id, task, setTask)
  }

  const handlePress = (id: string) => {
    /*router.push({pathname: '/components/cards/placeCard',params: { placeID: item.id, otherParam: 'anything you want here' }})*/
    router.push(('/' + id) as RelativePathString)
  }

  const changeDate = (date:string) =>{
    setDate(date)
    dayTasks = getDayTasks(task, date)//getFormatedDay(new Date(date))
      
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#031F2B', paddingTop: 5, flexDirection: 'column', gap: 10 }}>
      <Header title='Календарь' text='в месячном и недельном виде'/> 
      <CalendarProvider
        date={date}
        onDateChanged={(date, updateSource) => changeDate(date)}//
        showTodayButton       
        style={{ gap: dayTasks[0] ? 0 : 40}}
        theme={{
          todayButtonTextColor: '#007aff',
          todayButtonFontWeight:'bold'
        }}
        
      // disabledOpacity={0.6}  
      // todayBottomMargin={16}
      // disableAutoDaySelection={[ExpandableCalendar.navigationTypes.MONTH_SCROLL, ExpandableCalendar.navigationTypes.MONTH_ARROWS]}
      >
        {/* {weekView ? (
          <WeekCalendar 
            //firstDay={0} 
            //markedDates={multiDots} 
          />
        ) : ( )}*/}
          <ExpandableCalendar
            //showWeekNumbers
            renderHeader={renderHeader}
            ref={calendarRef}
            onCalendarToggled={onCalendarToggled}
            markingType="multi-dot"
            markedDates={multiDots}
            firstDay={0}
            //onDayPress={(date)=> {console.log( 'onDayPress', date.dateString); changeDate(date.dateString)}}
            //closeOnDayPress
            // horizontal={false}
            // hideArrows
            // disablePan
            // hideKnob
            // initialPosition={ExpandableCalendar.positions.OPEN}
            // calendarStyle={styles.calendar}
            // headerStyle={styles.header} // for horizontal only
            // disableWeekScroll
            // disableAllTouchEventsForDisabledDays                        
          //   leftArrowImageSource={leftArrowIcon}
          //   rightArrowImageSource={rightArrowIcon}
          // animateScroll
          // closeOnDayPress={false}
            //theme={theme.current}
            theme={{
              // arrows
              arrowColor: 'black',
              // selected date
              selectedDayBackgroundColor: "#b1d6f9",
              selectedDayTextColor: 'white',
              // dot (marked date)
              dotColor: '#007aff',
            }}

          />
        
        
        <AgendaList
          sections={dayTasks}
          ListEmptyComponent={<ListEpmtyComponent />}
          sectionStyle={{ backgroundColor: '#031F2B', }}
          renderItem={({ item }: any) => <AgendaItem
            id={item.id}
            date={item.date}
            category={item.category}
            status={item.status}
            title={item.title}
            priority={item.priority}
            notes={item.notes}
            onCompletePress={()=>handleComplete(item.id)}
            onItemPress={()=>handlePress(item.id)}
            onDeletePress={()=>null}
          /> }
        />
      </CalendarProvider>
      <Add date={date} />
    </SafeAreaView>
  );
};

export default calendar;

const style = (Theme:any)=> StyleSheet.create({

});