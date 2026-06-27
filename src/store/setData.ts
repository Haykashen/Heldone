import AsyncStorage from '@react-native-async-storage/async-storage';

export const setData = async (key: string, data: string) => {
    try {
        await AsyncStorage.setItem(key, data);
        console.log('Записали данные в AsyncStorage ключ: ', key);
    } catch (e) {
        console.error('Ошибка записи в AsyncStorage:', e);
    }
} 