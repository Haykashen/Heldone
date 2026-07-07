import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const settings = () => {
  const pkg = require('@/../package.json')
  const appVersion = pkg.version;

  const scale = useRef(new Animated.Value(1)).current;

  // Функция для анимации нажатия
  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95, // уменьшение размера
      useNativeDriver: true
    }).start();
  };

  // Возврат к обычному размеру
  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true
    }).start();
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#031F2B', paddingTop: 5, flexDirection: 'column', gap: 10 }}>
      <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 10 }}>
          <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Профиль</Text>
      </View> 
      <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
        <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Аналитика</Text>
      </View>      
      <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
        <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Настройки</Text>
        <View style={{ flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'space-between'}}>
          <Text style={{ color: 'white' }}>Версия {appVersion}</Text>
        <Pressable 
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}        
        >
          <Animated.View style={{
            backgroundColor: '#388e3c',
            padding: 16,
            borderRadius: 8,
            alignItems: 'center',
            marginVertical: 8, transform: [{ scale }]
          }}>
            <Text style={{ color: '#fff', fontSize: 18 }}>Test</Text>
          </Animated.View>
        </Pressable>           
        </View>
         
      </View>                   
    </SafeAreaView>
  )
}

export default settings

const style = (Theme:any)=> StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bg_Primary,
    alignItems:'center',
    gap:5,
    padding:5
  },
  textHeader:{
    color: Theme.colors.text_Primary, 
    fontSize:22,
    fontWeight:'bold'
  },
  text:{
    fontSize: 16,
    color: Theme.colors.text_Secondary
  },
});
