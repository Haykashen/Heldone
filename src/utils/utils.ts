import { Alert, Platform, ToastAndroid } from 'react-native';
import { TTask, TTaskByDays } from "./types";

export function getCalendarTitle(date: Date) {
  let title = new Date(date).toLocaleDateString("ru-RU", { year: "numeric", month: "long" }).split('')
  title[0] = title[0].toUpperCase()
  return title.join('');
}

export function getFormatedDay(date: Date) {
  let localeDate = date.toLocaleDateString("ru-RU", {year:"numeric", month: "2-digit", day:"2-digit"});//date.toISOString().split('T') res[0]
  let res = localeDate.split('.').reverse().join('-')
  return res;
}

export function getDayTasks(task: [], day: string) {
  let res: TTaskByDays = {}
  task.forEach((item: TTask) => {
    
    let strDate = getFormatedDay(item.date);
    console.log('getDayTasks ', item.date, strDate)
    if (strDate === day) {
      if (!(res[strDate]))
        res[strDate] = { data: [] };
      res[strDate].data.push(item)
    }
  })
  let resObj = []
  for (var key in res) {
    resObj.push({ title: key, data: res[key].data })
  }
  return resObj;
}

export function getTaskByDays(task: [], status?: string) {
  let res: TTaskByDays = {}
  task.forEach((item: TTask) => {
    if (status && status !== item.status.id)
      return;
    let strDate = getFormatedDay(item.date);
    //console.log('getTaskByDays =', strDate)
    if (!(res[strDate]))
      res[strDate] = { data: [] };
    res[strDate].data.push(item)
  })
  let resObj = []
  for (var key in res) {
    resObj.push({ title: key, data: res[key].data })
  }
  return resObj;
}

export function getMultiDotsDays(task: []) {

  //const code = { key: 'code', color: 'green' };
  let res: { [key: string]: { dots: any } } = {}

  task.forEach((item: TTask) => {
    let strDate = getFormatedDay(new Date(item.date));
    if (!(res[strDate]))
      res[strDate] = { dots: [] };
    let findColor = res[strDate].dots.find((i: { color: string }) => i.color === item.category.backColor)
    if (!findColor)
      res[strDate].dots.push({ key: res[strDate].dots.length, color: item.category.backColor })
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