import Add from '@/components/buttons/Add';
import CustomDay from '@/components/calendar/CustomDay';
import AgendaItem from '@/components/items/AgendaItem';
import ListEmptyComponent from "@/components/items/ListEmptyComponent";
import Header from '@/components/TabHeader';
import { TaskContext } from '@/context/TaskContext';
import { completeTask } from '@/utils/taskUtils';
import { getCalendarTitle, getDayTasks, getFormatedDay, getMultiDotsDays } from '@/utils/utils';
import { router } from "expo-router";
import { use, useCallback, useMemo, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text } from 'react-native';
import { AgendaList, CalendarProvider, DateData, ExpandableCalendar, LocaleConfig } from 'react-native-calendars';
import { DayState } from 'react-native-calendars/src/types';
import { SafeAreaView } from 'react-native-safe-area-context';

const CHEVRON_IMG_TOP = require('@/assets/images/arrow_up.png'); // Укажи свой путь к верхнему шеврону
const CHEVRON_IMG_BOTTOM = require('@/assets/images/arrow_down.png'); // Укажи свой путь к нижнему шеврону

LocaleConfig.locales['rus'] = {
  monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
  monthNamesShort: ['Янв.', 'Фев.', 'Мар.', 'Апр.', 'Май', 'Июнь', 'Июль', 'Авг.', 'Сен.', 'Окт.', 'Ноя.', 'Дек.'],
  dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  dayNamesShort: ['Вос.', 'Пон.', 'Вт.', 'Ср.', 'Чет.', 'Пят.', 'Суб.'],
  today: "Сегодня"
};
LocaleConfig.defaultLocale = 'rus';

const PROVIDER_THEME = {
  todayButtonTextColor: '#007aff',
  todayButtonFontWeight: 'bold' as const,
};

const CALENDAR_THEME = {
  'stylesheet.calendar.header': {
    dayTextAtIndex5: { color: '#4ca0fa' },
    dayTextAtIndex6: { color: '#4ca0fa' },
  },
  arrowColor: 'black',
};



// --- Основной экран ---
const CalendarScreen = () => {
  // React 19 API: замена useContext на use
  const { task, setTask } = use(TaskContext);

  const today = useMemo(() => getFormatedDay(new Date()), []);
  const [selDate, setDate] = useState(today);
  
  const dayTasks = useMemo(() => getDayTasks(task, selDate), [task, selDate]);
  const multiDots = useMemo(() => getMultiDotsDays(task), [task]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);  
  const calendarRef = useRef<{ toggleCalendarPosition: () => boolean }>(null);

  const toggleCalendarExpansion = useCallback(() => {
    calendarRef.current?.toggleCalendarPosition();
  }, []);

// 3. Колбэк, который срабатывает при открытии/закрытии календаря
  const handleCalendarToggled = useCallback((isOpen: boolean) => {
    setIsCalendarOpen(isOpen);
  }, []);

  const renderHeader = useCallback((renderDate: string | Date) => {
    const title = getCalendarTitle(new Date(renderDate));
    const chevronSource = isCalendarOpen ? CHEVRON_IMG_TOP : CHEVRON_IMG_BOTTOM;

    return (
      <Pressable style={styles.headerPressable} onPress={toggleCalendarExpansion}>
        <Text style={styles.headerText}>{title}</Text>
        <Image 
          source={chevronSource}
          style={styles.chevron}
        />
      </Pressable>
    );
  }, [toggleCalendarExpansion, isCalendarOpen]);

  const renderCustomDay = useCallback(({ date }: { date?: DateData; state?: DayState }) => {
    const dayData = date?.dateString ? multiDots[date.dateString] : undefined;
    return (
      <CustomDay 
        date={date}
        selDate={selDate}
        today={today}
        dayData={dayData}
        onSelect={setDate}
      />
    );
  }, [multiDots, selDate, today]);

  const handleComplete = useCallback((id: string) => {
    completeTask(id, task, setTask);
  }, [task, setTask]);

  const handlePress = useCallback((id: string) => {
    router.push(`/${id}`);
  }, []);

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
    <ListEmptyComponent
      date={selDate}
      title='У вас пока нет никаких заданий!'
      text='Добавьте задачу, чтобы сделать ваш день продуктивным.'
    />
  ), [selDate]);

  const providerStyle = useMemo(() => ({ 
    gap: dayTasks[0] ? 0 : 40 
  }), [dayTasks]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title='Календарь' text='в месячном и недельном виде' />
      <CalendarProvider
        date={selDate}
        onDateChanged={setDate}
        showTodayButton={today !== selDate}
        style={providerStyle}
        theme={PROVIDER_THEME}
      >
        <ExpandableCalendar
          renderHeader={renderHeader}
          closeOnDayPress={false}
          ref={calendarRef}
          firstDay={1}
          theme={CALENDAR_THEME}
          dayComponent={renderCustomDay}   
          onCalendarToggled={handleCalendarToggled}
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
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  sectionStyle: {
    backgroundColor: '#031F2B',
  },
  dayContainer: {
    gap: 2,
    alignItems: 'center',
  },
  dayText: {
    textAlign: 'center',
    fontSize: 14,
    color: 'grey',
    backgroundColor: 'white',
    padding: 3,
    borderRadius: 25,
    minWidth: 26,
  },
  todayText: {
    color: '#007aff',
  },
  selectedDayText: {
    backgroundColor: '#c0defa',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 14,
  },
  dot: {
    height: 6,
    width: 6,
    borderRadius: 3,
  },
  moreDotsText: {
    textAlign: 'center',
    fontSize: 10,
    color: 'gray',
  },
});

export default CalendarScreen;