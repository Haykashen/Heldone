// import CategoryBottomSheet from '@/components/bottomSheet/CategoryBottomSheet';
// import FilesBottomSheet from '@/components/bottomSheet/FilesBottomSheet';
// import PriorityBottomSheet from '@/components/bottomSheet/PriorityBottomSheet';
// import CardRow from '@/components/CardRow';
// import { SettingContext } from '@/context/SettingContext';
// import { TaskContext } from '@/context/TaskContext';
// import CategoryData from '@/data/CategoryData';
// import PriorityData from '@/data/PriorityData';
// import { StatusData } from '@/data/StatusData';
// import { setData } from '@/store/setData';
// import { openFile, shareFile } from '@/utils/fileUtils';
// //import { checkPermissions, createNotification, deletelNotification } from '@/utils/notificationUtils';
// import { deleteTask, getNewTask } from '@/utils/taskUtils';
// import { TFileDataObject, TTask } from '@/utils/types';
// import { getFormatedDay, notifyMessage } from '@/utils/utils';
// import BottomSheet, { BottomSheetMethods, BottomSheetView } from '@expo/ui/community/bottom-sheet';
// import DateTimePicker, { DateTimePickerChangeEvent } from '@expo/ui/community/datetime-picker';
// import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
// import * as DocumentPicker from 'expo-document-picker';
// import { Redirect, router, useLocalSearchParams } from "expo-router";
// import { RefObject, useContext, useRef, useState } from "react";
// import { Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, Vibration, View } from "react-native"; //AppState, 
// import { SafeAreaView } from 'react-native-safe-area-context';

// type DateTimePickerMode = "date" | "time";

// const taskCard = () => {
//   const { todoID, day } = useLocalSearchParams();
//   const { task, setTask } = useContext(TaskContext);
//   const { defaultCategory, defaultPriority, defaultTime, defaultNotify } = useContext(SettingContext);   
//   const [currTask, setCurrentTask] = useState<TTask>(todoID === 'new' ? getNewTask(day as string, defaultCategory, defaultPriority, defaultTime, defaultNotify) : task.find((item: TTask) => item.id === todoID))
//   const [originalTask, setOriginalTask] = useState(JSON.stringify(currTask))
//   //BottomSheets
//   const sheetRef = useRef<BottomSheet>(null);
//   const sheetCategoryRef = useRef<BottomSheet>(null);
//   const sheetPriorityRef = useRef<BottomSheet>(null);
//   const sheetFilesRef = useRef<BottomSheet>(null);
//   // Picker
//   const [show, setShow] = useState(false);
//   const [mode, setMode] = useState<DateTimePickerMode | undefined>('date');
//   const [focused, setFocused] = useState('')

//   if (!currTask) {
//     return <Redirect href="/" />;
//   }

//   let date = currTask.date ? currTask.date.toLocaleDateString() : 'Пусто';
//   let time = currTask.date ? currTask.date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : 'Пусто';
//   let dataChanged = (originalTask !== JSON.stringify(currTask) && todoID !== 'new')

//   const showMode = (currentMode: DateTimePickerMode | undefined) => {
//     setMode(currentMode);
//     setShow(true);
//   };

//   const showDatepicker = (currentMode: DateTimePickerMode) => {
//     showMode(currentMode);
//   };

//   const changeTitle = (newTitle: string) => {
//     setCurrentTask({ ...currTask, title: newTitle })
//   }

//   const changeStatus = () => {
//     const newStatus = (currTask.status.id === StatusData.Upcoming.id) ? StatusData.Completed : StatusData.Upcoming;
//     setCurrentTask({ ...currTask, status: newStatus })
//   }

//   const changePriority = (key: string) => {
//     setCurrentTask({ ...currTask, priority: PriorityData[key] })
//   }

//   const changeCategory = (key: string) => {
//     setCurrentTask({ ...currTask, category: CategoryData[key] })
//   }

//   const changeNotes = (newNotes: string) => {
//     setCurrentTask({ ...currTask, notes: newNotes })
//   }

