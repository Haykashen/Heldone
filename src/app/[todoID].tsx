// import FilesBottomSheet from '@/components/bottomSheet/FilesBottomSheet';
// import SelectionBottomSheet from '@/components/bottomSheet/SelectionBottomSheet';
// import ScreenHeader from '@/components/headers/ScreenHeader';
// import CardRow from '@/components/rows/CardRow';
// import { TFileDataObject } from '@/components/types/types';
// import { TTask } from '@/components/types/typesTask';
// import { SettingContext } from '@/context/SettingContext';
// import { TaskContext } from '@/context/TaskContext';
// import { useAppColors } from '@/context/ThemeContext'; // Импортируем хук глобальных цветов
// import CategoryData, { CATEGORIES_ARRAY } from '@/data/CategoryData';
// import PriorityData, { PRIORITIES_ARRAY } from '@/data/PriorityData';
// import { setData } from '@/store/setData';
// import { openFile, shareFileWithCustomName } from '@/utils/fileUtils';
// //import { checkPermissions, createNotification, deletelNotification } from '@/utils/notificationUtils';
// import { deleteTask, getNewTask } from '@/utils/taskUtils';
// import { getFormatedDay, notifyMessage } from '@/utils/utils';
// import BottomSheet, { BottomSheetMethods } from '@expo/ui/community/bottom-sheet';
// import DateTimePicker, { DateTimePickerChangeEvent } from '@expo/ui/community/datetime-picker';
// import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
// import * as DocumentPicker from 'expo-document-picker';
// import { File, Paths } from 'expo-file-system';
// import { Redirect, router, useLocalSearchParams } from "expo-router";
// import { RefObject, use, useMemo, useRef, useState } from "react";
// import { Keyboard, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, Vibration, View } from "react-native";
// import { SafeAreaView } from 'react-native-safe-area-context';

// type DateTimePickerMode = "date" | "time";

// const physicalDeleteFiles = async (uris: string[]) => {
//   if (uris.length === 0) return;
//   try {
//     await Promise.all(
//       uris.map(async (uri) => {
//         const fileInstance = new File(uri);
//         if (fileInstance.exists) {
//           await fileInstance.delete();
//         }
//       })
//     );
//   } catch (error) {
//     console.error("Ошибка при физической зачистке файлов:", error);
//   }
// };

// const getSafeDateForPicker = (originalDate: Date) => {
//   const safeDate = new Date(originalDate);
//   safeDate.setHours(12, 0, 0, 0); // Ставим 12 часов дня
//   return safeDate;
// };

// const TaskCardScreen = () => {
//   const { todoID, day } = useLocalSearchParams();

//   const { task, setTask } = use(TaskContext);
//   const { defaultCategory, defaultPriority, defaultTime, defaultNotify } = use(SettingContext);

//   const colors = useAppColors();
//   const [emptyTitle, setEmptyTitle] = useState(false)

//   const initialTask = useMemo(() => {
//     if (todoID === 'new') {
//       return getNewTask(day as string, defaultCategory, defaultPriority, defaultTime, defaultNotify);
//     }
//     return task.find((item: TTask) => item.id === todoID);
//   }, [todoID, day, task, defaultCategory, defaultPriority, defaultTime, defaultNotify]);

//   const [currTask, setCurrentTask] = useState<TTask | undefined>(initialTask);

//   // Оригинальное состояние храним в useRef для проверки изменений
//   const originalTaskRef = useRef<string>(JSON.stringify(initialTask));

//   // Ссылки для управления BottomSheetsё  
//   const categorySheetRef = useRef<BottomSheet>(null);
//   const prioritySheetRef = useRef<BottomSheet>(null);
//   const sheetFilesRef = useRef<BottomSheet>(null);

//   // Хранит URI файлов, которые нужно удалить физически только при нажатии "Готово"
//   const filesToDeleteRef = useRef<string[]>([]);
//   // Хранит URI файлов, которые были добавлены за текущую сессию (для очистки при отмене)
//   const addedFilesRef = useRef<string[]>([]);
//   // Состояния для Пикера Дат и Фокусировки
//   const [show, setShow] = useState(false);
//   const [mode, setMode] = useState<DateTimePickerMode | undefined>('date');

//   // Безопасный редирект, если задача не найдена
//   if (!currTask) {
//     return <Redirect href="/" />;
//   }

//   const dateText = currTask.date.toLocaleDateString();
//   const timeText = currTask.date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
//   const dataChanged = originalTaskRef.current !== JSON.stringify(currTask) && todoID !== 'new';

