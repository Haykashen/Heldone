// MaterialCommunityIcons'#D97706'
import { TDataDir, TDataItem } from "../components/types/typesData";

const CategoryData:TDataDir = {
    Home: {
        id:'Home',
        name: {
            ru: 'Дом',
            en: 'Home'
        },
        icon: 'home',
        color: '#4CAF50'
    }, 
    Health:{
        id:'Health',
        name:{
            ru: 'Здоровье',
            en: 'Health'
        },
        icon:'heart-pulse',
        color:'#E11D48'
    },       
    Target: {
        id:'Target',
        name: {
            ru: 'Цель',
            en: 'Target'
        },
        icon: 'bullseye-arrow',
        color:'#4894FE'
    },
    Investment:{
        id:'Investment',
        name:{
            ru: 'Инвестиции',
            en: 'Investment'
        },
        icon:'gold',
        color:"#ffb900"
    },
    Rest:{
        id:'Rest',
        name:{
            ru:'Отдых',
            en:'Rest'
        },
        icon:'party-popper',
        color:'#C026D3'
    },    
    Shopping:{
        id:'Shopping',
        name:{
            ru:'Покупки',
            en:'Shopping'
        },
        icon:'cart',
        color:'#0D9488'
    },          
    Hobby:{
        id:'Hobby',
        name:{
            ru:'Хобби',
            en:'Hobby'
        },
        icon:'palette',
        color:'#DB2777'
    },  
    Family: {
        id:'Family',
        name: {
            ru: 'Семья',
            en: 'Family'
        },
        icon: 'account-group',
        color:'#EA580C'
    },       
    Finance:{
        id:'Finance',
        name:{
            ru: 'Финансы',
            en: 'Finance'
        },
        icon:'wallet',
        color:'#059669'
    },    
    Education:{
        id:'Education',
        name:{
            ru: 'Учёба',
            en: 'Education'
        },
        icon:'school',
        color:"#7C3AED"      
    },
    Sport:{
        id:'Sport',
        name:{
            ru: 'Фитнес',
            en: 'Sport'
        },
        icon:'dumbbell',
        color:"#DC2626"     
    },
    Job:{
        id:'Job',
        name:{
            ru:'Работа',
            en:'Job'
        },
        icon:'briefcase',
        color:'#2563EB'
    },
    Love:{
        id:'Love',
        name:{
            ru:'Любовь',
            en:'Love'
        },
        icon:'heart',
        color:'#fa1bd9'        
    },    
    Travel:{
        id:'Travel',
        name:{
            ru:'Путешествия',
            en:'Travel'
        },
        icon:'airplane',
        color:'#0891B2'
    },
    Pets:{
        id:'Pets',
        name:{
            ru:'Питомцы',
            en:'Pets'
        },
        icon:'paw',
        color:'#B45309'
    },    
    SelfDevelopment:{
        id:'SelfDevelopment',
        name:{
            ru:'Саморазвитие',
            en:'Self-development'
        },
        icon:'sprout',
        color:'#65A30D'
    },
    Ideas:{
        id:'Ideas',
        name:{
            ru:'Идеи',
            en:'Ideas'
        },
        icon:'lightbulb-on-outline',
        color:'#CA8A04'
    },
    Meetings:{
        id:'Meetings',
        name:{
            ru:'Встречи',
            en:'Meetings'
        },
        icon:'calendar-clock',
        color:'#4F46E5'
    },
    Projects:{
        id:'Projects',
        name:{
            ru:'Проекты',
            en:'Projects'
        },
        icon:'folder-outline',
        color:'#0284C7'
    },

    
}

export default CategoryData

export const CATEGORIES_ARRAY:ArrayLike<TDataItem> = Object.values(CategoryData);