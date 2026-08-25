import CategoryBottomSheet from '@/components/bottomSheet/CategoryBottomSheet';
import FilesBottomSheet from '@/components/bottomSheet/FilesBottomSheet';
import PriorityBottomSheet from '@/components/bottomSheet/PriorityBottomSheet';
import CardRow from '@/components/CardRow';
import CardRowSwitch from '@/components/CardRowSwitch';
import { SettingContext } from '@/context/SettingContext';
import { TaskContext } from '@/context/TaskContext';
import CategoryData from '@/data/CategoryData';
import PriorityData from '@/data/PriorityData';
import { StatusData } from '@/data/StatusData';
import { setData } from '@/store/setData';
import { openFile, shareFileWithCustomName } from '@/utils/fileUtils';
//import { checkPermissions, createNotification, deletelNotification } from '@/utils/notificationUtils';
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

const TaskCardScreen = () => {
  const { todoID, day } = useLocalSearchParams();
  const { task, setTask } = useContext(TaskContext);
  const { defaultCategory, defaultPriority, defaultTime, defaultNotify } = useContext(SettingContext);

  // Инициализируем начальное состояние задачи один раз при монтировании компонента
  const initialTask = useMemo(() => {
    if (todoID === 'new') {
      return getNewTask(day as string, defaultCategory, defaultPriority, defaultTime, defaultNotify);
    }
    return task.find((item: TTask) => item.id === todoID);
  }, [todoID, day, task, defaultCategory, defaultPriority, defaultTime, defaultNotify]);

  const [currTask, setCurrentTask] = useState<TTask | undefined>(initialTask);

  // ОПТИМИЗАЦИЯ: оригинальное состояние храним в useRef, чтобы не вызывать лишних рендеров
  const originalTaskRef = useRef<string>(JSON.stringify(initialTask));

  // Ссылки для управления BottomSheets
  const sheetRef = useRef<BottomSheet>(null);
  const sheetCategoryRef = useRef<BottomSheet>(null);
  const sheetPriorityRef = useRef<BottomSheet>(null);
  const sheetFilesRef = useRef<BottomSheet>(null);

  // Состояния для Пикера Дат и Фокусировки
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<DateTimePickerMode | undefined>('date');

  // Безопасный редирект, если задача не найдена
  if (!currTask) {
    return <Redirect href="/" />;
  }

  // МЕМОИЗАЦИЯ: строки даты и времени пересчитываются только при реальном изменении currTask.date
  const dateText = useMemo(() => currTask.date ? currTask.date.toLocaleDateString() : 'Пусто', [currTask.date]);
  const timeText = useMemo(() => currTask.date ? currTask.date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : 'Пусто', [currTask.date]);

  // Быстрая проверка изменений без полной перегрузки стейта компонента
  const dataChanged = useMemo(() => {
    return originalTaskRef.current !== JSON.stringify(currTask) && todoID !== 'new';
  }, [currTask, todoID]);

  // Управление открытием пикеров
  const showMode = useCallback((currentMode: DateTimePickerMode | undefined) => {
    setMode(currentMode);
    setShow(true);
  }, []);

  const showDatepicker = useCallback((currentMode: DateTimePickerMode) => {
    showMode(currentMode);
  }, [showMode]);

  // ОПТИМИЗАЦИЯ: Все методы обновления полей обернуты в useCallback с функциональным апдейтом prev
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
      Vibration.vibrate(50);
      return;
    }
    await refreshNotify()
    // Формируем новый массив без прямой мутации контекста
    const resArray = (todoID === 'new')
      ? [...task, currTask]
      : task.map((item: TTask) => item.id === todoID ? currTask : item);

    // БЕЗОПАСНОСТЬ: Сортируем поверхностную копию массива [...resArray], чтобы избежать багов реактивности
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
        return
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
    // if (currTask.notifyId) {
    //   await deletelNotification(currTask.notifyId)
    // }    
    setCurrentTask(prev => {
      if (!prev) return undefined;
      return {
        ...prev,
        files: prev.files.filter((item: TFileDataObject) => item.id !== id)
      };
    });
  }, []);

  const handleShareFile = (uri: string, fileName: string) => {
    //shareFile(uri)
    shareFileWithCustomName(uri, fileName)
  }

  const handleOpenFile = (uri: string) => {
    openFile(uri)
  }

  // БЕЗОПАСНОСТЬ: Добавлена проверка на существование выбранной даты selectedDate (защита от краша при отмене)
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
    // if (currTask.notifyId) {
    //   await deletelNotification(currTask.notifyId)
    // }
    // if (!currTask.sendNotify) {
    //   //setCurrentTask({ ...currTask, notifyId: '' })
    //   setCurrentTask(prev => prev ? { ...prev, notifyId: ''} : undefined);
    //   return;
    // }

    // if (currTask.status.id !== StatusData.Completed.id) {
    //   const finalStatus = await checkPermissions();
    //   // if (finalStatus !== 'granted') {
    //   //   notifyMessage('Уведомления от приложения отключены!');
    //   // }
    //   let notId = '';
    //   if (finalStatus === 'granted')
    //     notId = await createNotification('Пора выполнить задачу!', currTask.title, currTask.date)
    //   setCurrentTask(prev => prev ? { ...prev, notifyId: notId} : undefined);
    // }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>      
      <SafeAreaView style={styles.container}>     
        <BottomSheet
          ref={sheetRef}
          index={0}
          onClose={handleClose}
          enablePanDownToClose
          backgroundStyle={styles.bottomSheetBackground}
        >       
          <BottomSheetScrollView style={styles.innerContainer}>
            <KeyboardAvoidingView style={styles.container}>  
            {/* Панель управления (Верхняя шапка карточки) */}
            <View style={styles.topBar}>
              <Pressable onPress={handleBack} style={styles.navButton}>
                <Text style={styles.cancelText}>Отмена</Text>
              </Pressable>
              <Text style={styles.headerTitle}>Задача</Text>
              <Pressable onPress={handleDone} style={styles.navButton}>
                <Text style={styles.doneText}>Готово</Text>
              </Pressable>
            </View>
            <View style={styles.dataChangeContainer}>
               <Text style={styles.dataChangeText}>{dataChanged ?'Имеются несохраненные изменения' : ''}</Text>
            </View>
            {/* Поле ввода заголовка задачи */}
            <TextInput
              style={[styles.titleInput, !currTask.title&&styles.titleInputEmpty]}
              value={currTask.title}
              onChangeText={changeTitle}
              placeholder="Название задачи"
              placeholderTextColor="silver"
            />

            {/* Строки параметров на основе компонента CardRow */}
            <View style={styles.rowsContainer}>
              <CardRow
                title="Дата"
                text={dateText}
                icon="calendar"
                iconColor="white"
                onPress={() => showDatepicker('date')}
              />
              <CardRow
                title="Время"
                text={timeText}
                icon="clock"
                iconColor="white"
                onPress={() => showDatepicker('time')}
              />
              <CardRowSwitch
                title='Уведомление'
                text={currTask.sendNotify?'Включено':'Выключено'}
                icon={currTask.sendNotify?'bell-ring':'bell-off'}
                value={currTask.sendNotify}
                iconColor={'white'}
                onPress={handleNotify}
              />                
              <CardRow
                title="Категория"
                text={currTask.category.name.ru || 'Нет'}
                icon={currTask.category.icon}
                iconColor={currTask.category.color}
                onPress={() => setSheetRef(sheetCategoryRef, 0)}
              />
              <CardRow
                title="Приоритет"
                text={currTask.priority.name.ru || 'Нет'}
                icon="flag"
                iconColor={currTask.priority?.color || 'white'}
                onPress={() => setSheetRef(sheetPriorityRef, 0)} />
              <CardRow
                title="Вложения"
                text={`${currTask.files?.length || 0} шт.`}
                icon="paperclip"
                iconColor="white"
                onPress={() => setSheetRef(sheetFilesRef, 0)}
              />
            </View>
            {/* Нативные пикеры и кастомные BottomSheets для модального выбора */}
            {show && (<DateTimePicker value={currTask.date || new Date()} mode={mode} is24Hour={true} onValueChange={changeDate} onDismiss={()=>setShow(false)}/>)}

            {/* ПОЛЕ ВВОДА ПРИМЕЧАНИЯ (CARD_INPUT) */}
            <Text style={styles.inputLabel}>Примечание</Text>
            <TextInput
              style={styles.cardInput}
              value={currTask.notes}
              onChangeText={changeNotes}
              placeholder="Добавьте детали или описание задачи..."
              placeholderTextColor="silver"
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top" // Фикс для Android, чтобы текст начинался сверху
            />
            {todoID !== 'new' && (<View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', marginBottom: 20 }}>
              <Pressable
                style={styles.deleteButton}
                onPress={handleDelete}>
                <MaterialDesignIcons name={'trash-can-outline'} color={"white"} size={34} />
                <Text style={styles.deleteButtonText}>Удалить</Text>
              </Pressable>
            </View>)}
            <CategoryBottomSheet
              currentId={currTask.category.id}
              setValue={changeCategory}
              setRef={setSheetRef}
              sheetRef={sheetCategoryRef}
            />
            <PriorityBottomSheet
              currentId={currTask.priority.id}
              setValue={changePriority}
              setRef={setSheetRef}
              sheetRef={sheetPriorityRef}
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
    //backgroundColor: '#031F2B',
  },
  bottomSheetBackground: {
    backgroundColor: '#031F2B',
  },
  innerContainer: {
    flex: 1,
    backgroundColor: '#031F2B',
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
    marginBottom:10
  },
  dataChangeText:{ 
    color: '#ffb900', 
    fontSize: 12
  },
  navButton: { 
    //paddingVertical: 5, 
    paddingHorizontal: 10, 
  }, 
  cancelText: { 
    color: 'silver', 
    fontSize: 16, 
    fontWeight: 'bold', 
  }, 
  headerTitle: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold', 
  }, 
  doneText: { 
    color: '#007aff', 
    fontSize: 16, 
    fontWeight: 'bold', 
  }, 
  titleInput: { 
    backgroundColor: '#052d3e', 
    color: 'white', 
    fontSize: 18, 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 20,
    width: '100%', 
    borderColor: '#052d3e', 
    borderWidth:2    
  }, 
  titleInputEmpty:{
    borderColor: '#E11D48', 
  },
  rowsContainer: { 
    gap: 15, 
    backgroundColor: '#052d3e', 
    borderRadius: 10, 
    padding: 15, 
    marginBottom: 25, 
  }, 
  deleteButton: { 
    backgroundColor: '#d9534f', 
    padding: 14, 
    borderRadius: 8, 
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 20,
    flexDirection:'row'
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputLabel: {
    color: '#7a92a5',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingHorizontal: 5,
  },  
  cardInput: { 
    backgroundColor: '#052d3e', 
    color: 'white', 
    fontSize: 16, 
    borderRadius: 10, 
    padding: 12, 
    minHeight: 100, 
    width: '100%', 
    marginBottom: 25, 
  },
});
