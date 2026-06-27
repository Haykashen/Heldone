import { Context } from '@/context/context';
import Categorys from '@/data/Category';
import TaskStatus from '@/data/TaskStatus';
import { TTask } from '@/utils/types';
import DateTimePicker from '@expo/ui/community/datetime-picker';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native"; //AppState, 
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type DateTimePickerMode = "date"| "time"; 

const taskCard = () => {
  const { todoID } = useLocalSearchParams();
  const { task, setTask } = useContext(Context);
  const [currTask, setCurrentTask] = useState(task.find((item:TTask)=> item.id === todoID))
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<DateTimePickerMode | undefined >('date');

   const showMode = (currentMode:DateTimePickerMode | undefined) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  let datetime = currTask? currTask.date.toLocaleDateString()+' '+currTask.date.toLocaleTimeString():new Date().toLocaleTimeString();



  useEffect(() => {

  }, [])

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
    ////router.back()
    //router.push('/tabHome')
  }  

  const handleDone = async()=>{
    //let resArray = task.map((item:TTask)=>{ return (item.id === todoID)? currTask:item})
   // setTask(resArray.sort((first:TTask, second:TTask)=> {return (first.date.getTime() - second.date.getTime())}))  )
    handleBack()
  }

  const handleDelete = async() => {
    //deleteTask(currTask.id, task, setTask)
    handleBack()
  }
  if(!currTask)
    return(
    <View>
      <Text>!currTask</Text>
    </View>
    )
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ display: 'flex', flexDirection: 'column', maxWidth: 600, width: '100%', gap: 10, paddingHorizontal: 5 }}>
          {show && (
            <DateTimePicker
              accentColor='red'
              value={date}
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
              mode={mode}
              presentation="dialog"
            />
          )}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <Pressable onPress={showDatepicker} style={{ flexDirection: 'row', borderColor: 'silver', borderWidth: 2, borderRadius: 10, paddingHorizontal: 5, paddingVertical: 10 }}>
              <Text style={{color:'white'}}>{datetime}</Text>
              <MaterialDesignIcons name='calendar-month-outline' color={'white'} size={24} />
            </Pressable>
            <Pressable onPress={changeStatus} style={{ flexDirection: 'row', borderColor: 'silver', borderWidth: 2, borderRadius: 10, paddingHorizontal: 5, paddingVertical: 10 }}>
              <Text style={{color:'white'}}>{currTask.status.name.ru} </Text>
              <MaterialDesignIcons name={currTask.status.icon as any} color={(currTask.status.color)} size={24} />
            </Pressable>
          </View>
          {/* <CategoryPanel category={currTask.category.name.en} onPressCategory={changeCategory} language={language} /> */}
          <View style={{ flexDirection: 'column', gap: 5, width: '100%', height: 50 }}>
            <TextInput onChangeText={(text) => changeTitle(text)} placeholder={'Title...'} value={currTask.title} autoFocus={true} maxLength={40} />
          </View>
          <View style={{ flexDirection: 'column', gap: 5, width: '100%', height: 300 }}>
            <TextInput onChangeText={(text) => changeNotes(text)} placeholder={'Notes...'} value={currTask.notes} multiline={true} textAlignVertical='top' />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', gap: 30, marginTop: 20 }}>
            <Pressable style={{ backgroundColor: '#263238', padding: 10, borderRadius: 15 }} onPress={handleDelete}>
              <MaterialDesignIcons name={'trash-can-outline'} color={"red"} size={34} />
            </Pressable>
            <Pressable style={{ backgroundColor: '#263238', padding: 10, borderRadius: 15 }} onPress={handleBack}>
              <MaterialDesignIcons name={'arrow-u-left-top'} color={"#ffb900"} size={34} />
            </Pressable>
            <Pressable style={{ backgroundColor: '#263238', padding: 10, borderRadius: 15 }} onPress={handleDone}>
              <MaterialDesignIcons name={'check'} color={"#63B4FF"} size={20} />
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