import { Pressable, StyleSheet, Text, View } from 'react-native';

export type TSettingRow = {
    title: string,
    text: string,
    onPress: () => void
}

const SettingRow = ({ title, text, onPress }: TSettingRow) => {

    const handlePress = () => {
        onPress()
    }
    return (
        <View style={styles.setting_row}>
            <Text style={styles.setting_row_label}>{title}</Text>
            <Pressable onPress={handlePress}>
                <Text style={styles.setting_row_text}>{text}</Text>
            </Pressable>
        </View>
    )
}

export default SettingRow


const styles = StyleSheet.create({
    setting_row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    setting_row_text: {
        color: 'white',
        fontSize: 16,
    },
    setting_row_label: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }, 
});