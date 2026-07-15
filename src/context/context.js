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
  const [defaultCategory, setDefaultCategory] = useState([])
  const [defaultPriority, setDefaultPriority] = useState([]) 

  useEffect(() => {
    async function getStoredData() {

      const defCategory = await getData('defaultCategory')
      setDefaultCategory(defCategory ? defCategory : 'Target')

      const defPriority = await getData('defaultPriority')
      setDefaultPriority(defPriority ? defPriority : 'Low')

      const storedTask = await getData('todo')
      if (storedTask) {
        storedTask.forEach((item)=> {
          item.date = new Date(item.date)
          //setTimeStatus(item)
        })
        setTask(storedTask)
        //console.log('storedTask =  ', storedTask)
      }      
    }
    getStoredData()
  }, []);

  return (
    <Context.Provider value={{ task, setTask, defaultCategory, setDefaultCategory, defaultPriority, setDefaultPriority }}>
      {children}
    </Context.Provider>
  )
}

export {
  Context,
  ContextProvider
};

