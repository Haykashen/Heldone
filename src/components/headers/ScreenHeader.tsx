import { Pressable, StyleSheet, Text, View } from 'react-native';

interface ScreenHeaderProps {
  title: string;
  onCancel: () => void;
  onDone: () => void;
  titleColor: string;
  actionColor: string;
}

// Компонент чистый, производительный и легко кастомизируется
const ScreenHeader = ({ title, onCancel, onDone, titleColor, actionColor }: ScreenHeaderProps) => {
  return (
    <View style={styles.topBar}>
      <Pressable onPress={onCancel} style={styles.navButton}>
        <Text style={styles.cancelText}>Отмена</Text>
      </Pressable>
      <Text style={[styles.headerTitle, { color: titleColor }]}>{title}</Text>
      <Pressable onPress={onDone} style={styles.navButton}>
        <Text style={[styles.doneText, { color: actionColor }]}>Готово</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  navButton: {
    padding: 4,
  },
  cancelText: {
    color: 'silver',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  doneText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScreenHeader;
