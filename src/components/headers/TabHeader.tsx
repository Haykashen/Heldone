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


// import NavigationButton from '@/components/buttons/NavigationButton';
// import { THeader } from '@/components/types/types';
// import { router } from 'expo-router';
// import { useCallback } from 'react';
// import { StyleSheet, Text, View } from 'react-native';

// const Header = ({ title, text }: THeader) => {
  
//   // Мемоизируем переход, чтобы не пересоздавать функцию при каждом рендере экрана
//   const handlePressSettings = useCallback(() => {
//     router.push('/setting'); 
//   }, []);

//   return (
//     <View style={styles.headerContainer}>
//       <View style={styles.textColumn}>
//         <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
//           {title}
//         </Text>
//         <Text style={styles.subtitleText} numberOfLines={1} ellipsizeMode="tail">
//           {text}
//         </Text>
//       </View>
//       <NavigationButton 
//         onPress={handlePressSettings} 
//         icon="cog" 
//         size={38} 
//       />
//     </View>    
//   );
// };

// export default Header;

// const styles = StyleSheet.create({
//   headerContainer: {
//     flexDirection: 'row',
//     width: '100%',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//   },
//   textColumn: {
//     flexDirection: 'column',
//     justifyContent: 'flex-start',
//     flex: 1, // Позволяет колонке занимать все доступное место, не выталкивая кнопку
//     marginRight: 10, // Отступ, чтобы текст никогда не прижимался вплотную к шестеренке
//   },
//   titleText: {
//     color: 'white',
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   subtitleText: {
//     color: '#7a92a5',
//     fontSize: 16,
//   },
// });

import NavigationButton from '@/components/buttons/NavigationButton';
import { THeader } from '@/components/types/types';
import { useAppColors } from '@/context/ThemeContext'; // Импортируем хук темы
import { router } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Header = ({ title, text }: THeader) => {
  // Получаем текущую тему из контекста
  const colors = useAppColors(); // Вся палитра доступна здесь автоматически!

  // Мемоизируем переход на экран настроек
  const handlePressSettings = useCallback(() => {
    router.push('/setting'); 
  }, []);

  // // Динамическая палитра цветов для текстов заголовка
  // const colors = theme === 'dark' ? {
  //   titleText: 'white',
  //   subtitleText: '#7a92a5',
  // } : {
  //   titleText: '#1E293B',    // Глубокий темный сланец для светлой темы
  //   subtitleText: '#64748B', // Спокойный серый
  // };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.textColumn}>
        <Text 
          style={[styles.titleText, { color: colors.titleText }]} 
          numberOfLines={1} 
          ellipsizeMode="tail"
        >
          {title}
        </Text>
        <Text 
          style={[styles.subtitleText, { color: colors.subtitleText }]} 
          numberOfLines={1} 
          ellipsizeMode="tail"
        >
          {text}
        </Text>
      </View>
      
      {/* Прокидываем тему в кнопку, чтобы иконка шестеренки адаптировалась */}
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
    paddingVertical: 8, // Небольшой вертикальный отступ для аккуратности
  },
  textColumn: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flex: 1, 
    marginRight: 10, 
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitleText: {
    fontSize: 16,
    marginTop: 2, // Небольшой просвет между заголовком и датой
  },
});
