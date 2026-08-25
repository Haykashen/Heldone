// import { Alert, Platform, ToastAndroid } from 'react-native';
// import { TTask, TTaskByDays } from "./types";

// export function getCalendarTitle(date: Date) {
//   let title = new Date(date).toLocaleDateString("ru-RU", { year: "numeric", month: "long" }).split('')
//   title[0] = title[0].toUpperCase()
//   return title.join('');
// }

// export function getFormatedDay(date: Date) {
//   let localeDate = date.toLocaleDateString("ru-RU", {year:"numeric", month: "2-digit", day:"2-digit"});//date.toISOString().split('T') res[0]
//   let res = localeDate.split('.').reverse().join('-')
//   return res;
// }

// export function getDayTasks(task: [], day: string) {
//   let res: TTaskByDays = {}
//   task.forEach((item: TTask) => {
//     if (item.dateString === day) 
//     {
//       if (!(res[item.dateString]))
//         res[item.dateString] = { data: [] };
//       res[item.dateString].data.push(item)
//     }
//   })
//   let resObj = []
//   for (var key in res) {
//     resObj.push({ title: key, data: res[key].data })
//   }
//   return resObj;
// }

// export function getTaskByDays(task: [], status?: string) {
//   let res: TTaskByDays = {}
//   task.forEach((item: TTask) => {
//     if (status && status !== item.status.id || !item.dateString)
//       return;
//     //let strDate = getFormatedDay(item.date);

//     if (!(res[item.dateString]))
//       res[item.dateString] = { data: [] };
//     res[item.dateString].data.push(item)
//   })
//   let resObj = []
//   for (var key in res) {
//     resObj.push({ title: key, data: res[key].data })
//   }
//   return resObj;
// }

// export function getMultiDotsDays(task: []) {

//   //const code = { key: 'code', color: 'green' };
//   let res: { [key: string]: { dots: any } } = {}

//   task.forEach((item: TTask) => {
//     if(!item.dateString)
//       return
//     //let strDate = item.dateString;//getFormatedDay(new Date(item.date))
//     if (!(res[item.dateString]))
//       res[item.dateString] = { dots: [] };
//     let findColor = res[item.dateString].dots.find((i: { color: string }) => i.color === item.category.backColor)
//     if (!findColor)
//       res[item.dateString].dots.push({ key: res[item.dateString].dots.length, color: item.category.backColor })
//   })
//   return res;
// }

// export function notifyMessage(msg: string) {
//   if (Platform.OS === 'android') {
//     ToastAndroid.show(msg, ToastAndroid.SHORT)
//   } else {
//     Alert.alert(msg);
//   }
// }

import { Alert, Platform, ToastAndroid } from 'react-native';
import { TTask } from "../components/types/types";

/**
 * Возвращает заголовок календаря с заглавной буквы (например, "Август 2026")
 */
export function getCalendarTitle(date: Date): string {
  const formatter = new Intl.DateTimeFormat("ru-RU", { year: "numeric", month: "long" });
  const title = formatter.format(new Date(date));
  return title.charAt(0).toUpperCase() + title.slice(1);
}

/**
 * Безопасное форматирование даты в YYYY-MM-DD без привязки к локали устройства
 */
export function getFormatedDay(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * ОПТИМИЗИРОВАНО: Возвращает задачи только для конкретного дня.
 * Больше не строит лишние объекты и не делает двойных циклов.
 */
export function getDayTasks(task: TTask[], day: string) {
  const filteredTasks = task.filter((item) => item.dateString === day);
  
  if (filteredTasks.length === 0) return [];
  
  // Возвращаем структуру, которую ожидает AgendaList
  return [{ title: day, data: filteredTasks }];
}

/**
 * ОПТИМИЗИРОВАНО: Группирует задачи по дням с использованием Object.values()
 */
export function getTaskByDays(task: TTask[], status?: string) {
  const groups: { [key: string]: { title: string; data: TTask[] } } = {};

  task.forEach((item) => {
    if ((status && status !== item.status.id) || !item.dateString) {
      return;
    }

    if (!groups[item.dateString]) {
      groups[item.dateString] = { title: item.dateString, data: [] };
    }
    groups[item.dateString].data.push(item);
  });

  return Object.values(groups);
}

/**
 * ОПТИМИЗИРОВАНО: Сбор точек для календаря за линейное время O(N) вместо O(N^2)
 */
export function getMultiDotsDays(task: TTask[]) {
  // Промежуточный объект, где для каждого дня храним Set с уникальными цветами
  const colorSets: { [key: string]: string[] } = {};

  task.forEach((item) => {
    if (!item.dateString || !item.category?.backColor) return;

    if (!colorSets[item.dateString]) {
      colorSets[item.dateString] = new Array<string>();
    }
    colorSets[item.dateString].push(item.category.backColor);
  });

  // Преобразуем Set-ы в формат, который требует react-native-calendars
  const res: any = {};

  Object.entries(colorSets).forEach(([dateString, colorSet]) => {
    res[dateString] = {
      dots: Array.from(colorSet).map((color, index) => ({
        key: index,
        color: color,
      })),
    };
  });

  return res;
}

/**
 * Вывод уведомлений в зависимости от платформы
 */
export function notifyMessage(msg: string): void {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert(msg);
  }
}