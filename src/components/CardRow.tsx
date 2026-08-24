import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type TCardRow = {
  title: string;
  text: string;
  icon: string; // Заменили any на string (или специфичный тип из библиотеки иконок)
  iconColor: string;
  onPress: () => void;
};

const CardRow = ({ title, text, icon, iconColor, onPress }: TCardRow) => {
  return (
    <Pressable onPress={onPress} style={styles.cardRow}>
      <View style={styles.cardRowContainer}>
        <MaterialDesignIcons name={icon as any} color={iconColor} size={26} />
        <View style={{ flexDirection: 'column', width: 'auto' }}>
          <Text style={styles.cardRowText} numberOfLines={1} ellipsizeMode="tail">{text}</Text>
          <Text style={styles.cardRowLabel}>{title}</Text>
        </View>
      </View>
      <View style={styles.cardRowPressable}>
        <MaterialDesignIcons name={'chevron-right'} color={iconColor} size={18} />
      </View>
    </Pressable>
  );
};

export default CardRow;

const styles = StyleSheet.create({
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%', // Гарантирует растяжение по всей ширине родителя
  },
  cardRowContainer:{ 
    flex: 1, 
    flexDirection: 'row', 
    gap: 10, 
    alignItems: 'center' 
  },
  cardRowLabel: {
    color: 'white',   
    fontSize: 14,
   // flexShrink: 1,  Позволяет заголовку сжиматься, если текст справа слишком длинный
  },    
  cardRowPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 5,
    flex: 1, // Позволяет кликабельной зоне занимать оставшееся пространство
  },
  cardRowText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
   // maxWidth: '70%',  Ограничиваем максимальную ширину текста значения
  },
  iconContainer: {
    borderRadius: 5,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});