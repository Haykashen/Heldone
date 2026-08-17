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
    if (item.dateString === day) 
    {
      if (!(res[item.dateString]))
        res[item.dateString] = { data: [] };
      res[item.dateString].data.push(item)
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
    if (status && status !== item.status.id || !item.dateString)
      return;
    //let strDate = getFormatedDay(item.date);

    if (!(res[item.dateString]))
      res[item.dateString] = { data: [] };
    res[item.dateString].data.push(item)
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
    if(!item.dateString)
      return
    //let strDate = item.dateString;//getFormatedDay(new Date(item.date))
    if (!(res[item.dateString]))
      res[item.dateString] = { dots: [] };
    let findColor = res[item.dateString].dots.find((i: { color: string }) => i.color === item.category.backColor)
    if (!findColor)
      res[item.dateString].dots.push({ key: res[item.dateString].dots.length, color: item.category.backColor })
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