// import NavigationButton from '@/components/buttons/NavigationButton';
// import { THeader } from '@/utils/types';
// import { router } from 'expo-router';
// import { Text, View } from 'react-native';

// const Header = ({title, text}: THeader) => {
    
//     return (
//       <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
//         <View style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
//           <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>{title}</Text>
//           <Text style={{ color: '#7a92a5', fontSize: 16 }}>{text}</Text>
//         </View>
//         <NavigationButton onPress={()=> router.push('/setting')} icon={'cog'} size={38}/>
//       </View>    
//     )
// }

// export default Header


import NavigationButton from '@/components/buttons/NavigationButton';
import { THeader } from '@/utils/types';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Header = ({ title, text }: THeader) => {
  
  // Мемоизируем переход, чтобы не пересоздавать функцию при каждом рендере экрана
  const handlePressSettings = useCallback(() => {
    router.push('/setting'); 
  }, []);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.textColumn}>
        <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
        <Text style={styles.subtitleText} numberOfLines={1} ellipsizeMode="tail">
          {text}
        </Text>
      </View>
      <NavigationButton 
        onPress={handlePressSettings} 
        icon="cog" 
        size={38} 
      />
    </View>    
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  textColumn: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flex: 1, // Позволяет колонке занимать все доступное место, не выталкивая кнопку
    marginRight: 10, // Отступ, чтобы текст никогда не прижимался вплотную к шестеренке
  },
  titleText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitleText: {
    color: '#7a92a5',
    fontSize: 16,
  },
});
