import { useAppColors } from '@/context/ThemeContext'; // Импортируем хук цветов
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type TCardRow = {
  title: string;
  text: string;
  icon: string;
  iconColor: string;
  onPress: () => void;
};

const CardRow = ({ title, text, icon, iconColor, onPress }: TCardRow) => {
  // Получаем динамическую палитру цветов
  const colors = useAppColors();

  return (
    <Pressable 
      onPress={onPress} 
      // Добавляем подсветку при нажатии (iOS/Android) на основе текущей темы
      android_ripple={{ color: colors.borderColor }}
      style={({ pressed }) => [
        styles.cardRow,
        // На iOS делаем мягкое затухание при клике
        pressed && { opacity: 0.7 }
      ]}
    >
      {/* Левая часть: Иконка и текстовый блок */}
      <View style={styles.cardRowContainer}>
        <MaterialDesignIcons name={icon as any} color={iconColor} size={24} />
        <View style={styles.textColumn}>
          <Text style={[styles.cardRowText, { color: colors.titleText }]} numberOfLines={1} ellipsizeMode="tail">
            {text}
          </Text>
          <Text style={[styles.cardRowLabel, { color: colors.subtitleText }]}>
            {title}
          </Text>
        </View>
      </View>

      {/* Правая часть: Шеврон перехода */}
      <View style={styles.chevronContainer}>
        <MaterialDesignIcons name={'chevron-right'} color={colors.metaText} size={20} />
      </View>
    </Pressable>
  );
};

export default CardRow;

const styles = StyleSheet.create({
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cardRowContainer: { 
    flex: 1, // Левая часть забирает максимум доступной ширины
    flexDirection: 'row', 
    gap: 14, // Комфортное расстояние между иконкой раздела и текстом
    alignItems: 'center',
  },
  textColumn: {
    flexDirection: 'column', 
    flex: 1, // Позволяет текстам сжиматься и использовать многоточие, не ломая верстку
  },
  cardRowText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardRowLabel: {
    fontSize: 13,
    marginTop: 2,
  },    
  chevronContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8, // Зазор, чтобы длинный текст не прилипал к шеврону
  },
});
