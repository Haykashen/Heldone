import { TDataDir, TDataItem } from "../components/types/typesData";

const PriorityData:TDataDir = {
    High: {
        id:'High',
        name: {
            ru: 'Высокий',
            en: 'High'
        },
        icon: 'flag',
        color: 'red',
    },
    Medium: {
        id:'Medium',
        name: {
            ru: 'Средний',
            en: 'Medium'
        },
        icon: 'flag',
        color: 'orange',

    }, 
    Low: {
        id:'Low',
        name: {
            ru: 'Низкий',
            en: 'Low'
        },
        icon: 'flag',
        color: 'grey',

    },           
}

export default PriorityData

export const PRIORITIES_ARRAY:ArrayLike<TDataItem> = Object.values(PriorityData);
