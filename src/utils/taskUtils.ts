import PriorityData from '@/data/PriorityData';
import uuid from 'react-native-uuid';
import Categorys from '../data/CategoryData';
import { StatusData } from '../data/StatusData';
import { setData } from '../store/setData';
import { TTask } from "./types";

export const completeTask = (id: string, task: [], setTask: ([]) => void) => {

  const newTask = task.filter((item: TTask) => {
    if (item.id === id) {
      item.status = (item.status.id === StatusData.Upcoming.id) ? StatusData.Completed : StatusData.Upcoming;
    }
    return { ...item }
  })
  setTask(newTask)
  setData("todo", JSON.stringify(newTask))
}

export const deleteTask = (id: string, task: [], setTask: ([]) => void) => {
  const newTask = task.filter((item: TTask) => { if (item.id !== id) return item })
  setTask(newTask)
  setData("todo", JSON.stringify(newTask))
}


export const getNewTask = (createDate: string, defaultCategory: string, defaultPriority: string, createTime: string) => {

  let date = new Date(createDate + 'T' + createTime);
  const newTask: TTask = {
    id: uuid.v4(),
    date: date,
    title: '',
    category: Categorys[defaultCategory],
    status: StatusData.Upcoming,
    notes: '',
    priority: PriorityData[defaultPriority],
    files: []
  }
  return (newTask)
};
