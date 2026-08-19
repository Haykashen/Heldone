// import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
// import { Pressable, StyleSheet, Text, View } from 'react-native';

// export type TCardRow = {
//     title: string,
//     text: string,
//     icon: any,
//     iconColor: string,
//     iconBackColor?: string
//     onPress: () => void
// }

// const CardRow = ({ title, text, icon, iconColor, iconBackColor, onPress }: TCardRow) => {

//     const handlePress = () => {
//         onPress()
//     }
//     return (
//         <View style={styles.card_row}>
//             <Text style={styles.card_row_label}>{title}</Text>
//             <Pressable
//                 onPress={handlePress}
//                 style={styles.card_row_pressable}>
//                 <Text style={styles.card_row_text}>{text}</Text>
//                 <View style={{ backgroundColor: iconBackColor ? iconBackColor: '', borderRadius: 5, padding: 2 }}>
//                     <MaterialDesignIcons name={icon} color={iconColor} size={24} />
//                 </View>     
//             </Pressable>
//         </View>
//     )
// }

// export default CardRow

// const styles = StyleSheet.create({
//     card_row: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center'
//     },
//     card_row_text: {
//         color: 'white',
//         fontSize: 16,
//     },
//     card_row_label: {
//         color: 'white',
//         fontWeight: 'bold',
//         fontSize: 16,
//     },    
//     card_row_pressable: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: 5,
//     }
// });

import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type TCardRow = {
  title: string;
  text: string;
  icon: string; // Заменили any на string (или специфичный тип из библиотеки иконок)
  iconColor: string;
  iconBackColor?: string;
  onPress: () => void;
};

const CardRow = ({ title, text, icon, iconColor, iconBackColor, onPress }: TCardRow) => {
  return (
    <View style={styles.cardRow}>
      <Text style={styles.cardRowLabel}>{title}</Text>
      
      <Pressable
        onPress={onPress} // Передаем напрямую, без лишней функции-обертки
        style={styles.cardRowPressable}
      >
        {/* numberOfLines защитит интерфейс от "расползания" при длинном тексте */}
        <Text 
          style={styles.cardRowText} 
          numberOfLines={1} 
          ellipsizeMode="tail"
        >
          {text}
        </Text>
        
        {/* Безопасная передача цвета: если фона нет, свойство backgroundColor будет undefined */}
        <View style={[styles.iconContainer, iconBackColor ? { backgroundColor: iconBackColor } : undefined]}>
          <MaterialDesignIcons name={icon as any} color={iconColor} size={24} />
        </View>     
      </Pressable>
    </View>
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
  cardRowLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    flexShrink: 1, // Позволяет заголовку сжиматься, если текст справа слишком длинный
    marginRight: 10,
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
    fontSize: 16,
    maxWidth: '70%', // Ограничиваем максимальную ширину текста значения
  },
  iconContainer: {
    borderRadius: 5,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});