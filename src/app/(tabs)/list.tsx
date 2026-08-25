import Add from '@/components/buttons/Add';
import StatusFilter from '@/components/buttons/StatusFilter';
import AgendaItem from '@/components/items/AgendaItem';
import ListEpmtyComponent from "@/components/items/ListEmptyComponent";
import Header from '@/components/TabHeader';
import { TaskContext } from '@/context/TaskContext';
import { StatusData } from '@/data/StatusData';
import { completeTask } from '@/utils/taskUtils';
import { getFormatedDay, getTaskByDays } from '@/utils/utils';
import { RelativePathString, router } from "expo-router";
import { useCallback, useContext, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AgendaList, CalendarProvider, LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

LocaleConfig.locales['rus'] = {
  monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  monthNamesShort: ['Янв.', 'Фев.', 'Мар.', 'Апр.', 'Май', 'Июнь', 'Июль', 'Авг.', 'Сен.', 'Окт.', 'Ноя.', 'Дек.'],
  dayNames: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
  dayNamesShort: ['Пон.', 'Вт.', 'Ср.', 'Чет.', 'Пят.', 'Суб.', 'Вос.'],
  today: "Сегодня"
};
LocaleConfig.defaultLocale = 'rus';

const PROVIDER_THEME = {
  todayButtonTextColor: '#007aff',
  todayButtonFontWeight: 'bold' as const
};

const TaskListScreen = () => {
  const { task, setTask } = useContext(TaskContext);
  const [status, setStatus] = useState(StatusData.Upcoming.id);
  
  const today = useMemo(() => new Date(), []);
  const todayFormatted = useMemo(() => getFormatedDay(today), [today]);

  // МЕМОИЗАЦИЯ: Рассчитываем отсортированные задачи правильно и эффективно. 
  // Эффект useEffect удален за ненадобностью.
  const sortTask = useMemo(() => getTaskByDays(task, status), [task, status]);

  // Вычисляем пропсы для провайдера календаря на основе мемоизированных данных
  const providerDate = useMemo(() => sortTask[0]?.title || todayFormatted, [sortTask, todayFormatted]);
  const hasTasks = useMemo(() => !!sortTask[0], [sortTask]);
  const providerStyle = useMemo(() => ({ gap: hasTasks ? 0 : 40 }), [hasTasks]);

  // Оптимизированные коллбэки навигации и действий
  const handlePress = useCallback((id: string) => {
    router.push(('/' + id) as RelativePathString);
  }, []);

  const handleComplete = useCallback((id: string) => {
    completeTask(id, task, setTask);
  }, [task, setTask]);

  // Мемоизированный рендер элементов списка для AgendaList
  const renderAgendaItem = useCallback(({ item }: { item: any }) => (
    <AgendaItem
      id={item.id}
      date={item.date}
      category={item.category}
      status={item.status}
      title={item.title}
      notes={item.notes}
      files={item.files}
      priority={item.priority}
      sendNotify={item.sendNotify}
      onCompletePress={() => handleComplete(item.id)}
      onItemPress={() => handlePress(item.id)}
    />
  ), [handleComplete, handlePress]);

  // Мемоизированный компонент пустого списка, чтобы не пересоздавать объекты строк
  const listEmptyComponent = useMemo(() => {
    const isCompletedTab = status === StatusData.Completed.id;
    return (
      <ListEpmtyComponent
        date={todayFormatted}
        title={isCompletedTab ? 'У вас пока нет выполненных заданий!' : 'У вас пока нет заданий!'}
        text={isCompletedTab ? 'Выполняйте задачи, чтобы ваши дни были продуктивными.' : 'Добавьте задачу, чтобы быть продуктивным.'}
      />
    );
  }, [status, todayFormatted]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title='Мои задачи' text='по дням и статусам' />
      
      <CalendarProvider
        date={providerDate}
        showTodayButton={hasTasks}
        theme={PROVIDER_THEME}
        style={providerStyle}
      >
        <View style={styles.filterContainer}>
          <StatusFilter
            status={StatusData.Upcoming.id}
            currStatus={status}
            title={'Предстоит'}
            changeStatus={setStatus} // Передаем напрямую функцию изменения стейта
          />
          <StatusFilter
            status={StatusData.Completed.id}
            currStatus={status}
            title={'Выполнено'} // Исправлена опечатка "Выполненно"
            changeStatus={setStatus}
          />
          <StatusFilter
            status={''}
            currStatus={status}
            title={'Все'}
            changeStatus={setStatus}
          />
        </View>

        <AgendaList
          dayFormat='dddd, d MMM yyyy'
          sections={sortTask}
          sectionStyle={styles.sectionStyle}
          ListEmptyComponent={listEmptyComponent}
          renderItem={renderAgendaItem}
        />
      </CalendarProvider>
      
      <Add date={todayFormatted} />
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
  filterContainer: {
    padding: 5,
    gap: 7,
    flexDirection: 'row',
    marginHorizontal: 5,
    marginTop: 15,
    borderRadius: 10,
  },
  sectionStyle: {
    backgroundColor: '#031F2B',
  },
});

export default TaskListScreen;
