// MaterialCommunityIcons
import { TDataDir } from "../utils/types";

const TimeStatus: TDataDir = {
    Overdue: {
        id:'Overdue',
        name: {
            ru: 'Просрочено',
            en: 'Overdue'
        },
        icon: 'clock-remove-outline',
        color: '#DC4C64',
        backColor:''
    },
    Soon: {
        id:'Soon',
        name: {
            ru: 'Предстоит',
            en: 'Soon'
        },
        icon: 'clock-alert-outline',
        color: '#ffb900',
        backColor:''
    },
    Default:{
        id:'Default',
        name: {
            ru: '',
            en: ''
        },
        icon: 'clock-outline',//progress-clock  clock-check-outline
        color: '#031F2B',//'#14A44D'
        backColor:''
    },
}

export default TimeStatus