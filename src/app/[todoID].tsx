//import CategoryPanel from '@/components/CategoryPanel';
import CategoryBottomSheet from '@/components/bottomSheet/CategoryBottomSheet';
import PriorityBottomSheet from '@/components/bottomSheet/PriorityBottomSheet';
import { Context } from '@/context/context';
import CategoryData from '@/data/CategoryData';
import PriorityData from '@/data/PriorityData';
import TaskStatus from '@/data/StatusData';
import { setData } from '@/store/setData';
import { deleteTask } from '@/utils/taskManage';
import { TTask } from '@/utils/types';
import { getNewTask } from '@/utils/utils';
import BottomSheet, { BottomSheetMethods, BottomSheetView } from '@expo/ui/community/bottom-sheet';
import DateTimePicker from '@expo/ui/community/datetime-picker';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { RefObject, useContext, useRef, useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, Vibration, View } from "react-native"; //AppState, 
import { SafeAreaView } from 'react-native-safe-area-context';

type DateTimePickerMode = "date"| "time"; 

const taskCard = () => {
  const { todoID, day } = useLocalSearchParams();
  const { task, setTask, defaultCategory, defaultPriority } = useContext(Context);
  const [currTask, setCurrentTask] = useState(todoID === 'new'? getNewTask(day as string, defaultCategory as string, defaultPriority as string): task.find((item:TTask)=> item.id === todoID))
  const sheetRef = useRef<BottomSheet>(null);
  const sheetCategoryRef = useRef<BottomSheet>(null);
  const sheetPriorityRef = useRef<BottomSheet>(null);

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
    // if(router.canGoBack())
    //   router.back()
    // else
    //   router.push('/index')
  }  

  const handleDone = async()=>{

    if(!currTask.date || !currTask.title)
    {
      Vibration.vibrate(70)
      return;
    }  

    let resArray = [];
    if(todoID === 'new')
    {
      resArray = [...task, currTask]  
    }  
    else
    {
      resArray = task.map((item:TTask)=>{ return (item.id === todoID)? currTask:item})
    }  
      
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
  //'#63B4FF'
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1 }}>
        <BottomSheet
          ref={sheetRef}
          index={0}
          //snapPoints={['90%', '70%']}
          onClose={handleClose}
          enablePanDownToClose
          backgroundStyle ={{backgroundColor:'#031F2B', }}
        >
          <BottomSheetView style={{ flex: 1, backgroundColor: '#031F2B', paddingHorizontal: 10 }}>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5,}}>
              <Pressable onPress={handleBack} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Text style={{ color: "silver", fontSize: 16, fontWeight: 'bold' }}>Отмена</Text>
              </Pressable>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Задача</Text>
              <Pressable onPress={handleDone} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Text style={{ color: "#63B4FF", fontSize: 16, fontWeight: 'bold' }}>Готово</Text>
              </Pressable>
            </View>
            <View style={{ flexDirection: 'column', width: '100%', gap: 10, marginTop:15 }}>
              {show && (
                <DateTimePicker
                  //style={{backgroundColor:'#031F2B', borderColor:'red', width:70}}
                  //accentColor="#63B4FF"
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
                />
              )}
              <View style={{ flexDirection: 'column', width: '100%', height: 50}}>
                <TextInput
                  style={{ fontSize: 16, color: 'white', borderColor: focused == 'Title' ? 'silver' : currTask.title ? '#263238' : '#E11D48', borderWidth: 2, borderRadius: 10, paddingHorizontal: 5, paddingVertical: 10 }}
                  onFocus={() => setFocused('Title')}
                  onBlur={() => setFocused('')}
                  onChangeText={(text) => changeTitle(text)}
                  placeholder={'Заголовок...'}
                  placeholderTextColor={'gray'}
                  value={currTask.title}
                  //autoFocus={true} 
                  maxLength={40}
                />
              </View>            
              <View style={{ flexDirection:'row', justifyContent:'space-between',alignItems:'center'}}>
                <Text  style={{ color: 'white', fontWeight:'bold', fontSize: 16, }}>Когда</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'center',  gap: 5,}}>
                <Pressable
                  onPress={() => showDatepicker('date')}
                  style={{flexDirection: 'row', alignItems: 'center', justifyContent:'center',  gap: 3,}}>
                  <Text style={{ color: 'white', fontSize: 16, }}>{date}</Text>
                  <MaterialDesignIcons name='calendar-month-outline' color={currTask.date ? 'white' : '#E11D48'} size={24} />
                </Pressable>  
                <Pressable
                  onPress={() => showDatepicker('time')}
                  style={{flexDirection: 'row', alignItems: 'center', justifyContent:'center',  gap: 3,}}>
                  <Text style={{ color: 'white', fontSize: 16, }}>{time}</Text>
                  <MaterialDesignIcons name='clock' color={'white'} size={24} />
                </Pressable>                   
                </View>               
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between',alignItems:'center' }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, }}>Приоритет</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, }}>
                  <Pressable
                    onPress = {()=> setRefPriorityBottomSheet(sheetPriorityRef, 0) }
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 3, }}>
                    <Text style={{ color: 'white', fontSize: 16, }}>{currTask.priority.name.ru}</Text>
                    <MaterialDesignIcons name={currTask.priority.icon as any} color={currTask.priority.color} size={24} />
                  </Pressable>
                </View>
              </View>  
               <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, }}>Категория</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, }}>
                  <Pressable
                    onPress = {()=> setRefCategoryBottomSheet(sheetCategoryRef, 0) }
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 3, }}>
                    <Text style={{ color: 'white', fontSize: 16, }}>{currTask.category.name.ru}</Text>
                    <View style={{backgroundColor:currTask.category.backColor, borderRadius:5, padding:2}}>
                      <MaterialDesignIcons name={currTask.category.icon as any} color={currTask.category.color} size={22} />
                    </View>
                    
                  </Pressable>
                </View>
              </View> 
               <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, }}>Статус</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, }}>
                  <Pressable
                    onPress={changeStatus}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <Text style={{ color: 'white', fontSize: 16, }}>{currTask.status.name.ru} </Text>
                    <MaterialDesignIcons name={currTask.status.icon as any} color={(currTask.status.color)} size={24} />
                  </Pressable>
                </View>
              </View>                                          
              <View style={{ flexDirection: 'column', width: '100%', height: 100 }}>
                <TextInput
                  style={{ fontSize: 16, flex: 1, color: 'white', borderColor: focused == 'Notes' ? 'silver' : '#263238', borderWidth: 2, borderRadius: 10, paddingHorizontal: 5, paddingVertical: 10 }}
                  onFocus={() => setFocused('Notes')}
                  onBlur={() => setFocused('')}
                  onChangeText={(text) => changeNotes(text)}
                  placeholder={'Примечание...'}
                  placeholderTextColor={'gray'}
                  value={currTask.notes}
                  multiline={true}
                  textAlignVertical='top' />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', marginBottom: 20 }}>
                <Pressable
                  style={{ backgroundColor: '#263238', padding: 10, borderRadius: 15, width: '60%', justifyContent: 'center', alignItems: 'center' }}
                  onPress={handleDelete}>
                  <MaterialDesignIcons name={'trash-can-outline'} color={"red"} size={34} />
                </Pressable>
              </View>
            </View>
            <CategoryBottomSheet setCategory={changeCategory} setRef={setRefCategoryBottomSheet} sheetRef = {sheetCategoryRef}/> 
            <PriorityBottomSheet setPriority={changePriority} setRef={setRefPriorityBottomSheet} sheetRef = {sheetPriorityRef}/>
          </BottomSheetView>
        </BottomSheet>
                 
      </SafeAreaView>
    </TouchableWithoutFeedback>
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

