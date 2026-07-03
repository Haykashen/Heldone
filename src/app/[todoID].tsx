import { Context } from '@/context/context';
import Categorys from '@/data/Category';
import TaskStatus from '@/data/TaskStatus';
import { setData } from '@/store/setData';
import { deleteTask } from '@/utils/taskManage';
import { TTask } from '@/utils/types';
import DateTimePicker from '@expo/ui/community/datetime-picker';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useContext, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native"; //AppState, 
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type DateTimePickerMode = "date"| "time"; 

const taskCard = () => {
  const { todoID } = useLocalSearchParams();
  const { task, setTask } = useContext(Context);
  const [currTask, setCurrentTask] = useState(task.find((item:TTask)=> item.id === todoID))

  if (!currTask) {
    return <Redirect href="/list" />;
  }
  // Picker
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<DateTimePickerMode | undefined >('date');

  const [focused, setFocused] = useState('')

  const showMode = (currentMode:DateTimePickerMode | undefined) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  let datetime = currTask? currTask.date.toLocaleDateString()+' '+currTask.date.toLocaleTimeString():new Date().toLocaleTimeString();

  const changeTitle = (newTitle:string)=>{
    setCurrentTask({...currTask, title: newTitle})
    // setData("todo", JSON.stringify(newTask))
  }

  const changeStatus = ()=>{
    const newStatus = (currTask.status.id === TaskStatus.Upcoming.id) ? TaskStatus.Completed : TaskStatus.Upcoming;
    setCurrentTask({...currTask, status: newStatus})
  }

  const changeCategory= (key:string)=>{
    setCurrentTask({...currTask, category: Categorys[key]})
  }

  const changeNotes = (newNotes:string)=>{
    setCurrentTask({...currTask, notes: newNotes})
  }

  const handleBack = async()=>{
    if(router.canGoBack())
      router.back()
    else
      router.push('/index')
  }  

  const handleDone = async()=>{
    let resArray = task.map((item:TTask)=>{ return (item.id === todoID)? currTask:item})
    setTask(resArray.sort((first:TTask, second:TTask)=> {return (first.date.getTime() - second.date.getTime())}))  
    setData("todo", JSON.stringify(resArray))
    handleBack()
  }

  const handleDelete = async() => {
    deleteTask(currTask.id, task, setTask)
    handleBack()
  }


  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#031F2B', justifyContent: 'center', alignItems: 'center', maxWidth: 600 }}>
        <View style={{width:'100%', flexDirection: 'row', marginTop: 10, paddingHorizontal: 5 , justifyContent: 'space-between' }}>
          <Pressable onPress={handleBack} style={{flexDirection:'row', alignItems: 'center'}}>
            <MaterialDesignIcons name={'arrow-left-thin'} color={"#ffb900"} size={34} />
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Отмена</Text>
          </Pressable>
          <Text  style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Задача</Text>
          <Pressable onPress={handleDone} style={{flexDirection:'row', alignItems: 'center'}}>
            <MaterialDesignIcons name={'check'} color={"#63B4FF"} size={20} />  
            <Text  style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Готово</Text>
          </Pressable>
        </View>
        <View style={{flexDirection: 'column', width: '100%', gap: 10, paddingHorizontal: 5 }}>
          {show && (
            <DateTimePicker
              accentColor='red'
              mode={mode}
              presentation="dialog"              
              value={currTask.date}
              onValueChange={(event, selectedDate) => {
                setCurrentTask({ ...currTask, date: selectedDate })
                if (mode === 'time')
                  setShow(false);
                else if (mode === 'date')
                  showMode('time');//platform === 'ios' Hide immediately on iOS             
              }}
              onDismiss={() => {
                setShow(false);
              }}
            />
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <Pressable 
              onPress={showDatepicker} 
              style={{ flexDirection: 'row', borderColor: 'silver', borderWidth: 2, borderRadius: 10, paddingHorizontal: 5, paddingVertical: 10 }}>
              <Text style={{ color: 'white' }}>{datetime}</Text>
              <MaterialDesignIcons name='calendar-month-outline' color={'white'} size={24} />
            </Pressable>
            <Pressable 
              onPress={changeStatus} 
              style={{ flexDirection: 'row', borderColor: 'silver', borderWidth: 2, borderRadius: 10, paddingHorizontal: 5, paddingVertical: 10 }}>
              <Text style={{ color: 'white' }}>{currTask.status.name.ru} </Text>
              <MaterialDesignIcons name={currTask.status.icon as any} color={(currTask.status.color)} size={24} />
            </Pressable>
          </View>
          {/* <CategoryPanel category={currTask.category.name.en} onPressCategory={changeCategory} language={language} /> */}
          <View style={{ flexDirection: 'column', gap: 5, width: '100%', height: 50 }}>
            <TextInput 
              style={{color:'white', borderColor: focused=='Title'? '#63B4FF' : 'silver', borderWidth: 2, borderRadius: 10, paddingHorizontal: 5, paddingVertical: 10 }} 
              onFocus={()=>setFocused('Title')}
              onChangeText={(text) => changeTitle(text)} 
              placeholder={'Title...'} 
              placeholderTextColor={'gray'}
              value={currTask.title} 
              autoFocus={true} 
              maxLength={40} 
            />
          </View>
          <View style={{ flexDirection: 'column', gap: 5, width: '100%', height: 300 }}>
            <TextInput 
              style={{color:'white', borderColor: focused=='Notes'? '#63B4FF' : 'silver', borderWidth: 2, borderRadius: 10, paddingHorizontal: 5, paddingVertical: 10 }} 
              onFocus={()=>setFocused('Notes')}
              onChangeText={(text) => changeNotes(text)} 
              placeholder={'Notes...'} 
              placeholderTextColor={'gray'}
              value={currTask.notes} 
              multiline={true} 
              textAlignVertical='top' />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', marginTop: 20}}>
            <Pressable 
              style={{ backgroundColor: '#263238', padding: 10, borderRadius: 15, width:'60%', justifyContent: 'center', alignItems:'center'  }} 
              onPress={handleDelete}>
              <MaterialDesignIcons name={'trash-can-outline'} color={"red"} size={34} />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default taskCard


const style = (Theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bg_Primary,
    alignItems: 'center',
    gap: 5,
    padding: 5
  },
  textHeader: {
    color: Theme.colors.text_Primary,
    fontSize: 22,
    fontWeight: 'bold'
  },
  text: {
    fontSize: 16,
    color: Theme.colors.text_Secondary
  },
  row:{ 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%' 
  }
});