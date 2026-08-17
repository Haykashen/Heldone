import { getData } from '@/store/getData';
import { createNotificationChannel } from '@/utils/notificationUtils';
import { notifyMessage } from '@/utils/utils';
import { createContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

const Context = createContext();

const ContextProvider = ({ children }) => {
  const [task, setTask] = useState([])
  const [defaultTime, setDefaultTime] = useState('14:00')
  const [defaultCategory, setDefaultCategory] = useState('Target')
  const [defaultPriority, setDefaultPriority] = useState('Low')
  const [onboarded, setOnboarded] = useState(false)

  const [loaded, setLoad] = useState(false)

  useEffect(() => {
    async function getStoredData() {
        //await deleteAllNotification()
      if (Platform.OS === 'android') {
        await createNotificationChannel()
      }       
      try {
    
        const onboard = await getData('onboarded')
        setOnboarded(onboard ? onboard : false)

        const defTime = await getData('defaultTime')
        setDefaultTime(defTime ? defTime : '14:00')

        const defCategory = await getData('defaultCategory')
        setDefaultCategory(defCategory ? defCategory : 'Target')

        const defPriority = await getData('defaultPriority')
        setDefaultPriority(defPriority ? defPriority : 'Low')

        const storedTask = await getData('todo')
        if (storedTask.length > 0) {
          storedTask.forEach((item) => {
            item.date = new Date(item.date)
            //item.notifyId = createNotification('Пора выполнить задачу!', item.title, new Date(item.date))
          })
          setTask(storedTask)
        }
      }
      catch (e) {
        notifyMessage('Ошибка при загрузке данных. Переоткройте приложение.')
        alert(e)
      }
      finally {
        setLoad(true)
      }
    }

    getStoredData()
  }, []);

  return (
    <Context.Provider
      value={{
        task,
        setTask,
        defaultCategory,
        setDefaultCategory,
        defaultPriority,
        setDefaultPriority,
        defaultTime,
        setDefaultTime,
        onboarded,
        setOnboarded,
        loaded,
        setLoad
      }}>
      {children}
    </Context.Provider>
  )
}

export {
  Context,
  ContextProvider
};

