import CategoryBottomSheet from '@/components/bottomSheet/CategoryBottomSheet';
import FilesBottomSheet from '@/components/bottomSheet/FilesBottomSheet';
import PriorityBottomSheet from '@/components/bottomSheet/PriorityBottomSheet';
import CardRow from '@/components/CardRow';
import { Context } from '@/context/context';
import CategoryData from '@/data/CategoryData';
import PriorityData from '@/data/PriorityData';
import { StatusData } from '@/data/StatusData';
import { setData } from '@/store/setData';
import { openFile, shareFile } from '@/utils/fileUtils';
import { checkPermissions, createNotification, deletelNotification } from '@/utils/notificationUtils';
import { deleteTask, getNewTask } from '@/utils/taskUtils';
import { TFileDataObject, TTask } from '@/utils/types';
import { notifyMessage } from '@/utils/utils';
import BottomSheet, { BottomSheetMethods, BottomSheetView } from '@expo/ui/community/bottom-sheet';
import DateTimePicker, { DateTimePickerChangeEvent } from '@expo/ui/community/datetime-picker';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import * as DocumentPicker from 'expo-document-picker';
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { RefObject, useContext, useRef, useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, Vibration, View } from "react-native"; //AppState, 
import { SafeAreaView } from 'react-native-safe-area-context';

type DateTimePickerMode = "date" | "time";

