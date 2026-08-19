import { getData } from "@/store/getData";
import { notifyMessage } from "@/utils/utils";
import { createContext, FC, useEffect, useState } from "react";

const SettingContext = createContext<any>(null);

interface Props {
  children: React.ReactNode;
}

const SettingContextProvider: FC<Props> = ({ children }) => {
    const [defaultTime, setDefaultTime] = useState<string>('14:00')
    const [defaultCategory, setDefaultCategory] = useState<string>('Target')
    const [defaultPriority, setDefaultPriority] = useState<string>('Low')
    const [defaultNotify, setDefaultNotify] = useState<boolean>(true)
    const [loadedSetting, setLoad] = useState<boolean>(false) 
    
  useEffect(() => {

    async function getStoredData() {

      // if (Platform.OS === 'android') {
      //   await createNotificationChannel()
      // }       
      try {
        const defTime = await getData('defaultTime')
        setDefaultTime(defTime ? defTime : '14:00')

        const defCategory = await getData('defaultCategory')
        setDefaultCategory(defCategory ? defCategory : 'Target')

        const defPriority = await getData('defaultPriority')
        setDefaultPriority(defPriority ? defPriority : 'Low')

        const notifyStatus = await getData('defaultNotify')    
        setDefaultNotify((notifyStatus ||  notifyStatus === null) ? true : false)    
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
    <SettingContext.Provider
      value={{
        defaultCategory,
        setDefaultCategory,
        defaultPriority,
        setDefaultPriority,
        defaultTime,
        setDefaultTime,
        defaultNotify, 
        setDefaultNotify,        
        loadedSetting
      }}>
      {children}
    </SettingContext.Provider>
  )
}

export {
  SettingContext,
  SettingContextProvider
};

