import { getData } from "@/store/getData";
import { createNotificationChannel } from "@/utils/notificationUtils";
import { TTask } from "@/utils/types";
import { notifyMessage } from "@/utils/utils";
import { createContext, FC, useEffect, useState } from "react";
import { Platform } from "react-native";

const TaskContext = createContext<any>(null);

interface Props {
  children: React.ReactNode;
}

const TaskContextProvider: FC<Props> = ({ children }) => {
  const [task, setTask] = useState<TTask[]>([])
  const [loadedTask, setLoad] = useState<boolean>(false) 
  
  useEffect(() => {
    async function getStoredData() {

      if (Platform.OS === 'android') {
        await createNotificationChannel()
      }       

      try {
        const storedTask = await getData('todo')
        if (storedTask) {
          storedTask.forEach((item:TTask) => {
            item.date = new Date(item.date)
          })
          setTask(storedTask)
        }   
      }
      catch (e) {
        notifyMessage('Ошибка при загрузке настроек приложения. Переоткройте приложение.')
      }
      finally {
        setLoad(true)
      }
    }

    getStoredData()
  }, []);    
    return (
    <TaskContext.Provider
      value={{
        task,
        setTask,
        loadedTask,

      }}>
      {children}
    </TaskContext.Provider>
  )
}

export {
  TaskContext,
  TaskContextProvider
};

