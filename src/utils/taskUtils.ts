// import PriorityData from '@/data/PriorityData';
// import uuid from 'react-native-uuid';
// import Categorys from '../data/CategoryData';
// import { StatusData } from '../data/StatusData';
// import { setData } from '../store/setData';
// import { TTask } from "./types";
// import { getFormatedDay } from './utils';

// export const completeTask = (id: string, task: [], setTask: ([]) => void) => {

//   const newTask = task.filter((item: TTask) => {
//     if (item.id === id) {
//       item.status = (item.status.id === StatusData.Upcoming.id) ? StatusData.Completed : StatusData.Upcoming;
//     }
//     return { ...item }
//   })
//   setTask(newTask)
//   setData("todo", JSON.stringify(newTask))
// }

// export const deleteTask = (id: string, task: [], setTask: ([]) => void) => {
//   const newTask = task.filter((item: TTask) => { if (item.id !== id) return item })
//   setTask(newTask)
//   setData("todo", JSON.stringify(newTask))
// }


// export const getNewTask = (createDate: string, defaultCategory: string, defaultPriority: string, createTime: string, defaultNotify: boolean) => {

//   let date = new Date(createDate + 'T' + createTime);
//   const newTask: TTask = {
//     id: uuid.v4(),
//     date: date,
//     dateString: getFormatedDay(date),
//     title: '',
//     category: Categorys[defaultCategory],
//     status: StatusData.Upcoming,
//     notes: '',
//     priority: PriorityData[defaultPriority],
//     sendNotify: defaultNotify,
//     files: []
//   }
//   return (newTask)
// };


import PriorityData from '@/data/PriorityData';
import uuid from 'react-native-uuid';
import Categorys from '../data/CategoryData';
import { StatusData } from '../data/StatusData';
import { setData } from '../store/setData';
import { TTask } from "./types";
import { getFormatedDay } from './utils';

/**
 * ИММУТАБЕЛЬНОЕ переключение статуса задачи (Выполнено / Предстоит)
 */
export const completeTask = (id: string, task: TTask[], setTask: (tasks: TTask[]) => void) => {
  // ОПТИМИЗАЦИЯ: Используем .map() и полностью копируем объект при изменении полей
  const newTasks = task.map((item) => {
    if (item.id === id) {
      const newStatus = item.status.id === StatusData.Upcoming.id ? StatusData.Completed : StatusData.Upcoming;
      return { ...item, status: newStatus };
    }
    return item; // Возвращаем неизмененную ссылку, экономя память
  });

  setTask(newTasks);
  setData("todo", JSON.stringify(newTasks));
};

/**
 * Безопасное удаление задачи из массива
 */
export const deleteTask = (id: string, task: TTask[], setTask: (tasks: TTask[]) => void) => {
  // Чистый и быстрый фильтр по логическому условию
  const newTasks = task.filter((item) => item.id !== id);
  
  setTask(newTasks);
  setData("todo", JSON.stringify(newTasks));
};

/**
 * Безопасное создание новой задачи с гарантированной кроссплатформенной датой
 */
export const getNewTask = (
  createDate: string, // Ожидается формат YYYY-MM-DD
  defaultCategory: string, 
  defaultPriority: string, 
  createTime: string, // Ожидается формат HH:MM
  defaultNotify: boolean
): TTask => {

  // БЕЗОПАСНОСТЬ ДЛЯ iOS: Парсим строки даты и времени вручную, 
  // чтобы избежать Invalid Date на движках Apple JavaScriptCore.
  const [year, month, day] = createDate.split('-').map(Number);
  const [hours, minutes] = createTime.split(':').map(Number);
  
  // Месяцы в JS начинаются с 0 (Январь = 0), поэтому вычитаем 1
  const date = new Date(year, month - 1, day, hours, minutes, 0, 0);

  const newTask: TTask = {
    // В зависимости от версии react-native-uuid может возвращаться string или массив байт. 
    // Принудительно приводим к string для стабильности типов.
    id: uuid.v4().toString(),
    date: date,
    dateString: getFormatedDay(date),
    title: '',
    category: Categorys[defaultCategory],
    status: StatusData.Upcoming,
    notes: '',
    priority: PriorityData[defaultPriority],
    sendNotify: defaultNotify,
    files: []
  };

  return newTask;
};