//import CategoryPanel from '@/components/CategoryPanel';
// import Priority from '@/components/buttons/Priority';
// import CategoryItem from '@/components/items/CategoryItem';
// import { Context } from '@/context/context';
// import Categorys from '@/data/CategoryData';
// import PriorityData from '@/data/PriorityData';
// import TaskStatus from '@/data/StatusData';
// import { setData } from '@/store/setData';
// import { deleteTask } from '@/utils/taskManage';
// import { TTask } from '@/utils/types';
// import { getNewTask } from '@/utils/utils';
// import BottomSheet, { BottomSheetView } from '@expo/ui/community/bottom-sheet';
// import DateTimePicker from '@expo/ui/community/datetime-picker';
// import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
// import { Redirect, router, useLocalSearchParams } from "expo-router";
// import { useContext, useRef, useState } from "react";
// import { FlatList, Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, Vibration, View } from "react-native"; //AppState, 
// import { SafeAreaView } from 'react-native-safe-area-context';

// type DateTimePickerMode = "date"| "time"; 

// const taskCard = () => {
//   const { todoID, day } = useLocalSearchParams();
//   const { task, setTask, defaultCategory, defaultPriority } = useContext(Context);
//   const [currTask, setCurrentTask] = useState(todoID === 'new'? getNewTask(day as string, defaultCategory as string, defaultPriority as string): task.find((item:TTask)=> item.id === todoID))
//   const sheetRef = useRef<BottomSheet>(null);
   