//   const handleBack = async () => {
//     //sheetRef.current?.snapToIndex(-1)
//     setSheetRefIndex(sheetRef, -1)
//   }

//   const handleDone = async () => {

//     if (!currTask.date || !currTask.title) {
//       Vibration.vibrate(50)
//       return;
//     }    
//     await refreshNotify()
//     const resArray = (todoID === 'new') ? [...task, currTask] : task.map((item: TTask) => { return (item.id === todoID) ? currTask : item });
//     const sortedArray = resArray.sort((first: TTask, second: TTask) => { return (first.date.getTime() - second.date.getTime()) })
//     setTask(sortedArray)
//     setData("todo", JSON.stringify(sortedArray))
//     notifyMessage('Данные успешно сохранены!')
//     handleBack()
//   }

//   const refreshNotify = async () => {
//     // if (currTask.notifyId) {
//     //   await deletelNotification(currTask.notifyId) 
//     // }  
//     // if(!currTask.sendNotify)
//     // {
//     //   setCurrentTask({ ...currTask, notifyId: '' }) 
//     //   return;
//     // }  
      
//     // if (currTask.status.id !== StatusData.Completed.id) {
//     //   const finalStatus = await checkPermissions();
//     //   // if (finalStatus !== 'granted') {
//     //   //   notifyMessage('Уведомления от приложения отключены!');
//     //   // }
//     //   const notId = await createNotification('Пора выполнить задачу!', currTask.title, currTask.date)
//     //   setCurrentTask({ ...currTask, notifyId: notId })
//     // }

//   }

//   const handleDelete = async () => {
//     if (todoID !== 'new') {
//       deleteTask(currTask.id, task, setTask)
//      // if (currTask.notifyId)
//       //  await deletelNotification(currTask.notifyId)
//     }     
//     Vibration.vibrate(70)
//     handleBack()
//   }

//   const handleClose = () => {
//     if (router.canGoBack())
//       router.back()
//     else
//       router.push('/index')
//   }

//   const setSheetRefIndex = (ref: RefObject<BottomSheetMethods | null>, index: number) => {
//     ref.current?.snapToIndex(index)    
//   }

//   //'#63B4FF'
//   const pickDocument = async () => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: '*/*', // Фильтруем только PDFapplication/pdf
//         multiple: false, // Разрешаем выбрать один файл
//         copyToCacheDirectory: true
//       });
//       if (result.canceled === false) {
//         setCurrentTask({ ...currTask, files: [...currTask.files, { id: result.assets[0].name + (new Date().toISOString()), name: result.assets[0].name, size: result.assets[0].size, uri: result.assets[0].uri }] })
//       }
//     } catch (error) {
//       notifyMessage("Ошибка при попытке выбора файла")
//     }
//   };

//   const handleShareFile = (uri: string) => {
//     shareFile(uri)
//   }

//   const deleteFile = (id: string, uri: string) => {
//     setCurrentTask({ ...currTask, files: [...currTask.files.filter((item: TFileDataObject) => item.id !== id)] })
//   }

//   const handleOpenFile = (uri: string) => {
//     openFile(uri)
//   }
  
//   const changeDate = (event: DateTimePickerChangeEvent, selectedDate: Date) => {
//     let customDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), currTask.date.getHours(), currTask.date.getMinutes())
//     let res = (mode === 'date') ? customDate : selectedDate;
    
//     setCurrentTask({ ...currTask, date: res, dateString: getFormatedDay(res)})
//     setShow(false);
//   }

