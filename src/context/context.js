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


  useEffect(() => {
    async function getStoredData() {

      // const storedTheme = await getData('theme')
      // if (storedTheme) {
      //   setTheme(storedTheme)
      // }
      // const storedLanguage = await getData('language')
      // if (storedLanguage) {
      //   setLanguage(storedLanguage)
      // }
      const storedTask = await getData('todo')
      if (storedTask) {
        storedTask.forEach((item)=> {
          item.date = new Date(item.date)
          //setTimeStatus(item)
        })
        setTask(storedTask)
        console.log('storedTask =  ', storedTask)
      }      
    }
    getStoredData()
  }, []);

  return (
    <Context.Provider value={{ task, setTask }}>
      {children}
    </Context.Provider>
  )
}

export {
  Context,
  ContextProvider
};

