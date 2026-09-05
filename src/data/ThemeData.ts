import { TDataDir, TDataItem } from "@/components/types/typesData";

const ThemeData:TDataDir = {
    system: { 
      id: 'system', 
      name: {
        ru:'Как в системе'
      }, 
      icon: 'theme-light-dark', 
      color:'gray'
    },
    light: { 
      id: 'light', 
      name: {
        ru:'Светлая'
      }, 
      icon: 'weather-sunny', 
      color:'gold'
    },
    dark: { 
      id: 'dark', 
      name: {
        ru:'Темная'
      }, 
      icon: 'weather-night', 
      color:'#5656f0'
    },
};


export default ThemeData

export const THEME_ARRAY:ArrayLike<TDataItem> = Object.values(ThemeData);