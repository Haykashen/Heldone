import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

export type TCardRow = {
  title: string;
  text: string;
  icon: string;
  value: boolean;
  iconColor: string;
  onPress: () => void;
};

const CardRowSwitch = ({ title, text, icon, iconColor, value, onPress }: TCardRow) => {
  
  return (
    <Pressable onPress={onPress}  style={styles.cardRow}>
      <View style={styles.cardRowContainer}>
        <MaterialDesignIcons name={icon as any} color={iconColor} size={26} />
        <View style={{ flexDirection: 'column', width: 'auto' }}>
          <Text style={styles.cardRowText} numberOfLines={1} ellipsizeMode="tail">{text}</Text>
          <Text style={styles.cardRowLabel}>{title}</Text>
        </View>
      </View>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        ios_backgroundColor="#3e3e3e"
        //onValueChange={onPress}
        value={value}
      />
    </Pressable>
  );
};

export default CardRowSwitch;

const styles = StyleSheet.create({
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%', // Гарантирует растяжение по всей ширине родителя
  },
  cardRowLabel: {
    color: 'white',   
    fontSize: 14,
   // flexShrink: 1,  Позволяет заголовку сжиматься, если текст справа слишком длинный
  },  
  cardRowContainer: {
    flex: 1, 
    flexDirection: 'row', 
    gap: 10, 
    alignItems: 'center'
  },  
  // cardRowPressable: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'flex-end',
  //   gap: 5,
  //   flex: 1, // Позволяет кликабельной зоне занимать оставшееся пространство
  // },
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