//   // const testData = ()=>{
//   //   let res = [],
//   //       limit = 101;
//   //   for(var i =0; i<limit; i++) 
//   //   {
//   //     res.push(getNewTask(day as string, defaultCategory as string, defaultPriority as string, defaultTime, defaultNotify))  
//   //   } 
//   //   setTask([...task, ...res])    
//   // }
//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <SafeAreaView style={{ flex: 1 }}>
//         <BottomSheet
//           ref={sheetRef}
//           index={0}
//           onClose={handleClose}
//           enablePanDownToClose
//           backgroundStyle={{ backgroundColor: '#031F2B', }}
//         >
//           <BottomSheetView style={{ flex: 1, backgroundColor: '#031F2B', paddingHorizontal: 10 }}>
//             <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5, }}>
//               <Pressable onPress={handleBack} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
//                 <Text style={{ color: "silver", fontSize: 16, fontWeight: 'bold' }}>Отмена</Text>
//               </Pressable>
//               <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Задача</Text>
//               <Pressable onPress={handleDone} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
//                 <Text style={{ color: "#63B4FF", fontSize: 16, fontWeight: 'bold' }}>Готово</Text>
//               </Pressable>
//             </View>
//             <View style={{ justifyContent: 'center', alignItems: 'center' }}>
//               <Text style={{ color: '#ffb900', fontSize: 12, }}>{dataChanged ?'Имеются несохраненные изменения' : ''}</Text>
//             </View>
//             {show && (
//               <DateTimePicker
//                 mode={mode}
//                 locale='ru_RU'
//                 presentation="dialog"              
//                 value={currTask.date ? currTask.date : new Date()}
//                 onValueChange={(event, selectedDate) => changeDate(event, selectedDate)}
//                 onDismiss={() => {
//                   setShow(false);
//                 }}
//               />)
//             }
//             <View style={{ flexDirection: 'column', width: '100%', gap: 5, marginVertical: 15 }}>
//               <TextInput
//                 style={[styles.card_input, { borderColor: focused == 'Title' ? 'silver' : currTask.title ? '#263238' : '#E11D48' }]}
//                 onFocus={() => setFocused('Title')}
//                 onBlur={() => setFocused('')}
//                 onChangeText={(text) => changeTitle(text)}
//                 placeholder={'Заголовок... ( не более 40 символов )'}
//                 placeholderTextColor={'gray'}
//                 value={currTask.title}
//                 //autoFocus={true} 
//                 maxLength={40}
//               />
//               <CardRow
//                 title='День'
//                 text={date}
//                 icon={'calendar-month-outline'}
//                 iconBackColor={'#263238'}
//                 iconColor={currTask.date ? 'white' : '#E11D48'}
//                 onPress={() => showDatepicker('date')}
//               />
//               <CardRow
//                 title='Время'
//                 text={time}
//                 icon={'clock'}
//                 iconBackColor={'#263238'}
//                 iconColor={'white'}
//                 onPress={() => showDatepicker('time')}
//               />
//               <CardRow
//                 title='Приоритет'
//                 text={currTask.priority.name.ru}
//                 icon={currTask.priority.icon}
//                 iconBackColor={currTask.priority.color}
//                 iconColor={'white'}
//                 onPress={() => setSheetRefIndex(sheetPriorityRef, 0)}
//               />
//               <CardRow
//                 title='Категория'
//                 text={currTask.category.name.ru}
//                 icon={currTask.category.icon}
//                 iconBackColor={currTask.category.backColor}
//                 iconColor={currTask.category.color}
//                 onPress={() => setSheetRefIndex(sheetCategoryRef, 0)}
//               />
//               <CardRow
//                 title='Уведомление'
//                 text={currTask.sendNotify?'Включено':'Выключено'}
//                 icon={currTask.sendNotify?'bell-ring':'bell-off'}
//                 iconBackColor={'#263238'}
//                 iconColor={'white'}
//                 onPress={() => setCurrentTask({ ...currTask, sendNotify: !currTask.sendNotify})}
//               />              
//               <CardRow
//                 title='Статус'
//                 text={currTask.status.name.ru}
//                 icon={currTask.status.icon}
//                 iconBackColor={'#263238'}
//                 iconColor={currTask.status.color}
//                 onPress={changeStatus}
//               />
//               <CardRow
//                 title='Файлы'
//                 text={'' + currTask.files.length}
//                 icon={'file'}
//                 iconBackColor={'#263238'}
//                 iconColor={'white'}
//                 onPress={() => setSheetRefIndex(sheetFilesRef, 0)}
//               />
//               <TextInput
//                 style={[styles.card_input, { height: 100, borderColor: focused == 'Notes' ? 'silver' : '#263238', marginBottom: 10 }]}
//                 onFocus={() => setFocused('Notes')}
//                 onBlur={() => setFocused('')}
//                 onChangeText={(text) => changeNotes(text)}
//                 placeholder={'Примечание...'}
//                 placeholderTextColor={'gray'}
//                 value={currTask.notes}
//                 multiline={true}
//                 textAlignVertical='top'
//               />
//               <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', marginBottom: 20 }}>
//                 <Pressable
//                   style={{ backgroundColor: '#263238', padding: 10, borderRadius: 15, width: '60%', justifyContent: 'center', alignItems: 'center' }}
//                   onPress={handleDelete}>
//                   <MaterialDesignIcons name={'trash-can-outline'} color={"red"} size={34} />
//                 </Pressable>
//               </View>
//             </View>
//             <CategoryBottomSheet
//               currentId={currTask.category.id}
//               setValue={changeCategory}
//               setRef={setSheetRefIndex}
//               sheetRef={sheetCategoryRef}
//             />
//             <PriorityBottomSheet
//               currentId={currTask.priority.id}
//               setValue={changePriority}
//               setRef={setSheetRefIndex}
//               sheetRef={sheetPriorityRef}
//             />
//             <FilesBottomSheet
//               files={currTask.files}
//               addFile={pickDocument}
//               deleteFile={deleteFile}
//               sheetRef={sheetFilesRef}
//               shareFile={handleShareFile}
//               openFile={handleOpenFile}
//             />
//           </BottomSheetView>
//         </BottomSheet>
//       </SafeAreaView>
//     </TouchableWithoutFeedback>
//   );
// }