//   if (!currTask) {
//     return <Redirect href="/list" />;
//   }
//   // Picker
//   const [show, setShow] = useState(false);
//   const [mode, setMode] = useState<DateTimePickerMode | undefined >('date');

//   const [focused, setFocused] = useState('')

//   const showMode = (currentMode:DateTimePickerMode | undefined) => {
//     setMode(currentMode);
//     setShow(true);
//   };

//   const showDatepicker = (currentMode:DateTimePickerMode) => {
//     showMode(currentMode);
//   };

//   let date = currTask.date? currTask.date.toLocaleDateString():'Пусто';
//   let time = currTask.date? currTask.date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'}):'Пусто';

//   const changeTitle = (newTitle:string)=>{
//     setCurrentTask({...currTask, title: newTitle})
//   }

//   const changeStatus = ()=>{
//     const newStatus = (currTask.status.id === TaskStatus.Upcoming.id) ? TaskStatus.Completed : TaskStatus.Upcoming;
//     setCurrentTask({...currTask, status: newStatus})
//   }

//   const changePriority = (key:string)=>{
//     setCurrentTask({...currTask, priority: PriorityData[key]})
//   }

//   const changeCategory= (key:string)=>{
//     setCurrentTask({...currTask, category: Categorys[key]})
//   }

//   const changeNotes = (newNotes:string)=>{
//     setCurrentTask({...currTask, notes: newNotes})
//   }

//   const handleBack = async()=>{
//     sheetRef.current?.snapToIndex(-1)
//     // if(router.canGoBack())
//     //   router.back()
//     // else
//     //   router.push('/index')
//   }  

//   const handleDone = async()=>{

//     if(!currTask.date || !currTask.title)
//     {
//       Vibration.vibrate(70)
//       return;
//     }  

//     let resArray = [];
//     if(todoID === 'new')
//     {
//       resArray = [...task, currTask]  
//     }  
//     else
//     {
//       resArray = task.map((item:TTask)=>{ return (item.id === todoID)? currTask:item})
//     }  
      
//     const sortedArray = resArray.sort((first:TTask, second:TTask)=> {return (first.date.getTime() - second.date.getTime())})
//     setTask(sortedArray)  
//     setData("todo", JSON.stringify(sortedArray))
//     handleBack()
//   }

//   const handleDelete = async() => {
//     if(todoID !== 'new')
//       deleteTask(currTask.id, task, setTask)
//     Vibration.vibrate(70)
//     handleBack()
//   }

//   const handleClose = ()=>{
//      if(router.canGoBack())
//        router.back()
//      else
//        router.push('/index')
//   }

//   //'#63B4FF'
//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <SafeAreaView style={{ flex: 1 }}>
//         <BottomSheet
//           ref={sheetRef}
//           index={0}
//           //snapPoints={['90%', '70%']}
//           onClose={handleClose}
//           enablePanDownToClose
//         >
//           <BottomSheetView style={{ flex: 1, backgroundColor: '#031F2B', paddingHorizontal: 10 }}>
//             <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5, marginTop: 10 }}>
//               <Pressable onPress={handleBack} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
//                 <Text style={{ color: "silver", fontSize: 16, fontWeight: 'bold' }}>Отмена</Text>
//               </Pressable>
//               <Text style={{ color: 'white', fontSize: 26, fontWeight: 'bold' }}>Задача</Text>
//               <Pressable onPress={handleDone} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
//                 <Text style={{ color: "#63B4FF", fontSize: 16, fontWeight: 'bold' }}>Готово</Text>
//               </Pressable>
//             </View>
//             <View style={{ flexDirection: 'column', width: '100%', gap: 10 }}>
//               {show && (
//                 <DateTimePicker
//                   //style={{backgroundColor:'#031F2B', borderColor:'red', width:70}}
//                   //accentColor="#63B4FF"
//                   mode={mode}
//                   locale='ru_RU'
//                   presentation="dialog"
//                   value={currTask.date ? currTask.date : new Date()}
//                   onValueChange={(event, selectedDate) => {
//                     var resss = (mode === 'date') ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()) : selectedDate;
//                     setCurrentTask({ ...currTask, date: resss })
//                     setShow(false);
//                   }}
//                   onDismiss={() => {
//                     setShow(false);
//                   }}
//                 />
//               )}

