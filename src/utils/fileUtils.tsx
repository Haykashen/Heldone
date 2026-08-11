import { File } from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { notifyMessage } from './utils';

export const shareFile = async (uri: string) => {
    if (await Sharing.isAvailableAsync()) {
        Sharing.shareAsync(uri)
    }
    else {
        notifyMessage("Невозможно поделиться файлом.")
    }
}

export const openFileAndroid = async (uri: string) => {
    try {
        const file = new File(uri);
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: file.contentUri,   // new API property, no legacy import needed
            flags: 1,                // FLAG_GRANT_READ_URI_PERMISSION
            type: file.type,
        });
    } catch (e) {
        notifyMessage("Не удалось открыть файл. Проверьте его формат и попробуйте снова.")
    }
}

export const openFile = (uri: string) => {

    if (Platform.OS === 'android') {
        openFileAndroid(uri)
    } else {
        shareFile(uri); // no ACTION_VIEW equivalent on iOS
    }
}

export const formatBytes = (bytes:number, decimals = 2) => {
	if (bytes === 0) {
		return '0 байт';
	} else {
		const k = 1024;
    const sizes = ['байт', 'КБ', 'МБ', 'ГБ', 'ТБ'];

		let dm = decimals < 0 ? 0 : decimals;
		let i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}
}