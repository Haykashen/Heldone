import SelectionBottomSheet from '@/components/bottomSheet/SelectionBottomSheet';
import NavigationButton from '@/components/buttons/NavigationButton';
import CardRow from '@/components/rows/CardRow';
import CardRowSwitch from '@/components/rows/CardRowSwitch';
import { SettingContext } from '@/context/SettingContext';
import { useAppColors } from '@/context/ThemeContext'; // Импортируем хук цветов
import CategoryData from '@/data/CategoryData';
import PriorityData, { PRIORITIES_ARRAY } from '@/data/PriorityData';
import { setData } from '@/store/setData';
import { notifyMessage } from '@/utils/utils';
import BottomSheet, { BottomSheetMethods } from '@expo/ui/community/bottom-sheet';
import DateTimePicker, { DateTimePickerChangeEvent } from '@expo/ui/community/datetime-picker';
import { router } from 'expo-router';
import { RefObject, use, useCallback, useRef, useState } from 'react'; // React 19: Импортируем 'use'
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const pkg = require('@/../package.json');
const APP_VERSION = pkg.version || '1.0.0';

const SettingsScreen = () => {
  // React 19: Получаем данные контекста настроек через 'use'
  const { 
    defaultCategory, setDefaultCategory, 
    defaultPriority, setDefaultPriority, 
    defaultTime, setDefaultTime, 
    defaultNotify, setDefaultNotify 
  } = use(SettingContext);

  // Получаем глобальные цвета для темной/светлой темы
  const colors = useAppColors();

  const [time, setTime] = useState(() => {
    const d = new Date();
    if (defaultTime) {
      const [hours, minutes] = defaultTime.split(':');
      d.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    }
    return d;
  });
  
  const [show, setShow] = useState(false);
  const prioritySheetRef = useRef<BottomSheet>(null);

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

  // React Compiler автоматически оптимизирует эти строки и иконки под капотом
  const priorityName = PriorityData[defaultPriority]?.name?.ru || 'Не указан';
  const priorityIcon = PriorityData[defaultPriority]?.icon || 'flag';
  const priorityColor = PriorityData[defaultPriority]?.color || colors.titleText;

  const categoryName = CategoryData[defaultCategory]?.name?.ru || 'Не указана';
  const categoryIcon = CategoryData[defaultCategory]?.icon || 'folder';
  const categoryColor = CategoryData[defaultCategory]?.color || colors.titleText;

  const handleGoBack = useCallback(() => router.back(), []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.containerBg }]}>
      {/* Шапка настроек */}
      <View style={styles.header}>
        <NavigationButton onPress={handleGoBack} icon={'arrow-left'} size={38} />
        <View style={styles.headerTextContainer}>
          <Text style={[styles.titleText, { color: colors.titleText }]}>Настройки</Text>
          <Text style={[styles.subtitleText, { color: colors.subtitleText }]}>приложения и аккаунта</Text>
        </View>
      </View>    

      {/* Основной контейнер контента */}
      <ScrollView style={styles.contentContainer}>
        <View style={styles.sectionsWrapper}>
          
          {/* Блок: Системные */}
          <Text style={[styles.sectionTitle, { color: colors.sectionTitle }]}>Системные</Text>
          <View style={[styles.rowsContainer, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
            <CardRow
              title='Язык'
              text='Русский'
              icon='web'
              iconColor={colors.titleText}
              onPress={() => notifyMessage('Новые языки появятся в будущих обновлениях')}
            />
            <CardRow
              title='Стиль'
              text={colors.shadowOpacity > 0.2 ? 'Темный' : 'Светлый'} // Динамический текст стиля на основе палитры
              icon='weather-night'
              iconColor={colors.titleText}
              onPress={() => notifyMessage('Переключение темы происходит автоматически на основе настроек системы')}
            />
          </View>

          {/* Блок: Значения по умолчанию */}
          <Text style={[styles.sectionTitle, { color: colors.sectionTitle }]}>Значения по умолчанию</Text>
          <View style={[styles.rowsContainer, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
            <CardRow
              title='Время'
              text={defaultTime}
              icon='clock'
              iconColor={colors.titleText}
              onPress={() => setShow(true)}
            />
            <CardRowSwitch
              title='Создание уведомлений'
              text={defaultNotify ? 'Включено' : 'Выключено'}
              icon={defaultNotify ? 'bell-ring' : 'bell-off'}
              value={defaultNotify}
              iconColor={colors.titleText}
              onPress={changeDefaultNotify}
            />            
            <CardRow
              title='Приоритет'
              text={priorityName}
              icon={priorityIcon}
              iconColor={priorityColor}
              onPress={() => setSheetRef(prioritySheetRef, 0)}
            />
            <CardRow
              title='Категория'
              text={categoryName}
              icon={categoryIcon}
              iconColor={categoryColor}
              onPress={() => router.push('/DataBottomSheet')}
            />         
          </View>
          <Text style={[styles.sectionTitle, { color: colors.sectionTitle }]}>О приложении</Text>
          <View style={[styles.rowsContainer, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
            <CardRow
              title='Поддержите развитие приложения'
              text={'Оценить приложение'}
              icon='star'
              iconColor={"gold"}
              onPress={() => null}
            />
            <CardRow
              title='Возможность предложить идею, оставить отзыв или сообщить об ошибке'
              text={'Присоединиться к сообществу'}
              icon={'chat-plus'}
              iconColor={colors.titleText}
              onPress={() => null}
            />            
            <CardRow
              title='В формате pdf'
              text={'Политика конфиденциальности'}
              icon={'file-document'}
              iconColor={colors.titleText}
              onPress={() => null}
            />         
          </View>
          {/* Версия приложения */}
          <View style={styles.versionContainer}>
            <Text style={[styles.versionText, { color: colors.metaText }]}>Хелдон {APP_VERSION}</Text>
          </View>
        </View>

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
      </ScrollView>
      <SelectionBottomSheet
        sheetRef={prioritySheetRef}
        currentId={defaultPriority}
        setValue={changeDefaultPriority}
        setRef={setSheetRef}
        data={PRIORITIES_ARRAY}
      />              
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitleText: {
    fontSize: 14,
    marginTop: 2,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  sectionsWrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  rowsContainer: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden', // Чтобы углы дочерних CardRow не вылезали за радиус скругления
    marginBottom: 24,
  },
  versionContainer: {
    marginTop: 'auto', // Авто-выталкивание блока версии в самый низ экрана
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  versionText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
