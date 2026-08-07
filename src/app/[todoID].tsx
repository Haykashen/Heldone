//import CategoryPanel from '@/components/CategoryPanel';
import CategoryBottomSheet from '@/components/bottomSheet/CategoryBottomSheet';
import FilesBottomSheet from '@/components/bottomSheet/FilesBottomSheet';
import PriorityBottomSheet from '@/components/bottomSheet/PriorityBottomSheet';
import CardRow from '@/components/CardRow';
import { Context } from '@/context/context';
import CategoryData from '@/data/CategoryData';
import PriorityData from '@/data/PriorityData';
import TaskStatus from '@/data/StatusData';
import { setData } from '@/store/setData';
import { deleteTask } from '@/utils/taskManage';
import { TFileDataObject, TTask } from '@/utils/types';
import { getNewTask } from '@/utils/utils';
import BottomSheet, { BottomSheetMethods, BottomSheetView } from '@expo/ui/community/bottom-sheet';
import DateTimePicker from '@expo/ui/community/datetime-picker';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import * as DocumentPicker from 'expo-document-picker';
import { Redirect, router, useLocalSearchParams } from "expo-router";
import * as Sharing from 'expo-sharing';
import { RefObject, useContext, useRef, useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, Vibration, View } from "react-native"; //AppState, 
import { SafeAreaView } from 'react-native-safe-area-context';

type DateTimePickerMode = "date"| "time"; 

const taskCard = () => {
  const { todoID, day } = useLocalSearchParams();
  const { task, setTask, defaultCategory, defaultPriority, defaultTime } = useContext(Context);
  const [currTask, setCurrentTask] = useState(todoID === 'new'? getNewTask(day as string, defaultCategory as string, defaultPriority as string, defaultTime): task.find((item:TTask)=> item.id === todoID))
  const sheetRef = useRef<BottomSheet>(null);
  const sheetCategoryRef = useRef<BottomSheet>(null);
  const sheetPriorityRef = useRef<BottomSheet>(null);
  const sheetFilesRef = useRef<BottomSheet>(null);

  if (!currTask) {
    return <Redirect href="/list" />;
  }
  // Picker
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<DateTimePickerMode | undefined >('date');

  const [focused, setFocused] = useState('')

  const showMode = (currentMode:DateTimePickerMode | undefined) => {
    setMode(currentMode);
    setShow(true);
  };

  const showDatepicker = (currentMode:DateTimePickerMode) => {
    showMode(currentMode);
  };

  let date = currTask.date? currTask.date.toLocaleDateString():'Пусто';
  let time = currTask.date? currTask.date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'}):'Пусто';

  const changeTitle = (newTitle:string)=>{
    setCurrentTask({...currTask, title: newTitle})
  }

  const changeStatus = ()=>{
    const newStatus = (currTask.status.id === TaskStatus.Upcoming.id) ? TaskStatus.Completed : TaskStatus.Upcoming;
    setCurrentTask({...currTask, status: newStatus})
  }

  const changePriority = (key:string)=>{
    setCurrentTask({...currTask, priority: PriorityData[key]})
  }

  const changeCategory = (key:string)=>{
    setCurrentTask({...currTask, category: CategoryData[key]})
  }

  const changeNotes = (newNotes:string)=>{
    setCurrentTask({...currTask, notes: newNotes})
  }

  const handleBack = async()=>{
    sheetRef.current?.snapToIndex(-1)
  }  

  const handleDone = async()=>{

    if(!currTask.date || !currTask.title)
    {
      Vibration.vibrate(50)
      return;
    }  

    const resArray = (todoID === 'new') ? [...task, currTask] : task.map((item:TTask)=>{ return (item.id === todoID)? currTask:item});  
    const sortedArray = resArray.sort((first:TTask, second:TTask)=> {return (first.date.getTime() - second.date.getTime())})
    setTask(sortedArray)  
    setData("todo", JSON.stringify(sortedArray))
    handleBack()
  }

  const handleDelete = async() => {
    if(todoID !== 'new')
      deleteTask(currTask.id, task, setTask)
    Vibration.vibrate(70)
    handleBack()
  }

  const handleClose = ()=>{
     if(router.canGoBack())
       router.back()
     else
       router.push('/index')
  }

  const setRefCategoryBottomSheet =(ref:RefObject<BottomSheetMethods | null>, index: number)=>{
    ref.current?.snapToIndex(index)
  }

  const setRefPriorityBottomSheet =(ref:RefObject<BottomSheetMethods | null>, index: number)=>{
    ref.current?.snapToIndex(index)
  }  

  const setRefFilesBottomSheet =(ref:RefObject<BottomSheetMethods | null>, index: number)=>{
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
    //console.log('result :', result);
    if (result.canceled === false) {
      console.log('result.assets :', result.assets);
      setCurrentTask({...currTask, files: [...currTask.files, {id:result.assets[0].name+(new Date().toISOString()),name:result.assets[0].name, size:result.assets[0].size, uri:result.assets[0].uri}]}) 
    }
  } catch (error) {
    console.error('Ошибка:', error);
  }
};

