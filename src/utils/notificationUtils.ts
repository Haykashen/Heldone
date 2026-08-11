import * as Notifications from 'expo-notifications';


// cancelAllScheduledNotificationsAsync() Отменяет все запланированные уведомления.
// cancelScheduledNotificationAsync(identifier)  Отменяет одно запланированное уведомление. Запланированное уведомление о указанном ID не срабатывает.
export const createNotification = async (title:string, text:string, triggerDate:Date) =>{
  const id = Notifications.scheduleNotificationAsync({
    content: {
        title: title,
        body: text,
    },
    trigger: {type:Notifications.SchedulableTriggerInputTypes.DATE, date:triggerDate},//type:Notifications.SchedulableTriggerInputTypes.CALENDAR, seconds: 60, repeats: true 
  });
  return id;
}

export const deleteAllNotification = async (title:string, text:string, triggerDate:Date) =>{
  await Notifications.cancelAllScheduledNotificationsAsync()
}