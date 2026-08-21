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
 * Современный и безопасный шеринг файла с кастомным наименованием (Expo SDK 54+)
 * @param currentUri - Текущий рабочий строковый URI файла (file://...)
 * @param desiredName - Новое желаемое имя файла (например, "План_Задач.pdf")
 */
export const shareFileWithCustomName = async (currentUri: string, desiredName: string) => {
  try {
    // 1. Проверяем доступность шеринга на устройстве
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (!isSharingAvailable) {
      notifyMessage('Шеринг недоступен на данном устройстве');
    }

    // 2. Инициализируем объект целевой папки в кэше с помощью нового API классов
    const tempDirectory = new Directory(Paths.cache, 'TemporaryShares');

    // 3. Создаем директорию, если она еще не создана на диске
    if (!tempDirectory.exists) {
      tempDirectory.create(); // Новый нативный метод создания вместо makeDirectoryAsync
    }

    // 4. Инициализируем объект исходного файла и объект нового временного файла
    const sourceFile = new File(currentUri);
    const targetFile = new Directory(tempDirectory, desiredName); // Создаем структуру файла внутри нашей папки

    // 5. Копируем файл под новым именем
    sourceFile.copy(targetFile);

    // 6. Вызываем окно шеринга, передавая нативный URI нового файла (.uri)
    await Sharing.shareAsync(targetFile.uri, {
      dialogTitle: `Поделиться: ${desiredName}`,
    });

    // 7. Очистка кэша: удаляем временный файл после отправки
    targetFile.delete();

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