//   // Управление открытием пикеров
//   const showMode = (currentMode: DateTimePickerMode | undefined) => {
//     setMode(currentMode);
//     setShow(true);
//   };

//   const showDatepicker = (currentMode: DateTimePickerMode) => {
//     showMode(currentMode);
//   };

//   const changeTitle = (newTitle: string) => {
//     setCurrentTask(prev => prev ? { ...prev, title: newTitle } : undefined);
//   };

//   const handleNotify = () => {
//     setCurrentTask(prev => prev ? { ...prev, sendNotify: !prev.sendNotify } : undefined);
//   };

//   const changePriority = (key: string) => {
//     setCurrentTask(prev => prev ? { ...prev, priority: PriorityData[key] } : undefined);
//   };

//   const changeCategory = (key: string) => {
//     setCurrentTask(prev => prev ? { ...prev, category: CategoryData[key] } : undefined);
//   };

//   const changeNotes = (newNotes: string) => {
//     setCurrentTask(prev => prev ? { ...prev, notes: newNotes } : undefined);
//   };

//   const setSheetRef = (ref: RefObject<BottomSheetMethods | null>, index: number) => {
//     ref.current?.snapToIndex(index);
//   };

//   const handleDone = async () => {
//     if (!currTask.date || !currTask.title) {
//       setEmptyTitle(true)
//       notifyMessage('Заполните название задачи');
//       Vibration.vibrate(50);
//       return;
//     }

//     handleClose(); 

//     await refreshNotify();
//     // ФИЗИЧЕСКОЕ УДАЛЕНИЕ: Зачищаем файлы, от которых пользователь отказался
//     if (filesToDeleteRef.current.length > 0) {
//       await physicalDeleteFiles(filesToDeleteRef.current);
//       filesToDeleteRef.current = [];
//     }
//     addedFilesRef.current = []; // Сбрасываем, так как задача сохранена успешно

//     const resArray = (todoID === 'new')
//       ? [...task, currTask]
//       : task.map((item: TTask) => item.id === todoID ? currTask : item);

//     const sortedArray = [...resArray].sort((first, second) => first.date.getTime() - second.date.getTime());

//     setTask(sortedArray);
//     setData("todo", JSON.stringify(sortedArray));
//     notifyMessage('Данные успешно сохранены!');

//   };

//   const handleDelete = async () => {
//     try {
//       // 3. Обратная связь и закрытие экрана
//       Vibration.vibrate(70);
//       handleClose();      
//       // 1. Собираем уникальные URI всех файлов, которые нужно стереть с диска
//       const urisToDelete = new Set<string>();

//       // Добавляем файлы, которые привязаны к задаче в текущем UI-стейт
//       currTask?.files?.forEach((fileData: TFileDataObject) => {
//         if (fileData.uri) urisToDelete.add(fileData.uri);
//       });

//       // Добавляем файлы, которые были созданы/добавлены во время текущей сессии редактирования
//       addedFilesRef.current.forEach((uri) => {
//         if (uri) urisToDelete.add(uri);
//       });

//       // 2. Физически удаляем все собранные файлы с диска устройства
//       if (urisToDelete.size > 0) {
//         await physicalDeleteFiles(Array.from(urisToDelete));
//       }

//       // 3. Очищаем рефы, так как задача полностью уничтожается
//       addedFilesRef.current = [];
//       filesToDeleteRef.current = [];

//       // 2. Логика удаления уведомлений и самой задачи (ваша оригинальная часть)
//       if (todoID !== 'new') {
//         if (currTask.notifyId) {
//           //await deletelNotification(currTask.notifyId);
//         }
//         deleteTask(currTask.id, task, setTask);
//       }
//     } catch (error) {
//       notifyMessage("Произошла ошибка при удалении данных");
//     }
//   };

//   const handleClose = () => {
//     if (router.canGoBack()) {
//       router.back();
//     } else {
//       router.push('/');
//     }
//   };

//   // Универсальный метод выхода, который сработает при "Отмене"
//   const handleCancelLeaved = async () => {
//     // Нам нужно удалить только те новые файлы, которые всё еще остались в стейте currTask
//     // (если пользователь добавил файл и сразу нажал крестик, он уже в filesToDeleteRef)
//     const currentTaskUris = currTask?.files.map(f => f.uri) || [];
//     const filesToClean = addedFilesRef.current.filter(uri => currentTaskUris.includes(uri));

