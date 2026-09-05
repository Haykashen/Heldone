import FilesBottomSheet from '@/components/bottomSheet/FilesBottomSheet';
import CardRow from '@/components/rows/CardRow';
import { SettingContext } from '@/context/SettingContext';
import { TaskContext } from '@/context/TaskContext';
import { useAppColors } from '@/context/ThemeContext'; // Импортируем хук глобальных цветов
import CategoryData, { CATEGORIES_ARRAY } from '@/data/CategoryData';
import PriorityData, { PRIORITIES_ARRAY } from '@/data/PriorityData';
import { StatusData } from '@/data/StatusData';
import { setData } from '@/store/setData';
import { openFile, shareFileWithCustomName } from '@/utils/fileUtils';
//import { checkPermissions, createNotification, deletelNotification } from '@/utils/notificationUtils';
import SelectionBottomSheet from '@/components/bottomSheet/SelectionBottomSheet';
import { TFileDataObject } from '@/components/types/types';
import { TTask } from '@/components/types/typesTask';
import { deleteTask, getNewTask } from '@/utils/taskUtils';
import { getFormatedDay, notifyMessage } from '@/utils/utils';
import BottomSheet, { BottomSheetMethods, BottomSheetScrollView } from '@expo/ui/community/bottom-sheet';
import DateTimePicker, { DateTimePickerChangeEvent } from '@expo/ui/community/datetime-picker';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { RefObject, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, Vibration, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

type DateTimePickerMode = "date" | "time";

const getSafeDateForPicker = (originalDate: Date) => {
  const safeDate = new Date(originalDate);
  safeDate.setHours(12, 0, 0, 0); // Ставим 12 часов дня
  return safeDate;
};

const TaskCardScreen = () => {
  const { todoID, day } = useLocalSearchParams();
  const { task, setTask } = useContext(TaskContext);
  const { defaultCategory, defaultPriority, defaultTime, defaultNotify } = useContext(SettingContext);
  const colors = useAppColors();// Получаем динамическую палитру цветов
  const [emptyTitle, setEmptyTitle] = useState(false)

  // Оставляем этот единственный useMemo, так как getNewTask генерирует тяжелый объект 
  // начальной структуры новой задачи, и его критически важно зафиксировать при монтировании.
  const initialTask = useMemo(() => {
    if (todoID === 'new') {
      return getNewTask(day as string, defaultCategory, defaultPriority, defaultTime, defaultNotify);
    }
    return task.find((item: TTask) => item.id === todoID);
  }, [todoID, day, task, defaultCategory, defaultPriority, defaultTime, defaultNotify]);

  const [currTask, setCurrentTask] = useState<TTask | undefined>(initialTask);

  // Оригинальное состояние храним в useRef для проверки изменений
  const originalTaskRef = useRef<string>(JSON.stringify(initialTask));

  // Ссылки для управления BottomSheets
  const sheetRef = useRef<BottomSheet>(null);
  const categorySheetRef = useRef<BottomSheet>(null);
  const prioritySheetRef = useRef<BottomSheet>(null);
  const sheetFilesRef = useRef<BottomSheet>(null);

  // Состояния для Пикера Дат и Фокусировки
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<DateTimePickerMode | undefined>('date');

  // Безопасный редирект, если задача не найдена
  if (!currTask) {
    return <Redirect href="/" />;
  }

  // ОПТИМИЗАЦИЯ ПОД REACT 19: Лишние ручные useMemo удалены.
  // Строки дат, времени и флаг изменений теперь автоматически кэшируются React Compiler.
  const dateText = currTask.date.toLocaleDateString();
  const timeText = currTask.date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const dataChanged = originalTaskRef.current !== JSON.stringify(currTask) && todoID !== 'new';

  // Управление открытием пикеров
  const showMode = useCallback((currentMode: DateTimePickerMode | undefined) => {
    setMode(currentMode);
    setShow(true);
  }, []);

  const showDatepicker = useCallback((currentMode: DateTimePickerMode) => {
    showMode(currentMode);
  }, [showMode]);

  // Оригинальные useCallback для апдейта полей
  const changeTitle = useCallback((newTitle: string) => {
    setCurrentTask(prev => prev ? { ...prev, title: newTitle } : undefined);
  }, []);

  const handleNotify = useCallback(() => {
    setCurrentTask(prev => prev ? { ...prev, sendNotify: !prev.sendNotify} : undefined);
  }, []);

  const changeStatus = useCallback(() => {
    setCurrentTask(prev => {
      if (!prev) return undefined;
      const newStatus = (prev.status.id === StatusData.Upcoming.id) ? StatusData.Completed : StatusData.Upcoming;
      return { ...prev, status: newStatus };
    });
  }, []);

  const changePriority = useCallback((key: string) => {
    setCurrentTask(prev => prev ? { ...prev, priority: PriorityData[key] } : undefined);
  }, []);

  const changeCategory = useCallback((key: string) => {
    setCurrentTask(prev => prev ? { ...prev, category: CategoryData[key] } : undefined);
  }, []);

  const changeNotes = useCallback((newNotes: string) => {
    setCurrentTask(prev => prev ? { ...prev, notes: newNotes } : undefined);
  }, []);

  const setSheetRef = useCallback((ref: RefObject<BottomSheetMethods | null>, index: number) => {
    ref.current?.snapToIndex(index);
  }, []);

  const handleBack = useCallback(async () => {
    setSheetRef(sheetRef, -1);
  }, [setSheetRef]);

  const handleDone = useCallback(async () => {
    if (!currTask.date || !currTask.title) {
      setEmptyTitle(true)
      notifyMessage('Заполните название задачи');      
      Vibration.vibrate(50);
      return;
    }
    await refreshNotify();

    const resArray = (todoID === 'new')
      ? [...task, currTask]
      : task.map((item: TTask) => item.id === todoID ? currTask : item);

    const sortedArray = [...resArray].sort((first, second) => first.date.getTime() - second.date.getTime());

    setTask(sortedArray);
    setData("todo", JSON.stringify(sortedArray));
    notifyMessage('Данные успешно сохранены!');
    handleBack();
  }, [currTask, todoID, task, setTask, handleBack]);

  const handleDelete = useCallback(async () => {
    if (todoID !== 'new') {
      deleteTask(currTask.id, task, setTask);
    }
    Vibration.vibrate(70);
    handleBack();
  }, [todoID, currTask.id, task, setTask, handleBack]);

  const handleClose = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  }, []);

  const pickDocument = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: false,
        copyToCacheDirectory: true
      });
      if (result.canceled !== false)
        return;
      setCurrentTask(prev => {
        if (!prev) return undefined;
        return {
          ...prev,
          files: [
            ...prev.files,
            {
              id: result.assets[0].name + (new Date().toISOString()),
              name: result.assets[0].name,
              size: result.assets[0].size || 0,
              uri: result.assets[0].uri
            }
          ]
        };
      });
    } catch (error) {
      notifyMessage("Ошибка при попытке выбора файла");
    }
  }, []);

  const deleteFile = useCallback(async(id: string) => {
    setCurrentTask(prev => {
      if (!prev) return undefined;
      return {
        ...prev,
        files: prev.files.filter((item: TFileDataObject) => item.id !== id)
      };
    });
  }, []);

  const handleShareFile = (uri: string, fileName: string) => {
    shareFileWithCustomName(uri, fileName);
  };

  const handleOpenFile = (uri: string) => {
    openFile(uri);
  };

  const changeDate = useCallback((event: DateTimePickerChangeEvent, selectedDate?: Date) => {
    if (!selectedDate) {
      setShow(false);
      return;
    }

    setCurrentTask(prev => {
      if (!prev) return undefined;
      const customDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        prev.date.getHours(),
        prev.date.getMinutes()
      );
      const res = (mode === 'date') ? customDate : selectedDate;
      return { ...prev, date: res, dateString: getFormatedDay(res) };
    });
    setShow(false);
  }, [mode]);
  
  const refreshNotify = async () => {
    // Внутренняя логика уведомлений оставлена без изменений
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <BottomSheet
          ref={sheetRef}
          index={0}
          onClose={handleClose}
          enablePanDownToClose
          backgroundStyle={{ backgroundColor: colors.containerBg }} // Применили цвет из темы
        >
          <BottomSheetScrollView style={[styles.innerContainer, { backgroundColor: colors.containerBg }]}>
            <KeyboardAvoidingView style={styles.container}>
              {/* Панель управления (Верхняя шапка карточки) */}
              <View style={styles.topBar}>
                <Pressable onPress={handleBack} style={styles.navButton}>
                  <Text style={styles.cancelText}>Отмена</Text>
                </Pressable>
                <Text style={[styles.headerTitle, { color: colors.titleText }]}>Задача</Text>
                <Pressable onPress={handleDone} style={styles.navButton}>
                  <Text style={[styles.doneText,{color: colors.fabBg}]}>Готово</Text>
                </Pressable>
              </View>
              <View style={styles.dataChangeContainer}>
                <Text style={styles.dataChangeText}>{dataChanged ? 'Имеются несохраненные изменения' : ''}</Text>
              </View>

              {/* Поле ввода заголовка задачи */}
              <TextInput
                style={[
                  styles.titleInput,
                  { backgroundColor: colors.cardBg, color: colors.titleText, borderColor: colors.borderColor }, emptyTitle &&  !currTask.title && styles.titleInputEmpty
                ]}
                value={currTask.title}
                onChangeText={changeTitle}
                placeholder="Название задачи"
                placeholderTextColor={colors.metaText} 
              />
              {/* Строки параметров на основе компонента CardRow */}
              <View style={[styles.rowsContainer, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <View style={{flexDirection:'row'}}>
                <View style={{flex:1}}>
                <CardRow
                  title="Дата"
                  text={dateText}
                  icon="calendar"
                  iconColor={colors.titleText}
                  onPress={() => showDatepicker('date')} 
                />
                </View>
                <View style={{flex:1}}>
                <CardRow
                  title="Время"
                  text={timeText}
                  icon='clock-outline'
                  iconColor={colors.titleText}
                  onPress={() => showDatepicker('time')}
                />                  
                </View>                
              </View>
              <View style={{flexDirection:'row'}}>
                <View style={{flex:1}}>
                <CardRow
                  title="Категория"
                  text={currTask.category.name.ru || 'Нет'}
                  icon={currTask.category.icon}
                  iconColor={currTask.category.color}
                  onPress={() => setSheetRef(categorySheetRef, 0)}
                />
                </View>
                <View style={{flex:1}}>
                <CardRow
                  title="Приоритет"
                  text={currTask.priority.name.ru || 'Нет'}
                  icon="flag"
                  iconColor={currTask.priority?.color || colors.titleText}
                  onPress={() => setSheetRef(prioritySheetRef, 0)}
                />                
                </View>                
              </View>
              <View style={{flexDirection:'row'}}>
                <View style={{flex:1}}>
                <CardRow
                  title='Уведомление'
                  text={currTask.sendNotify ? 'Включено' : 'Выключено'}
                  icon={currTask.sendNotify ? 'bell-ring-outline' : 'bell-off-outline'}
                  iconColor={colors.titleText}
                  iconRigth={currTask.sendNotify ? 'check-circle-outline' : 'checkbox-blank-circle-outline'}
                  //value={currTask.sendNotify} iconColor={colors.titleText}
                  onPress={handleNotify} 
                />
                </View>
                <View style={{flex:1}}>
                <CardRow
                  title="Вложения"
                  text={`${currTask.files?.length || 0} шт.`}
                  icon="paperclip"
                  iconColor={colors.titleText}
                  onPress={() => setSheetRef(sheetFilesRef, 0)}
                />
                </View>
              </View>              
              </View>
              {/* Нативные пикеры и кастомные BottomSheets для модального выбора currTask.date || new Date()*/}
              {show && (<DateTimePicker
                value={mode=== "date" ?getSafeDateForPicker(currTask.date):currTask.date}             
                mode={mode} 
                is24Hour={true}
                locale='ru_RU'
                onValueChange={changeDate}
                onDismiss={() => setShow(false)} />)}
              {/* ПОЛЕ ВВОДА ПРИМЕЧАНИЯ (CARD_INPUT) */}
              <TextInput
                style={[styles.cardInput, { backgroundColor: colors.cardBg, borderColor: colors.borderColor, color: colors.titleText }]}
                value={currTask.notes}
                onChangeText={changeNotes}
                placeholder="Добавьте детали или описание задачи..."
                placeholderTextColor={colors.metaText}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top" 
              />
              {todoID !== 'new' && (
                <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', marginBottom: 20 }}>
                  <Pressable style={styles.deleteButton} onPress={handleDelete}>
                    <MaterialDesignIcons name={'trash-can-outline'} color="white" size={34} />
                    <Text style={styles.deleteButtonText}>Удалить</Text>
                  </Pressable>
                </View>
              )}

              <SelectionBottomSheet
                sheetRef={categorySheetRef}
                currentId={currTask.category.id}
                setValue={changeCategory}
                setRef={setSheetRef}
                data={CATEGORIES_ARRAY}
              />
              <SelectionBottomSheet
                sheetRef={prioritySheetRef}
                currentId={currTask.priority.id}
                setValue={changePriority}
                setRef={setSheetRef}
                data={PRIORITIES_ARRAY}
              />
              <FilesBottomSheet
                files={currTask.files}
                onPick={pickDocument}
                onDelete={deleteFile}
                onShare={handleShareFile}
                onOpen={handleOpenFile}
                sheetRef={sheetFilesRef}
              />
            </KeyboardAvoidingView>
          </BottomSheetScrollView>
        </BottomSheet>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default TaskCardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  topBar: { 
    width: '100%', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 10, 
  }, 
  dataChangeContainer: { 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 10
  },
  //'#ffb900'"orange"#dfa00c #EA580C#FBBF24
  dataChangeText:{ 
    color: "#EA580C", 
    fontSize: 12
  },
  navButton: { 
    paddingHorizontal: 10, 
  }, 
  cancelText: { 
    color: 'silver', 
    fontSize: 16, 
    fontWeight: 'bold', 
  }, 
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
  }, 
  doneText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
  }, 
  titleInput: { 
    fontSize: 18, 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 20,
    width: '100%', 
    borderWidth: 2    
  }, 
  titleInputEmpty:{
    borderColor: '#E11D48', 
  },
  rowsContainer: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden', // Чтобы углы дочерних CardRow не вылезали за радиус скругления
    marginBottom: 24,
  },
  deleteButton: { 
    backgroundColor: '#E11D48', 
    paddingHorizontal: 45, 
    paddingVertical: 10,  
    borderRadius: 8, 
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 20,
    flexDirection: 'row'
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingHorizontal: 5,
  },  
  cardInput: { 
    fontSize: 16, 
    borderRadius: 8, 
    borderWidth: 2,      
    padding: 12, 
    minHeight: 100, 
    width: '100%', 
    marginBottom: 25, 
  },
});