const taskCard = () => {
  const { todoID, day } = useLocalSearchParams();
  const { task, setTask, defaultCategory, defaultPriority, defaultTime } = useContext(Context);
  const [currTask, setCurrentTask] = useState(todoID === 'new' ? getNewTask(day as string, defaultCategory as string, defaultPriority as string, defaultTime) : task.find((item: TTask) => item.id === todoID))
  const [originalTask, setOriginalTask] = useState(JSON.stringify(currTask))
  //BottomSheets
  const sheetRef = useRef<BottomSheet>(null);
  const sheetCategoryRef = useRef<BottomSheet>(null);
  const sheetPriorityRef = useRef<BottomSheet>(null);
  const sheetFilesRef = useRef<BottomSheet>(null);
  // Picker
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<DateTimePickerMode | undefined>('date');
  const [focused, setFocused] = useState('')

  if (!currTask) {
    return <Redirect href="/list" />;
  }

  let date = currTask.date ? currTask.date.toLocaleDateString() : 'Пусто';
  let time = currTask.date ? currTask.date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : 'Пусто';
  let dataChanged = (originalTask !== JSON.stringify(currTask) && todoID !== 'new')

  const showMode = (currentMode: DateTimePickerMode | undefined) => {
    setMode(currentMode);
    setShow(true);
  };

  const showDatepicker = (currentMode: DateTimePickerMode) => {
    showMode(currentMode);
  };

  const changeTitle = (newTitle: string) => {
    setCurrentTask({ ...currTask, title: newTitle })
  }

  const changeStatus = () => {
    const newStatus = (currTask.status.id === StatusData.Upcoming.id) ? StatusData.Completed : StatusData.Upcoming;
    setCurrentTask({ ...currTask, status: newStatus })
  }

  const changePriority = (key: string) => {
    setCurrentTask({ ...currTask, priority: PriorityData[key] })
  }

  const changeCategory = (key: string) => {
    setCurrentTask({ ...currTask, category: CategoryData[key] })
  }

  const changeNotes = (newNotes: string) => {
    setCurrentTask({ ...currTask, notes: newNotes })
  }

  const handleBack = async () => {
    //sheetRef.current?.snapToIndex(-1)
    setSheetRefIndex(sheetRef, -1)
  }

  const handleDone = async () => {

    if (!currTask.date || !currTask.title) {
      Vibration.vibrate(50)
      return;
    }
    const finalStatus = await checkPermissions() ;
    if (finalStatus !== 'granted') {
      notifyMessage('Уведомления от приложения отключены!');
    }
    const resArray = (todoID === 'new') ? [...task, currTask] : task.map((item: TTask) => { return (item.id === todoID) ? currTask : item });
    const sortedArray = resArray.sort((first: TTask, second: TTask) => { return (first.date.getTime() - second.date.getTime()) })
    setTask(sortedArray)
    setData("todo", JSON.stringify(sortedArray))
    notifyMessage('Данные успешно сохранены!')
    handleBack()
  }

  const handleDelete = async () => {
    if (todoID !== 'new')
      deleteTask(currTask.id, task, setTask)
    Vibration.vibrate(70)
    handleBack()
  }

  const handleClose = () => {
    if (router.canGoBack())
      router.back()
    else
      router.push('/index')
  }

  const setSheetRefIndex = (ref: RefObject<BottomSheetMethods | null>, index: number) => {
    ref.current?.snapToIndex(index)    
  }

  //'#63B4FF'
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Фильтруем только PDFapplication/pdf
        multiple: false, // Разрешаем выбрать один файл
        copyToCacheDirectory: true
      });
      if (result.canceled === false) {
        setCurrentTask({ ...currTask, files: [...currTask.files, { id: result.assets[0].name + (new Date().toISOString()), name: result.assets[0].name, size: result.assets[0].size, uri: result.assets[0].uri }] })
      }
    } catch (error) {
      notifyMessage("Ошибка при попытке выбора файла")
    }
  };

  const handleShareFile = (uri: string) => {
    shareFile(uri)
  }

  const deleteFile = async(id: string, uri: string) => {
    if(currTask.notifyId)
      await deletelNotification(currTask.notifyId)  
    setCurrentTask({ ...currTask, files: [...currTask.files.filter((item: TFileDataObject) => item.id !== id)] })
  }

  const handleOpenFile = (uri: string) => {
    openFile(uri)
  }
  
  const changeDate = async (event: DateTimePickerChangeEvent, selectedDate: Date) => {
    let time = [currTask.date.getHours(), currTask.date.getMinutes()]
    var res = (mode === 'date') ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), time[0], time[1]) : selectedDate;
    let notId = '';
    //setCurrentTask({ ...currTask })
    alert(currTask.notifyId)
    alert(JSON.stringify(currTask.notifyId))
    try{
      if(currTask.notifyId)
      { 
        await deletelNotification(currTask.notifyId)
      }
      
      notId = await createNotification('Пора выполнить задачу!', currTask.title, res)      
    }
    catch(e)
    {
      alert("Ошибка при создании уведомления!")
      alert(e)
    }
    setCurrentTask({ ...currTask, date: res, notifyId: notId})
    setShow(false);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1 }}>
        <BottomSheet
          ref={sheetRef}
          index={0}
          onClose={handleClose}
          enablePanDownToClose
          backgroundStyle={{ backgroundColor: '#031F2B', }}
        >
          <BottomSheetView style={{ flex: 1, backgroundColor: '#031F2B', paddingHorizontal: 10 }}>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5, }}>
              <Pressable onPress={handleBack} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Text style={{ color: "silver", fontSize: 16, fontWeight: 'bold' }}>Отмена</Text>
              </Pressable>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Задача</Text>
              <Pressable onPress={handleDone} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Text style={{ color: "#63B4FF", fontSize: 16, fontWeight: 'bold' }}>Готово</Text>
              </Pressable>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#ffb900', fontSize: 12, }}>{dataChanged ?'Имеются несохраненные изменения' : ''}</Text>
            </View>
            {show && (
              <DateTimePicker
                mode={mode}
                locale='ru_RU'
                presentation="dialog"              
                value={currTask.date ? currTask.date : new Date()}
                onValueChange={(event, selectedDate) => changeDate(event, selectedDate)}
                onDismiss={() => {
                  setShow(false);
                }}
              />)
            }
            <View style={{ flexDirection: 'column', width: '100%', gap: 5, marginVertical: 15 }}>
              <TextInput
                style={[styles.card_input, { borderColor: focused == 'Title' ? 'silver' : currTask.title ? '#263238' : '#E11D48' }]}
                onFocus={() => setFocused('Title')}
                onBlur={() => setFocused('')}
                onChangeText={(text) => changeTitle(text)}
                placeholder={'Заголовок... ( не более 40 символов )'}
                placeholderTextColor={'gray'}
                value={currTask.title}
                //autoFocus={true} 
                maxLength={40}
              />
              <CardRow
                title='День'
                text={date}
                icon={'calendar-month-outline'}
                iconBackColor={'#263238'}
                iconColor={currTask.date ? 'white' : '#E11D48'}
                onPress={() => showDatepicker('date')}
              />
              <CardRow
                title='Время'
                text={time}
                icon={'clock'}
                iconBackColor={'#263238'}
                iconColor={'white'}
                onPress={() => showDatepicker('time')}
              />
              <CardRow
                title='Приоритет'
                text={currTask.priority.name.ru}
                icon={currTask.priority.icon}
                iconBackColor={currTask.priority.color}
                iconColor={'white'}
                onPress={() => setSheetRefIndex(sheetPriorityRef, 0)}
              />
              <CardRow
                title='Категория'
                text={currTask.category.name.ru}
                icon={currTask.category.icon}
                iconBackColor={currTask.category.backColor}
                iconColor={currTask.category.color}
                onPress={() => setSheetRefIndex(sheetCategoryRef, 0)}
              />
              <CardRow
                title='Статус'
                text={currTask.status.name.ru}
                icon={currTask.status.icon}
                iconBackColor={'#263238'}
                iconColor={currTask.status.color}
                onPress={changeStatus}
              />
              <CardRow
                title='Файлы'
                text={'' + currTask.files.length}
                icon={'file'}
                iconBackColor={'#263238'}
                iconColor={'white'}
                onPress={() => setSheetRefIndex(sheetFilesRef, 0)}
              />
              <TextInput
                style={[styles.card_input, { height: 100, borderColor: focused == 'Notes' ? 'silver' : '#263238', marginBottom: 10 }]}
                onFocus={() => setFocused('Notes')}
                onBlur={() => setFocused('')}
                onChangeText={(text) => changeNotes(text)}
                placeholder={'Примечание...'}
                placeholderTextColor={'gray'}
                value={currTask.notes}
                multiline={true}
                textAlignVertical='top'
              />
              <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', marginBottom: 20 }}>
                <Pressable
                  style={{ backgroundColor: '#263238', padding: 10, borderRadius: 15, width: '60%', justifyContent: 'center', alignItems: 'center' }}
                  onPress={handleDelete}>
                  <MaterialDesignIcons name={'trash-can-outline'} color={"red"} size={34} />
                </Pressable>
              </View>
            </View>
            <CategoryBottomSheet
              currentId={currTask.category.id}
              setValue={changeCategory}
              setRef={setSheetRefIndex}
              sheetRef={sheetCategoryRef}
            />
            <PriorityBottomSheet
              currentId={currTask.priority.id}
              setValue={changePriority}
              setRef={setSheetRefIndex}
              sheetRef={sheetPriorityRef}
            />
            <FilesBottomSheet
              files={currTask.files}
              addFile={pickDocument}
              deleteFile={deleteFile}
              sheetRef={sheetFilesRef}
              shareFile={handleShareFile}
              openFile={handleOpenFile}
            />
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

export default taskCard

const styles = StyleSheet.create({
  card_input: {
    fontSize: 16,
    color: 'white',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 10
  }
});
