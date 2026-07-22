import Statuses from '../data/StatusData';
import { setData } from '../store/setData';
import { TItem } from "../utils/types";
//import { setTimeStatus } from '../utils/utils';


export const completeTask = (id: string, task: [], setTask: ([]) => void) => {

  const newTask = task.filter((item: TItem) => {
    if (item.id === id) {
      item.status = (item.status.name.en === 'Upcoming') ? Statuses.Completed : Statuses.Upcoming;
      //setTimeStatus(item) 
    }
    return { ...item }
  })
  setTask(newTask)
  setData("todo", JSON.stringify(newTask))
}

export const deleteTask = (id: string, task: [], setTask: ([]) => void) => {
  const newTask = task.filter((item: TItem) => { if (item.id !== id) return item })
  setTask(newTask)
  setData("todo", JSON.stringify(newTask))
}