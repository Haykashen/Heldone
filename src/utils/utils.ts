import { Alert, Platform, ToastAndroid } from 'react-native';
import uuid from 'react-native-uuid';
import Categorys from '../data/Category';
import TaskStatus from '../data/TaskStatus';
import { TTask, TTaskByDays } from "./types";


export function getCalendarTitle(date: Date) {
  let title = new Date(date).toLocaleDateString("ru-RU", { year: "numeric", month: "long" }).split('')
  title[0] = title[0].toUpperCase()
  return title.join('');
}

export function getFormatedDay(date:Date){
  let dateArray = (date).toLocaleDateString().split('.');
  let strDate = dateArray[2]+'-'+dateArray[1]+'-'+dateArray[0];
  return strDate;
} 

export function getDayTasks(task:[], day:string){
  let res:TTaskByDays = {}
  task.forEach((item:TTask)=> {
    let strDate = getFormatedDay(item.date);
    if(strDate === day)
    {
      if(!(res[strDate]))
        res[strDate] = {data:[]};
      res[strDate].data.push(item)      
    }
  })
  let resObj = []
  for(var key in res)
  {
    resObj.push({title:key, data:res[key].data})
  }
  return resObj;
}

export function getTaskByDays(task:[], status?:string){
  let res:TTaskByDays = {}
  task.forEach((item:TTask)=> {
    if(status && status !== item.status.id)
      return;
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

export function getMultiDotsDays(task:[]){
  const code = { key: 'code', color: 'green' };
  let res:{[key:string]:{dots:any}} = {}
  task.forEach((item:TTask)=> {
    let strDate = getFormatedDay(new Date(item.date));
    if(!(res[strDate]))
      res[strDate] = {dots:[]};
    res[strDate].dots.push({key: res[strDate].dots.length, color: item.category.color})  
  })
  return res;
}

export function notifyMessage(msg: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT)
  } else {
    Alert.alert(msg);
  }
}


// export function setTimeStatus(item: TTask) {
//   const currentTime = new Date();

//   if ((item.status.id === 'Completed'))
//     item.timeStatus = TimeStatus.Default;
//   else if (item.date.getTime() > currentTime.getTime()) {
//     item.timeStatus = TimeStatus.Soon;
//   }
//   else
//     item.timeStatus = TimeStatus.Overdue;
// }

export const getNewTask = ()=>({ 
  id: uuid.v4(), 
  date:null, 
  title: '', 
  category: 
  Categorys.Target, 
  status: TaskStatus.Upcoming, 
  timeStatus: '',
  notes: '',
  priority: 'Низкий'
});