// export default taskCard

// const styles = StyleSheet.create({
//   card_input: {
//     fontSize: 16,
//     color: 'white',
//     borderWidth: 2,
//     borderRadius: 10,
//     paddingHorizontal: 5,
//     paddingVertical: 10
//   }
// });
import CategoryBottomSheet from '@/components/bottomSheet/CategoryBottomSheet';
import FilesBottomSheet from '@/components/bottomSheet/FilesBottomSheet';
import PriorityBottomSheet from '@/components/bottomSheet/PriorityBottomSheet';
import CardRow from '@/components/CardRow';
import { SettingContext } from '@/context/SettingContext';
import { TaskContext } from '@/context/TaskContext';
import CategoryData from '@/data/CategoryData';
import PriorityData from '@/data/PriorityData';
import { StatusData } from '@/data/StatusData';
import { setData } from '@/store/setData';
import { openFile, shareFileWithCustomName } from '@/utils/fileUtils';
//import { checkPermissions, createNotification, deletelNotification } from '@/utils/notificationUtils';
import { deleteTask, getNewTask } from '@/utils/taskUtils';
import { TFileDataObject, TTask } from '@/utils/types';
import { getFormatedDay, notifyMessage } from '@/utils/utils';
import BottomSheet, { BottomSheetMethods, BottomSheetView } from '@expo/ui/community/bottom-sheet';
import DateTimePicker, { DateTimePickerChangeEvent } from '@expo/ui/community/datetime-picker';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { RefObject, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, Vibration, View } from "react-native";
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

  const deleteFile = useCallback((id: string) => {
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
    //   const notId = await createNotification('Пора выполнить задачу!', currTask.title, currTask.date)
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
          <BottomSheetView style={styles.innerContainer}>
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
              <CardRow
                title='Уведомление'
                text={currTask.sendNotify?'Включено':'Выключено'}
                icon={currTask.sendNotify?'bell-ring':'bell-off'}
                //iconBackColor={'#263238'}
                iconColor={'white'}
                onPress={handleNotify}
              />                
              <CardRow
                title="Категория"
                text={currTask.category.name.ru || 'Нет'}
                icon={currTask.category.icon}
                iconColor={'white'}
                iconBackColor={currTask.category?.backColor}
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
          </BottomSheetView>
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