const openFile = async(uri:string) =>{
  console.log('Sharing uri = ', uri)
  if(await Sharing.isAvailableAsync())
  {
   console.log('Sharing.isAvailableAsync() = true')
   Sharing.shareAsync(uri).then(result => {
     console.log('Sharing result = ', result)
 });    
  }
  else{
    alert("!Sharing.isAvailable") 
  }
     
}

const deleteFile = (id:string)=>{
  setCurrentTask({...currTask, files: [...currTask.files.filter((item:TFileDataObject) => item.id !== id)]})
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
            {show && (
              <DateTimePicker
                mode={mode}
                locale='ru_RU'
                presentation="dialog"
                value={currTask.date ? currTask.date : new Date()}
                onValueChange={(event, selectedDate) => {
                  var resss = (mode === 'date') ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()) : selectedDate;
                  setCurrentTask({ ...currTask, date: resss })
                  setShow(false);
                }}
                onDismiss={() => {
                  setShow(false);
                }}
              />)
            }
            <View style={{ flexDirection: 'column', width: '100%', gap: 5, marginVertical: 15 }}>
              <TextInput
                style={[styles.card_input, {borderColor: focused == 'Title' ? 'silver' : currTask.title ? '#263238' : '#E11D48'}]}
                onFocus={() => setFocused('Title')}
                onBlur={() => setFocused('')}
                onChangeText={(text) => changeTitle(text)}
                placeholder={'Заголовок...'}
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
                onPress={() => setRefPriorityBottomSheet(sheetPriorityRef, 0)} 
              />
              <CardRow 
                title='Категория' 
                text={currTask.category.name.ru} 
                icon={currTask.category.icon} 
                iconBackColor={currTask.category.backColor} 
                iconColor={currTask.category.color} 
                onPress={() => setRefCategoryBottomSheet(sheetCategoryRef, 0)} 
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
                text={''+currTask.files.length} 
                icon={'file'} 
                iconBackColor={'#263238'}
                iconColor={'white'} 
                onPress={() => setRefFilesBottomSheet(sheetFilesRef, 0)} 
              />              
              <TextInput
                style={[styles.card_input, { height: 100, borderColor: focused == 'Notes' ? 'silver' : '#263238', marginBottom:10}]}
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
              currentId = {currTask.category.id}
              setValue = {changeCategory} 
              setRef = {setRefCategoryBottomSheet} 
              sheetRef = {sheetCategoryRef} 
            />
            <PriorityBottomSheet 
              currentId = {currTask.priority.id}
              setValue = {changePriority} 
              setRef = {setRefPriorityBottomSheet} 
              sheetRef = {sheetPriorityRef} 
            />
            <FilesBottomSheet
             files={currTask.files}
             addFile={pickDocument}
             deleteFile={deleteFile}
             sheetRef={sheetFilesRef}
             openFile={openFile}
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