//     if (filesToClean.length > 0) {
//       await physicalDeleteFiles(filesToClean);
//     }

//     // Очищаем рефы на всякий случай
//     addedFilesRef.current = [];
//     filesToDeleteRef.current = [];

//     // Вызываем закрытие интерфейса
//     handleClose();
//   };

//   const pickDocument = async () => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: '*/*',
//         multiple: false,
//         copyToCacheDirectory: false // Читаем напрямую из исходного места
//       });

//       if (result.canceled || !result.assets || result.assets.length === 0) {
//         return;
//       }

//       const pickedFile = result.assets[0];

//       // 1. Создаем объект исходного файла по его URI
//       const sourceFile = new File(pickedFile.uri);

//       // 2. Формируем уникальное имя файла для сохранения
//       const timestamp = Date.now();
//       const permanentFileName = `${timestamp}_${pickedFile.name}`;

//       // 3. Создаем целевой объект File, передавая директорию Paths.document и имя файла
//       const destinationFile = new File(Paths.document, permanentFileName);

//       // 4. Копируем один объект файла в другой
//       await sourceFile.copy(destinationFile);

//       addedFilesRef.current.push(destinationFile.uri);
//       // 5. Сохраняем постоянный URI в стейт задачи
//       setCurrentTask(prev => {
//         if (!prev) return undefined;
//         return {
//           ...prev,
//           files: [
//             ...prev.files,
//             {
//               id: pickedFile.name + new Date().toISOString(),
//               name: pickedFile.name,
//               size: pickedFile.size || 0,
//               uri: destinationFile.uri // destinationFile.uri содержит стабильный рабочий путь
//             }
//           ]
//         };
//       });

//     } catch (error) {
//       //console.error("Ошибка при сохранении файла:", error);
//       notifyMessage("Ошибка при попытке выбора и сохранения файла");
//     }
//   };

//   const deleteFile = (id: string) => {
//     // 1. Находим файл, чтобы забрать его URI
//     const fileToPendingDelete = currTask?.files.find((item: TFileDataObject) => item.id === id);

//     // 2. Если у файла есть путь, откладываем его удаление
//     if (fileToPendingDelete?.uri) {
//       filesToDeleteRef.current.push(fileToPendingDelete.uri);
//     }

//     // 3. Убираем файл из локального стейта (из интерфейса он исчезнет сразу)
//     setCurrentTask(prev => {
//       if (!prev) return undefined;
//       return {
//         ...prev,
//         files: prev.files.filter((item: TFileDataObject) => item.id !== id)
//       };
//     });
//   };

//   const handleShareFile = (uri: string, fileName: string) => {
//     shareFileWithCustomName(uri, fileName);
//   };

//   const handleOpenFile = (uri: string) => {
//     openFile(uri);
//   };

//   const changeDate = (event: DateTimePickerChangeEvent, selectedDate?: Date) => {
//     if (!selectedDate) {
//       setShow(false);
//       return;
//     }

//     setCurrentTask(prev => {
//       if (!prev) return undefined;
//       const customDate = new Date(
//         selectedDate.getFullYear(),
//         selectedDate.getMonth(),
//         selectedDate.getDate(),
//         prev.date.getHours(),
//         prev.date.getMinutes()
//       );
//       const res = (mode === 'date') ? customDate : selectedDate;
//       return { ...prev, date: res, dateString: getFormatedDay(res) };
//     });
//     setShow(false);
//   };

//   const refreshNotify = async () => {
//     // if (currTask.notifyId) {
//     //  // await deletelNotification(currTask.notifyId)
//     // }
//     // if (!currTask.sendNotify) {
//     //   //setCurrentTask({ ...currTask, notifyId: '' })
//     //   setCurrentTask(prev => prev ? { ...prev, notifyId: '' } : undefined);
//     //   return;
//     // }

//     // if (currTask.status.id !== StatusData.Completed.id) {
//     //  // const finalStatus = await checkPermissions();
//     //   // if (finalStatus !== 'granted') {
//     //   //   notifyMessage('Уведомления от приложения отключены!');
//     //   // }
//     //   let notId = '';
//     //  // if (finalStatus === 'granted')
//     //   //  notId = await createNotification('Пора выполнить задачу!', currTask.title, currTask.date)
//     //   setCurrentTask(prev => prev ? { ...prev, notifyId: notId } : undefined);
//     // }
//   };

