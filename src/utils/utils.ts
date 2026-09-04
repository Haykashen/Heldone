import { Alert, Platform, ToastAndroid } from 'react-native';
import { TTask } from "../components/types/typesTask";

/**
 * Возвращает заголовок календаря с заглавной буквы (например, "Август 2026")
 */
export function getCalendarTitle(date: Date): string {
  const formatter = new Intl.DateTimeFormat("ru-RU", { year: "numeric", month: "long" });
  const title = formatter.format(new Date(date));
  return title.charAt(0).toUpperCase() + title.slice(1);
}

/**
 * Безопасное форматирование даты в YYYY-MM-DD без привязки к локали устройства
 */
export function getFormatedDay(date: Date): string {
  const d = date;//new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * ОПТИМИЗИРОВАНО: Возвращает задачи только для конкретного дня.
 * Больше не строит лишние объекты и не делает двойных циклов.
 */
export function getDayTasks(task: TTask[], day: string) {
  const filteredTasks = task.filter((item) => item.dateString === day);
  
  if (filteredTasks.length === 0) return [];
  
  // Возвращаем структуру, которую ожидает AgendaList
  return [{ title: day, data: filteredTasks }];
}

/**
 * ОПТИМИЗИРОВАНО: Группирует задачи по дням с использованием Object.values()
 */
export function getTaskByDays(task: TTask[], status?: string) {
  const groups: { [key: string]: { title: string; data: TTask[] } } = {};

  task.forEach((item) => {
    if ((status && status !== item.status.id) || !item.dateString) {
      return;
    }

    if (!groups[item.dateString]) {
      groups[item.dateString] = { title: item.dateString, data: [] };
    }
    groups[item.dateString].data.push(item);
  });

  return Object.values(groups);
}

/**
 * ОПТИМИЗИРОВАНО: Сбор точек для календаря за линейное время O(N) вместо O(N^2)
 */
export function getMultiDotsDays(task: TTask[]) {
  // Промежуточный объект, где для каждого дня храним Set с уникальными цветами
  const colorSets: { [key: string]: string[] } = {};

  task.forEach((item) => {
    if (!item.dateString) return;

    if (!colorSets[item.dateString]) {
      colorSets[item.dateString] = new Array<string>();
    }
    colorSets[item.dateString].push(item.category.color);
  });

  // Преобразуем Set-ы в формат, который требует react-native-calendars
  const res: any = {};

  Object.entries(colorSets).forEach(([dateString, colorSet]) => {
    res[dateString] = {
      dots: Array.from(colorSet).map((color, index) => ({
        key: index,
        color: color,
      })),
    };
  });

  return res;
}

/**
 * Вывод уведомлений в зависимости от платформы
 */
export function notifyMessage(msg: string): void {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert(msg);
  }
}