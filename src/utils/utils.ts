import { Alert, Platform, ToastAndroid } from 'react-native';
import uuid from 'react-native-uuid';
import Categorys from '../data/Category';
import TaskStatus from '../data/TaskStatus';
import TimeStatus from '../data/TimeStatus';
import { TMarkedDays, TTask, TTaskByDays } from "./types";


export function getFormatedDay(date:Date){
  let dateArray = (date).toLocaleDateString().split('.');
  let strDate = dateArray[2]+'-'+dateArray[1]+'-'+dateArray[0];
  return strDate;
} 

export function getMarkedDays(tasks:[]){
  let res:TMarkedDays = {}
  tasks.forEach((item:TTask)=> {
    let strDate = getFormatedDay(new Date(item.date));
    if(!(res[strDate]))
      res[strDate] = {marked:true};
  })
  return res;  
}

export function getTaskByDays(task:[]){
  let res:TTaskByDays = {}
  task.forEach((item:TTask)=> {
    let strDate = getFormatedDay(new Date(item.date));
    if(!(res[strDate]))
      res[strDate] = {data:[]};
    res[strDate].data.push(item)  
  })
  let resObj = []
  for(var key in res)
  {
    resObj.push({title:key, data:res[key].data})
  }
  return resObj;
}

export function notifyMessage(msg: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT)
  } else {
    Alert.alert(msg);
  }
}


export function setTimeStatus(item: TTask) {
  const currentTime = new Date();

  if ((item.status.id === 'Completed'))
    item.timeStatus = TimeStatus.Default;
  else if (item.date.getTime() > currentTime.getTime()) {
    item.timeStatus = TimeStatus.Soon;
  }
  else
    item.timeStatus = TimeStatus.Overdue;
}
    // if((status.id!== 'Completed'))
    // {
    //   if(currentTime.toLocaleDateString() === new Date(date).toLocaleDateString())
    //     setIcon('clock-alert-outline')
    //   else
    //     setIcon('clock-remove-outline')
    // }  
    // if(new Date(date).getTime() > currentTime.getTime())
    // {     
    //   if(currentTime.toLocaleDateString() === new Date(date).toLocaleDateString()){
    //     setColor(statusColors.Warning)      
    //   }
    //   else{
    //     setColor(statusColors.Success)  
    //   }
    // }
export const getNewTask = ()=>({ id: uuid.v4(), date:new Date(), title: '', category: Categorys.Target, status: TaskStatus.Upcoming, timeStatus: TimeStatus.Overdue, notes: '' });