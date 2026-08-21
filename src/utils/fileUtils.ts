import { Directory, File, Paths } from 'expo-file-system';
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

/**
 * Современный шеринг файла с кастомным наименованием (Исправлено для Expo SDK 54+)
 * @param currentUri - Текущий рабочий строковый URI файла (file://...)
 * @param desiredName - Новое желаемое имя файла с расширением (например, "План_Задач.pdf")
 */
export const shareFileWithCustomName = async (currentUri: string, desiredName: string) => {
  try {
    // 1. Проверяем доступность шеринга
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (!isSharingAvailable) {
      throw new Error('Шеринг недоступен на данном устройстве');
    }

    // 2. Инициализируем объект временной ПАПКИ в кэше
    const tempDirectory = new Directory(Paths.cache, 'TemporaryShares');

    // 3. Гарантируем, что папка физически создана на диске [INDEX]
    if (!tempDirectory.exists) {
      tempDirectory.create(); // Создаем папку [INDEX]
    }

    // 4. Инициализируем объект исходного файла
    const sourceFile = new File(currentUri);

    // 5. ИСПРАВЛЕНО: Создаем структуру ФАЙЛА (через класс File, а не Directory!) внутри готовой папки
    const targetFile = new File(tempDirectory, desiredName);

    // 6. Выполняем копирование. Теперь нативный слой видит валидный путь файла назначения [INDEX]
    sourceFile.copy(targetFile);

    // 7. Открываем нативную шторку отправки
    await Sharing.shareAsync(targetFile.uri, {
      dialogTitle: `Поделиться: ${desiredName}`,
    });

    // 8. Удаляем временный файл из кэша после шеринга
    if (targetFile.exists) {
      targetFile.delete();
    }

  } catch (error) {
    alert(error);   
  }
};



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