//   return (
//     <SafeAreaView style={[{ paddingHorizontal: 15, backgroundColor: colors.containerBg }]}>
//       <View style={styles.grabberContainer}>
//         <View style={[styles.grabber, { backgroundColor: '#CCCCCC' }]} />
//       </View>
//       <ScreenHeader
//         title="Задача"
//         onCancel={handleCancelLeaved}
//         onDone={handleDone}
//         titleColor={colors.titleText}
//         actionColor={colors.fabBg}
//       />
//       <View style={styles.dataChangeContainer}>
//         <Text style={styles.dataChangeText}>{dataChanged ? 'Имеются несохраненные изменения' : ''}</Text>
//       </View>
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <KeyboardAvoidingView style={styles.container}>
//           {/* Поле ввода заголовка задачи */}
//           <TextInput
//             style={[
//               styles.titleInput,
//               { backgroundColor: colors.cardBg, color: colors.titleText, borderColor: colors.borderColor }, emptyTitle && !currTask.title && styles.titleInputEmpty
//             ]}
//             value={currTask.title}
//             onChangeText={changeTitle}
//             placeholder="Название задачи"
//             placeholderTextColor={colors.metaText}
//           />
//           {/* Строки параметров на основе компонента CardRow */}
//           <View style={[styles.rowsContainer, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
//             <View style={{ flexDirection: 'row' }}>
//               <View style={{ flex: 1 }}>
//                 <CardRow
//                   title="Дата"
//                   text={dateText}
//                   icon="calendar"
//                   iconColor={colors.titleText}
//                   onPress={() => showDatepicker('date')}
//                 />
//               </View>
//               <View style={{ flex: 1 }}>
//                 <CardRow
//                   title="Время"
//                   text={timeText}
//                   icon='clock-outline'
//                   iconColor={colors.titleText}
//                   onPress={() => showDatepicker('time')}
//                 />
//               </View>
//             </View>
//             <View style={{ flexDirection: 'row' }}>
//               <View style={{ flex: 1 }}>
//                 <CardRow
//                   title="Категория"
//                   text={currTask.category.name.ru || 'Нет'}
//                   icon={currTask.category.icon}
//                   iconColor={currTask.category.color}
//                   onPress={() => setSheetRef(categorySheetRef, 0)}
//                 />
//               </View>
//               <View style={{ flex: 1 }}>
//                 <CardRow
//                   title="Приоритет"
//                   text={currTask.priority.name.ru || 'Нет'}
//                   icon="flag"
//                   iconColor={currTask.priority?.color || colors.titleText}
//                   onPress={() => setSheetRef(prioritySheetRef, 0)}
//                 />
//               </View>
//             </View>
//             <View style={{ flexDirection: 'row' }}>
//               <View style={{ flex: 1 }}>
//                 <CardRow
//                   title='Уведомление'
//                   text={currTask.sendNotify ? 'Включено' : 'Выключено'}
//                   icon={currTask.sendNotify ? 'bell-ring-outline' : 'bell-off-outline'}
//                   iconColor={colors.titleText}
//                   iconRigth={currTask.sendNotify ? 'check-circle-outline' : 'checkbox-blank-circle-outline'}
//                   //value={currTask.sendNotify} iconColor={colors.titleText}
//                   onPress={handleNotify}
//                 />
//               </View>
//               <View style={{ flex: 1 }}>
//                 <CardRow
//                   title="Вложения"
//                   text={`${currTask.files?.length || 0} шт.`}
//                   icon="paperclip"
//                   iconColor={colors.titleText}
//                   onPress={() => setSheetRef(sheetFilesRef, 0)}
//                 />
//               </View>
//             </View>
//           </View>
//           {/* Нативные пикеры и кастомные BottomSheets для модального выбора currTask.date || new Date()*/}
//           {show && (<DateTimePicker
//             value={mode === "date" ? getSafeDateForPicker(currTask.date) : currTask.date}
//             mode={mode}
//             is24Hour={true}
//             locale='ru_RU'
//             onValueChange={changeDate}
//             onDismiss={() => setShow(false)} />)}
//           {/* ПОЛЕ ВВОДА ПРИМЕЧАНИЯ (CARD_INPUT) */}
//           <TextInput
//             style={[styles.cardInput, { backgroundColor: colors.cardBg, borderColor: colors.borderColor, color: colors.titleText }]}
//             value={currTask.notes}
//             onChangeText={changeNotes}
//             placeholder="Добавьте детали или описание задачи..."
//             placeholderTextColor={colors.metaText}
//             multiline={true}
//             numberOfLines={4}
//             textAlignVertical="top"
//           />
//           {todoID !== 'new' && (
//             <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', marginBottom: 20 }}>
//               <Pressable style={styles.deleteButton} onPress={handleDelete}>
//                 <MaterialDesignIcons name={'trash-can-outline'} color="white" size={24} />
//                 <Text style={styles.deleteButtonText}>Удалить</Text>
//               </Pressable>
//             </View>
//           )}

