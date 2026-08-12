import * as Notifications from 'expo-notifications';

export const createNotificationChannel = async () => {
  const channelId = 'heldone_notify';
  const res = await Notifications.getNotificationChannelAsync(channelId)
  // канал существует?
  if(res)
    return;
  
  await Notifications.setNotificationChannelAsync(channelId, {
    name: 'Heldone notifications',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'notification_sound.wav', // <- for Android 8.0+, see channelId property below
    vibrationPattern: [0, 250, 250, 250],
  });
}


// cancelAllScheduledNotificationsAsync() Отменяет все запланированные уведомления.
// cancelScheduledNotificationAsync(identifier)  Отменяет одно запланированное уведомление. Запланированное уведомление о указанном ID не срабатывает.
export const createNotification = async (title:string, text:string, triggerDate:Date) =>{
  const id = Notifications.scheduleNotificationAsync({
    content: {
        title: title,
        body: text,
        sound:'notification_sound.wav', // Provide ONLY the base filename            
    },
    trigger: {
      type:Notifications.SchedulableTriggerInputTypes.DATE, 
      date:triggerDate, 
      channelId:'heldone_notify',  
    },//type:Notifications.SchedulableTriggerInputTypes.CALENDAR, seconds: 60, repeats: true 
     
  });
  return id;
}

export const deleteAllNotification = async () =>{
  await Notifications.cancelAllScheduledNotificationsAsync()
}