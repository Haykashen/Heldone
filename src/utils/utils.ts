import PriorityData from '@/data/PriorityData';
import { Alert, Platform, ToastAndroid } from 'react-native';
import uuid from 'react-native-uuid';
import Categorys from '../data/CategoryData';
import TaskStatus from '../data/StatusData';
import { TTask, TTaskByDays } from "./types";

export function getCalendarTitle(date: Date) {
  let title = new Date(date).toLocaleDateString("ru-RU", { year: "numeric", month: "long" }).split('')
  title[0] = title[0].toUpperCase()
  return title.join('');
}

export function getFormatedDay(date:Date){
  let res =  date.toISOString().split('T')
  //date.toLocaleDateString("ru-RU", {year:"numeric", month: "2-digit", day:"2-digit"});  
  return res[0];
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
    let strDate = getFormatedDay(item.date);
    //console.log('getTaskByDays =', strDate)
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

  //const code = { key: 'code', color: 'green' };
  let res:{[key:string]:{dots:any}} = {}

  task.forEach((item:TTask)=> {
    let strDate = getFormatedDay(new Date(item.date));
    if(!(res[strDate]))
      res[strDate] = {dots:[]};
    res[strDate].dots.push({key: res[strDate].dots.length, color: item.category.backColor})  
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

export const getNewTask = (createDate: string, defaultCategory: string, defaultPriority: string, createTime:string) => {
  console.log('createDate = ', createDate)
  console.log('createTime = ', createTime)
  let date = (createDate) ? new Date(createDate+'T'+createTime) : new Date('0000-00-00'+'T'+createTime);
  console.log('create date = ', date)
  return (
    {
      id: uuid.v4(),
      date: date,
      title: '',
      category: Categorys[defaultCategory],
      status: TaskStatus.Upcoming,
      notes: '',
      priority: PriorityData[defaultPriority]
    })
};