//           <SelectionBottomSheet
//             sheetRef={categorySheetRef}
//             currentId={currTask.category.id}
//             setValue={changeCategory}
//             setRef={setSheetRef}
//             data={CATEGORIES_ARRAY}
//           />
//           <SelectionBottomSheet
//             sheetRef={prioritySheetRef}
//             currentId={currTask.priority.id}
//             setValue={changePriority}
//             setRef={setSheetRef}
//             data={PRIORITIES_ARRAY}
//           />
//           <FilesBottomSheet
//             files={currTask.files}
//             onPick={pickDocument}
//             onDelete={deleteFile}
//             onShare={handleShareFile}
//             onOpen={handleOpenFile}
//             sheetRef={sheetFilesRef}
//           />
//         </KeyboardAvoidingView>
//       </TouchableWithoutFeedback>
//     </SafeAreaView>
//   );
// };

// export default TaskCardScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   // innerContainer: {
//   //   paddingHorizontal: 15,
//   // },
//   dataChangeContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10
//   },
//   //'#ffb900'"orange"#dfa00c #EA580C#FBBF24
//   dataChangeText: {
//     color: "#EA580C",
//     fontSize: 12
//   },
//   titleInput: {
//     fontSize: 18,
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 10,
//     width: '100%',
//     borderWidth: 2
//   },
//   titleInputEmpty: {
//     borderColor: '#E11D48',
//   },
//   rowsContainer: {
//     borderWidth: 1,
//     borderRadius: 10,
//     overflow: 'hidden', // Чтобы углы дочерних CardRow не вылезали за радиус скругления
//     marginBottom: 10,
//   },
//   deleteButton: {
//     backgroundColor: '#E11D48',
//     paddingHorizontal: 45,
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 'auto',
//     marginBottom: 20,
//     flexDirection: 'row'
//   },
//   deleteButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     paddingHorizontal: 5,
//   },
//   cardInput: {
//     fontSize: 16,
//     borderRadius: 8,
//     borderWidth: 2,
//     padding: 12,
//     minHeight: 100,
//     width: '100%',
//     marginBottom: 25,
//   },
//   grabberContainer: {
//     width: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12, // Отступы сверху и снизу от полосочки
//   },
//   grabber: {
//     width: 40,          // Длина полосочки
//     height: 5,          // Толщина полосочки
//     borderRadius: 2.5,  // Полное скругление углов
//     opacity: 0.5,       // Делаем цвет помягче
//   },  
// });

import FilesBottomSheet from '@/components/bottomSheet/FilesBottomSheet';
import SelectionBottomSheet from '@/components/bottomSheet/SelectionBottomSheet';
import ScreenHeader from '@/components/headers/ScreenHeader';
import CardRow from '@/components/rows/CardRow';
import { TFileDataObject } from '@/components/types/types';
import { TTask } from '@/components/types/typesTask';
import { SettingContext } from '@/context/SettingContext';
import { TaskContext } from '@/context/TaskContext';
import { useAppColors } from '@/context/ThemeContext';
import CategoryData, { CATEGORIES_ARRAY } from '@/data/CategoryData';
import PriorityData, { PRIORITIES_ARRAY } from '@/data/PriorityData';
import { StatusData } from '@/data/StatusData';
import { setData } from '@/store/setData';
import { openFile, shareFileWithCustomName } from '@/utils/fileUtils';
import { checkPermissions, createNotification, deletelNotification } from '@/utils/notificationUtils';
import { deleteTask, getNewTask } from '@/utils/taskUtils';
import { getFormatedDay, notifyMessage } from '@/utils/utils';
import BottomSheet, { BottomSheetMethods } from '@expo/ui/community/bottom-sheet';
import DateTimePicker, { DateTimePickerChangeEvent } from '@expo/ui/community/datetime-picker';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import { Redirect, router, useLocalSearchParams, useNavigation } from "expo-router";
import { RefObject, startTransition, use, useEffect, useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, Vibration, View } from "react-native";

