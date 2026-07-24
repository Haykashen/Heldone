import { getData } from '@/store/getData';
import { createContext, useEffect, useState } from 'react';
//import { setTimeStatus } from '@/utils/utils';
// Initiate context
const Context = createContext();

const ContextProvider = ({ children }) => {
  //const [theme, setTheme] = useState(themeDark);//theme, setTheme,themeDark
  //const [platform, setPlatform] = useState(Platform.OS);//
  //const [language, setLanguage] = useState('ru');//storeLanguage? storeLanguage :
  const [task, setTask] = useState([])
  const [defaultTime, setDefaultTime] = useState('14:00')
  const [defaultCategory, setDefaultCategory] = useState('Target')
  const [defaultPriority, setDefaultPriority] = useState('Low') 
  const [onboarded, setOnboarded] = useState(false) 
  
  const [loaded, setLoad] = useState(false) 

  useEffect(() => {

    async function getStoredData() {
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
        storedTask.forEach((item) => { item.date = new Date(item.date) })
        setTask(storedTask)
      }
    }
    try {
      getStoredData()
    }
    catch (e) {
      console.log('Error loading getStoredData')
    }
    finally {
      setLoad(true)
    }

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

