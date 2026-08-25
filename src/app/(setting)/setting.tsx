import CategoryBottomSheet from '@/components/bottomSheet/CategoryBottomSheet';
import PriorityBottomSheet from '@/components/bottomSheet/PriorityBottomSheet';
import NavigationButton from '@/components/buttons/NavigationButton';
import CardRow from '@/components/CardRow';
import CardRowSwitch from '@/components/CardRowSwitch';
import { SettingContext } from '@/context/SettingContext';
import CategoryData from '@/data/CategoryData';
import PriorityData from '@/data/PriorityData';
import { setData } from '@/store/setData';
import { notifyMessage } from '@/utils/utils';
import BottomSheet, { BottomSheetMethods } from '@expo/ui/community/bottom-sheet';
import DateTimePicker, { DateTimePickerChangeEvent } from '@expo/ui/community/datetime-picker';
import { router } from 'expo-router';
import { RefObject, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ОПТИМИЗАЦИЯ: Выносим чтение package.json за пределы компонента
const pkg = require('@/../package.json');
const APP_VERSION = pkg.version || '1.0.0';

const SettingsScreen = () => {
  const { 
    defaultCategory, setDefaultCategory, 
    defaultPriority, setDefaultPriority, 
    defaultTime, setDefaultTime, 
    defaultNotify, setDefaultNotify 
  } = useContext(SettingContext);

  const [time, setTime] = useState(() => {
    // Безопасная инициализация объекта даты текущим или дефолтным временем
    const d = new Date();
    if (defaultTime) {
      const [hours, minutes] = defaultTime.split(':');
      d.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    }
    return d;
  });
  
  const [show, setShow] = useState(false);
  const sheetPriorityRef = useRef<BottomSheet>(null);
  const sheetCategoryRef = useRef<BottomSheet>(null);

  // ОПТИМИЗАЦИЯ: Мемоизируем методы для безопасного открытия BottomSheets
  // const handleSnapBottomSheet = useCallback((ref: RefObject<BottomSheetMethods | null>, index: number) => {
  //   ref.current?.snapToIndex(index);
  // }, []);
  // // ОПТИМИЗАЦИЯ: Мемоизируем методы для безопасного открытия BottomSheets
  // const handleSnapBottomSheet = useCallback((ref: RefObject<BottomSheetMethods | null>, index: number) => {
  //   ref.current?.snapToIndex(index);
  // }, []);
  const setSheetRef = useCallback((ref: RefObject<BottomSheetMethods | null>, index: number) => {
    ref.current?.snapToIndex(index);
  }, []);

  const changeDefaultCategory = useCallback((id: string) => {
    setDefaultCategory(id);
    setData('defaultCategory', JSON.stringify(id));
  }, [setDefaultCategory]);

  const changeDefaultPriority = useCallback((id: string) => {
    setDefaultPriority(id);
    setData('defaultPriority', JSON.stringify(id));
  }, [setDefaultPriority]);

  const changeDefaultNotify = useCallback(() => {
    const newValue = !defaultNotify;
    setDefaultNotify(newValue);      
    setData('defaultNotify', JSON.stringify(newValue)); 
  }, [defaultNotify, setDefaultNotify]);

  // БЕЗОПАСНОСТЬ: Добавлена проверка на валидность даты и типа события
  const handleTimeChange = useCallback((event: DateTimePickerChangeEvent, selectedDate?: Date) => {
    if (!selectedDate) {
      setShow(false);
      return;
    }

    const timeString = selectedDate.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    setDefaultTime(timeString);
    setData('defaultTime', JSON.stringify(timeString));
    setTime(selectedDate);
    setShow(false);
  }, [setDefaultTime]);

  const handleDismissTime = useCallback(() => {
    setShow(false);
  }, []);

  // БЕЗОПАСНОСТЬ: Защита данных от undefined с помощью оператора ?.
  const priorityName = useMemo(() => PriorityData[defaultPriority]?.name?.ru || 'Не указан', [defaultPriority]);
  const priorityIcon = useMemo(() => PriorityData[defaultPriority]?.icon || 'flag', [defaultPriority]);
  const priorityColor = useMemo(() => PriorityData[defaultPriority]?.color || 'white', [defaultPriority]);

  const categoryName = useMemo(() => CategoryData[defaultCategory]?.name?.ru || 'Не указана', [defaultCategory]);
  const categoryIcon = useMemo(() => CategoryData[defaultCategory]?.icon || 'folder', [defaultCategory]);
  //const categoryBackColor = useMemo(() => CategoryData[defaultCategory]?.backColor || '#263238', [defaultCategory]);
  const categoryColor = useMemo(() => CategoryData[defaultCategory]?.color || 'white', [defaultCategory]);

  const handleGoBack = useCallback(() => router.back(), []);

  return (
    <SafeAreaView style={styles.container}>


      {/* Шапка настроек */}
      <View style={styles.header}>
        <NavigationButton onPress={handleGoBack} icon={'arrow-left'} size={38} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.titleText}>Настройки</Text>
          <Text style={styles.subtitleText}>приложения и аккаунта</Text>
        </View>
      </View>    

      {/* Основной контейнер контента */}
      <View style={styles.contentContainer}>
        <View style={styles.sectionsWrapper}>
          
          {/* Блок: Системные */}
          <Text style={styles.sectionTitle}>Системные</Text>
          <View style={styles.rowsContainer}>
            <CardRow
              title='Язык'
              text='Русский'
              icon='web'
              iconColor='white'
              onPress={()=>notifyMessage('Новые языки появятся в будущих обновлениях')}
            />
            <CardRow
              title='Стиль'
              text='Классический'
              icon='weather-night'
              iconColor='white'
              onPress={()=>notifyMessage('Новые стили появятся в будущих обновлениях')}
            />
          </View>

          {/* Блок: Значения по умолчанию */}
          <Text style={styles.sectionTitle}>Значения по умолчанию</Text>
          <View style={styles.rowsContainer}>
            <CardRow
              title='Время'
              text={defaultTime}
              icon='clock'
              iconColor='white'
              onPress={() => setShow(true)}
            />
            <CardRowSwitch
              title='Создание уведомлений'
              text={defaultNotify ? 'Включено' : 'Выключено'}
              icon={defaultNotify ? 'bell-ring' : 'bell-off'}
              value={defaultNotify}
              iconColor='white'
              
              onPress={changeDefaultNotify}
            />            
            <CardRow
              title='Приоритет'
              text={priorityName}
              icon={priorityIcon}
              iconColor={priorityColor}
              onPress={() => setSheetRef(sheetPriorityRef, 0)}
            />
            <CardRow
              title='Категория'
              text={categoryName}
              icon={categoryIcon}
              iconColor={categoryColor}
              onPress={() => router.push('/DataBottomSheet')}
            />         
          </View>

          {/* Версия приложения */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Хелдон {APP_VERSION}</Text>
          </View>
        </View>
      {/* Модальные окна BottomSheet */}
      {show && (
        <DateTimePicker
          mode='time'
          locale='ru_RU'
          presentation="dialog"
          value={time}
          onValueChange={handleTimeChange}
          onDismiss={handleDismissTime}
        />
      )}    
         
      </View>
      <CategoryBottomSheet
        currentId={defaultCategory}
        setValue={changeDefaultCategory}
        setRef={setSheetRef}
        sheetRef={sheetCategoryRef}
      />          
      <PriorityBottomSheet
        currentId={defaultPriority}
        setValue={changeDefaultPriority}
        setRef={setSheetRef}
        sheetRef={sheetPriorityRef}
      />
              
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#031F2B',
    paddingTop: 5,
    flexDirection: 'column',
    gap: 25,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    gap: 10,
  },
  headerTextContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  titleText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitleText: {
    color: '#7a92a5',
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
  },
  sectionsWrapper: {
    flexDirection: 'column',
    gap: 10,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    color: '#7a92a5',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    marginTop: 5,
  },
  // cardGroup: {
  //   backgroundColor: '#263238',
  //   padding: 10,
  //   borderRadius: 15,
  //   gap: 10,
  // },
  rowsContainer: { 
    gap: 15, 
    backgroundColor: '#052d3e', 
    borderRadius: 10, 
    padding: 15, 
    marginBottom: 15, 
  },   
  versionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  versionText: {
    color: '#7a92a5',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
});