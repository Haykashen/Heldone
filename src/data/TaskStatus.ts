// MaterialCommunityIcons
import { TDataDir } from "../utils/types"

const TaskStatus: TDataDir = {
    Completed: {
        id:'Completed',
        name: {
            ru: 'Выполнено',
            en: 'Completed'
        },
        icon: 'checkbox-outline',
        color: "green",
        clockIcon:'clock-check-outline',

    },
    Upcoming: {
        id:'Upcoming',
        name: {
            ru: ' Предстоит',
            en: 'Upcoming'
        },
        icon: 'checkbox-blank-outline',
        color: 'silver',
        clockIcon:'clock-alert-outline',        
    },
}
//'#ea820b'
export default TaskStatus