//               <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
//                 <Pressable
//                   onPress={() => showDatepicker('date')}
//                   style={{ flexDirection: 'row', alignItems: 'center', gap: 3, borderColor: currTask.date ? '#263238' : '#E11D48', borderWidth: 2, borderRadius: 10, paddingHorizontal: 5, paddingVertical: 10 }}>
//                   <Text style={{ color: 'white' }}>{date}</Text>
//                   <MaterialDesignIcons name='calendar-month-outline' color={'white'} size={24} />
//                 </Pressable>
//                 <Pressable
//                   onPress={() => showDatepicker('time')}
//                   style={{ flexDirection: 'row', alignItems: 'center', gap: 3, borderColor: '#263238', borderWidth: 2, borderRadius: 10, paddingHorizontal: 5, paddingVertical: 10 }}>
//                   <Text style={{ color: 'white' }}>{time}</Text>
//                   <MaterialDesignIcons name='clock' color={'white'} size={24} />
//                 </Pressable>
//                 <Pressable
//                   onPress={changeStatus}
//                   style={{ flexDirection: 'row', alignItems: 'center', gap: 3, borderColor: '#263238', borderWidth: 2, borderRadius: 10, paddingHorizontal: 5, paddingVertical: 10 }}>
//                   <Text style={{ color: 'white' }}>{currTask.status.name.ru} </Text>
//                   <MaterialDesignIcons name={currTask.status.icon as any} color={(currTask.status.color)} size={24} />
//                 </Pressable>
//               </View>
//               {/* <CategoryPanel category={currTask.category.name.en} onPressCategory={changeCategory}/> */}
//               <FlatList
//                 nestedScrollEnabled
//                 horizontal
//                 //style={{ width: '100%', gap:30}}
//                 contentContainerStyle={{ gap: 10 }}
//                 data={Object.values(Categorys)}
//                 keyExtractor={item => item.id}
//                 renderItem={({ item }) => <CategoryItem categoryID={item.id} currentID={currTask.category.id} onPressCategory={changeCategory} />}
//               />
//               <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
//                 <Priority currValue={currTask.priority.id} changePriority={changePriority} priority={PriorityData.High.id} />
//                 <Priority currValue={currTask.priority.id} changePriority={changePriority} priority={PriorityData.Medium.id} />
//                 <Priority currValue={currTask.priority.id} changePriority={changePriority} priority={PriorityData.Low.id} />
//               </View>
//               <View style={{ flexDirection: 'column', width: '100%', height: 50 }}>
//                 <TextInput
//                   style={{ color: 'white', borderColor: focused == 'Title' ? 'silver' : currTask.title ? '#263238' : '#E11D48', borderWidth: 2, borderRadius: 10, paddingHorizontal: 5, paddingVertical: 10 }}
//                   onFocus={() => setFocused('Title')}
//                   onBlur={() => setFocused('')}
//                   onChangeText={(text) => changeTitle(text)}
//                   placeholder={'Заголовок...'}
//                   placeholderTextColor={'gray'}
//                   value={currTask.title}
//                   //autoFocus={true} 
//                   maxLength={40}
//                 />
//               </View>
//               <View style={{ flexDirection: 'column', width: '100%', height: 100 }}>
//                 <TextInput
//                   style={{ flex: 1, color: 'white', borderColor: focused == 'Notes' ? 'silver' : '#263238', borderWidth: 2, borderRadius: 10, paddingHorizontal: 5, paddingVertical: 10 }}
//                   onFocus={() => setFocused('Notes')}
//                   onBlur={() => setFocused('')}
//                   onChangeText={(text) => changeNotes(text)}
//                   placeholder={'Примечание...'}
//                   placeholderTextColor={'gray'}
//                   value={currTask.notes}
//                   multiline={true}
//                   textAlignVertical='top' />
//               </View>
//               <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', marginBottom: 20 }}>
//                 <Pressable
//                   style={{ backgroundColor: '#263238', padding: 10, borderRadius: 15, width: '60%', justifyContent: 'center', alignItems: 'center' }}
//                   onPress={handleDelete}>
//                   <MaterialDesignIcons name={'trash-can-outline'} color={"red"} size={34} />
//                 </Pressable>
//               </View>
//             </View>
//           </BottomSheetView>
//         </BottomSheet>
//       </SafeAreaView>
//     </TouchableWithoutFeedback>
//   );
// }

// export default taskCard


// const style = (Theme: any) => StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Theme.colors.bg_Primary,
//     alignItems: 'center',
//     gap: 5,
//     padding: 5
//   },
//   textHeader: {
//     color: Theme.colors.text_Primary,
//     fontSize: 22,
//     fontWeight: 'bold'
//   },
//   text: {
//     fontSize: 16,
//     color: Theme.colors.text_Secondary
//   },
//   row:{ 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     width: '100%' 
//   }
// });