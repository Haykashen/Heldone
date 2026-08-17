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
  const [defaultNotify, setDefaultNotify] = useState(true)

  const [loaded, setLoad] = useState(false)

  useEffect(() => {
    async function getStoredData() {

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
        if (storedTask) {
          storedTask.forEach((item) => {
            item.date = new Date(item.date)
          })
          setTask(storedTask)
        }

        const notifyStatus = await getData('defaultNotify')    
        setDefaultNotify((notifyStatus || !storedTask) ? true : false) // !storedTask первая загрузка       
      }
      catch (e) {
        notifyMessage('Ошибка при загрузке данных. Переоткройте приложение.')
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
        setLoad,
        defaultNotify, 
        setDefaultNotify
      }}>
      {children}
    </Context.Provider>
  )
}

export {
  Context,
  ContextProvider
};

