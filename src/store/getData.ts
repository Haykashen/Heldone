import { notifyMessage } from '@/utils/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getData = async (key:string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    notifyMessage("Ошибка при получении данных. Перезапустите приложение.")
    //console.error('Ошибка чтения в AsyncStorage:', e);
  }
}