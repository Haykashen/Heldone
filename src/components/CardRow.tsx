import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type TCardRow = {
    title: string,
    text: string,
    icon: any,
    iconColor: string,
    iconBackColor?: string
    onPress: () => void
}

const CardRow = ({ title, text, icon, iconColor, iconBackColor, onPress }: TCardRow) => {

    const handlePress = () => {
        onPress()
    }
    return (
        <View style={styles.card_row}>
            <Text style={styles.card_row_label}>{title}</Text>
            <Pressable
                onPress={handlePress}
                style={styles.card_row_pressable}>
                <Text style={styles.card_row_text}>{text}</Text>
                <View style={{ backgroundColor: iconBackColor ? iconBackColor: '', borderRadius: 5, padding: 2 }}>
                    <MaterialDesignIcons name={icon} color={iconColor} size={24} />
                </View>     
            </Pressable>
        </View>
    )
}

export default CardRow

const styles = StyleSheet.create({
    card_row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    card_row_text: {
        color: 'white',
        fontSize: 16,
    },
    card_row_label: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },    
    card_row_pressable: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
    }
});