type DateTimePickerMode = "date" | "time";

const physicalDeleteFiles = async (uris: string[]) => {
  if (uris.length === 0) return;
  try {
    await Promise.all(
      uris.map(async (uri) => {
        const fileInstance = new File(uri);
        if (fileInstance.exists) {
          await fileInstance.delete();
        }
      })
    );
  } catch (error) {
    console.error("Ошибка при физической зачистке файлов:", error);
  }
};

const getSafeDateForPicker = (originalDate: Date) => {
  const safeDate = new Date(originalDate);
  safeDate.setHours(12, 0, 0, 0);
  return safeDate;
};

const TaskCardScreen = () => {
  const { todoID, day } = useLocalSearchParams();

  const { task, setTask } = use(TaskContext);
  const { defaultCategory, defaultPriority, defaultTime, defaultNotify } = use(SettingContext);

  const colors = useAppColors();
  const [emptyTitle, setEmptyTitle] = useState(false);
  const navigation = useNavigation();

  const initialTask = todoID === 'new'
    ? getNewTask(day as string, defaultCategory, defaultPriority, defaultTime, defaultNotify)
    : task.find((item: TTask) => item.id === todoID);

  const [currTask, setCurrentTask] = useState<TTask | undefined>(initialTask);

  // Изолированные локальные стейты для мгновенного ввода без лагов экрана
  const [localTitle, setLocalTitle] = useState(currTask?.title || '');
  const [localNotes, setLocalNotes] = useState(currTask?.notes || '');

  // Синхронизация локального текста с основным объектом задачи при изменении
  useEffect(() => {
    setCurrentTask(prev => prev ? { ...prev, title: localTitle } : undefined);
  }, [localTitle]);

  useEffect(() => {
    setCurrentTask(prev => prev ? { ...prev, notes: localNotes } : undefined);
  }, [localNotes]);

  const originalTaskRef = useRef<string>(JSON.stringify(initialTask));

  const categorySheetRef = useRef<BottomSheet>(null);
  const prioritySheetRef = useRef<BottomSheet>(null);
  const sheetFilesRef = useRef<BottomSheet>(null);

  const filesToDeleteRef = useRef<string[]>([]);
  const addedFilesRef = useRef<string[]>([]);
  
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<DateTimePickerMode | undefined>('date');

  if (!currTask) {
    return <Redirect href="/" />;
  }

  // Глобальный перехват ЛЮБОГО закрытия карточки задачи
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Если пользователь нажал "Готово" или "Удалить", мы уже очистили рефы в тех функциях.
      // В этом случае просто разрешаем нативному экрану закрыться.
      if (addedFilesRef.current.length === 0 && filesToDeleteRef.current.length === 0) {
        return;
      }

      // Если же закрытие произошло через свайп, тап по фону, кнопку "Назад" или handleClose():
      // 1. Приостанавливаем нативное закрытие на долю секунды
      e.preventDefault();

      // 2. В фоновом режиме зачищаем временные файлы отмены
      startTransition(async () => {
        try {
          const currentTaskUris = currTask?.files.map(f => f.uri) || [];
          const filesToClean = addedFilesRef.current.filter(uri => currentTaskUris.includes(uri));

          if (filesToClean.length > 0) {
            await physicalDeleteFiles(filesToClean);
          }
        } catch (error) {
          console.error("Ошибка при авто-очистке файлов:", error);
        } finally {
          // Обязательно обнуляем рефы, чтобы гарантировать проход
          addedFilesRef.current = [];
          filesToDeleteRef.current = [];

          // 3. Отпускаем экран — теперь он закрывается нативно
          navigation.dispatch(e.data.action);
        }
      });
    });

    return unsubscribe;
  }, [navigation, currTask]);


  const dateText = currTask.date.toLocaleDateString();
  const timeText = currTask.date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const dataChanged = originalTaskRef.current !== JSON.stringify(currTask) && todoID !== 'new';
  const showMode = (currentMode: DateTimePickerMode | undefined) => {
    setMode(currentMode);
    setShow(true);
  };

  const handleNotify = () => {
    setCurrentTask(prev => prev ? { ...prev, sendNotify: !prev.sendNotify } : undefined);
  };

  const changePriority = (key: string) => {
    setCurrentTask(prev => prev ? { ...prev, priority: PriorityData[key] } : undefined);
  };

  const changeCategory = (key: string) => {
    setCurrentTask(prev => prev ? { ...prev, category: CategoryData[key] } : undefined);
  };

  const setSheetRef = (ref: RefObject<BottomSheetMethods | null>, index: number) => {
    ref.current?.snapToIndex(index);
  };

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleDone = async () => {
    if (!currTask.date || !localTitle.trim()) {
      setEmptyTitle(true);
      notifyMessage('Заполните название задачи');
      Vibration.vibrate(50);
      return;
    }

    // 1. Мгновенно запускаем закрытие (анимацию ухода шторки вниз)
    handleClose(); 

    // 2. Все тяжелые операции убираем во второстепенный поток рендеринга
    startTransition(async () => {
      try {
        await refreshNotify();
        
        if (filesToDeleteRef.current.length > 0) {
          await physicalDeleteFiles(filesToDeleteRef.current);
          filesToDeleteRef.current = [];
        }
        addedFilesRef.current = []; 

        const resArray = (todoID === 'new')
          ? [...task, currTask]
          : task.map((item: TTask) => item.id === todoID ? currTask : item);

        const sortedArray = [...resArray].sort((first, second) => first.date.getTime() - second.date.getTime());

        setTask(sortedArray);
        setData("todo", JSON.stringify(sortedArray));
        notifyMessage('Данные успешно сохранены!');
      } catch (error) {
        console.error("Ошибка при сохранении:", error);
      }
    });
  };

  const handleDelete = async () => {
    try {
      Vibration.vibrate(70);
      // Мгновенное закрытие экрана перед удалением
      handleClose();      

      startTransition(async () => {
        const urisToDelete = new Set<string>();

        currTask?.files?.forEach((fileData: TFileDataObject) => {
          if (fileData.uri) urisToDelete.add(fileData.uri);
        });

        addedFilesRef.current.forEach((uri) => {
          if (uri) urisToDelete.add(uri);
        });

        if (urisToDelete.size > 0) {
          await physicalDeleteFiles(Array.from(urisToDelete));
        }

        addedFilesRef.current = [];
        filesToDeleteRef.current = [];

        if (todoID !== 'new') {
          if (currTask.notifyId) {
            await deletelNotification(currTask.notifyId);
          }
          deleteTask(currTask.id, task, setTask);
        }
      });
    } catch (error) {
      notifyMessage("Произошла ошибка при удалении данных");
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: false,
        copyToCacheDirectory: false
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const pickedFile = result.assets[0];
      const sourceFile = new File(pickedFile.uri);
      const timestamp = Date.now();
      const permanentFileName = `${timestamp}_${pickedFile.name}`;
      const destinationFile = new File(Paths.document, permanentFileName);

      await sourceFile.copy(destinationFile);
      addedFilesRef.current.push(destinationFile.uri);

      setCurrentTask(prev => {
        if (!prev) return undefined;
        return {
          ...prev,
          files: [
            ...prev.files,
            {
              id: pickedFile.name + new Date().toISOString(),
              name: pickedFile.name,
              size: pickedFile.size || 0,
              uri: destinationFile.uri
            }
          ]
        };
      });

    } catch (error) {
      notifyMessage("Ошибка при попытке выбора и сохранения файла");
    }
  };

  const deleteFile = (id: string) => {
    const fileToPendingDelete = currTask?.files.find((item: TFileDataObject) => item.id === id);

    if (fileToPendingDelete?.uri) {
      filesToDeleteRef.current.push(fileToPendingDelete.uri);
    }

    setCurrentTask(prev => {
      if (!prev) return undefined;
      return {
        ...prev,
        files: prev.files.filter((item: TFileDataObject) => item.id !== id)
      };
    });
  };

  const handleShareFile = (uri: string, fileName: string) => {
    shareFileWithCustomName(uri, fileName);
  };

  const handleOpenFile = (uri: string) => {
    openFile(uri);
  };

  const changeDate = (event: DateTimePickerChangeEvent, selectedDate?: Date) => {
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
  };

  const refreshNotify = async () => {
    if (currTask.notifyId) {
      await deletelNotification(currTask.notifyId)
    }
    if (!currTask.sendNotify) {
      //setCurrentTask({ ...currTask, notifyId: '' })
      setCurrentTask(prev => prev ? { ...prev, notifyId: '' } : undefined);
      return;
    }

    if (currTask.status.id !== StatusData.Completed.id) {
      const finalStatus = await checkPermissions();
      // if (finalStatus !== 'granted') {
      //   notifyMessage('Уведомления от приложения отключены!');
      // }
      let notId = '';
      if (finalStatus === 'granted')
        notId = await createNotification('Пора выполнить задачу!', currTask.title, currTask.date)
      setCurrentTask(prev => prev ? { ...prev, notifyId: notId } : undefined);
    }
  };
  return (
    <View style={[styles.rootContainer, { backgroundColor: colors.containerBg }]}>
      {/* СЕРЫЙ ГРАББЕР-РАЗДЕЛИТЕЛЬ ДЛЯ FORMSHEET */}
      <View style={styles.grabberContainer}>
        <View style={styles.grabber} />
      </View>

      <ScreenHeader
        title="Задача"
        onCancel={handleClose}
        onDone={handleDone}
        titleColor={colors.titleText}
        actionColor={colors.fabBg}
      />
      
      <View style={styles.dataChangeContainer}>
        <Text style={styles.dataChangeText}>{dataChanged ? 'Имеются несохраненные изменения' : ''}</Text>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <TextInput
            style={[
              styles.titleInput,
              { backgroundColor: colors.cardBg, color: colors.titleText, borderColor: colors.borderColor }, 
              emptyTitle && !localTitle && styles.titleInputEmpty
            ]}
            value={localTitle}
            onChangeText={setLocalTitle}
            placeholder="Название задачи"
            placeholderTextColor={colors.metaText}
          />

          <View style={[styles.rowsContainer, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <CardRow
                  title="Дата"
                  text={dateText}
                  icon="calendar"
                  iconColor={colors.titleText}
                  onPress={() => showMode('date')}
                />
              </View>
              <View style={{ flex: 1 }}>
                <CardRow
                  title="Время"
                  text={timeText}
                  icon='clock-outline'
                  iconColor={colors.titleText}
                  onPress={() => showMode('time')}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <CardRow
                  title="Категория"
                  text={currTask.category.name.ru || 'Нет'}
                  icon={currTask.category.icon}
                  iconColor={currTask.category.color}
                  onPress={() => setSheetRef(categorySheetRef, 0)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <CardRow
                  title="Приоритет"
                  text={currTask.priority.name.ru || 'Нет'}
                  icon="flag"
                  iconColor={currTask.priority?.color || colors.titleText}
                  onPress={() => setSheetRef(prioritySheetRef, 0)}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <CardRow
                  title='Уведомление'
                  text={currTask.sendNotify ? 'Включено' : 'Выключено'}
                  icon={currTask.sendNotify ? 'bell-ring-outline' : 'bell-off-outline'}
                  iconColor={colors.titleText}
                  iconRigth={currTask.sendNotify ? 'check-circle-outline' : 'checkbox-blank-circle-outline'}
                  onPress={handleNotify}
                />
              </View>
              <View style={{ flex: 1 }}>
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

          {show && (
            <DateTimePicker
              value={mode === "date" ? getSafeDateForPicker(currTask.date) : currTask.date}
              mode={mode}
              is24Hour={true}
              locale='ru_RU'
              onValueChange={changeDate}
              onDismiss={() => setShow(false)} 
            />
          )}

          <TextInput
            style={[styles.cardInput, { backgroundColor: colors.cardBg, borderColor: colors.borderColor, color: colors.titleText }]}
            value={localNotes}
            onChangeText={setLocalNotes}
            placeholder="Добавьте детали или описание задачи..."
            placeholderTextColor={colors.metaText}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />

          {todoID !== 'new' && (
            <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', marginBottom: 20 }}>
              <Pressable style={styles.deleteButton} onPress={handleDelete}>
                <MaterialDesignIcons name={'trash-can-outline'} color="white" size={24} />
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
      </TouchableWithoutFeedback>
    </View>
  );
};

export default TaskCardScreen;

const styles = StyleSheet.create({
  rootContainer: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  container: {
    width: '100%',
  },
  dataChangeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  dataChangeText: {
    color: "#EA580C",
    fontSize: 12
  },
  titleInput: {
    fontSize: 18,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    width: '100%',
    borderWidth: 2
  },
  titleInputEmpty: {
    borderColor: '#E11D48',
  },
  rowsContainer: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#E11D48',
    paddingHorizontal: 45,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row'
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardInput: {
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 2,
    padding: 12,
    minHeight: 100,
    width: '100%',
    marginBottom: 15,
  },
  grabberContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  grabber: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    opacity: 0.5,
    backgroundColor: '#CCCCCC'
  },  
});
