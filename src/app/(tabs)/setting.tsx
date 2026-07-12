import Categorys from '@/data/Category';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { useRef } from 'react';
import { Animated, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
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
        <View style={{ flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: 'white' }}>Стиль Классический</Text>
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
      {/* <Text>{JSON.stringify(Object.values(Categorys))}</Text> */}
      <FlatList
        //nestedScrollEnabled
        ListEmptyComponent={<Text style={{ color: 'white' }}>Empty</Text>}
        data={Object.values(Categorys)}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 24, backgroundColor: '#1f1f1d' }}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', gap: 10, backgroundColor: '#2c2c2a', borderRadius: 15, alignItems: 'center' }}>
            <View style={{ height: 50, width: 50, backgroundColor: item.backColor, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialDesignIcons name={item.icon as any} color={item.color} size={38} />
            </View>
            <Text style={{ paddingVertical: 16, color: 'white' }}>{item.name.ru}</Text>
          </View>)}
        ItemSeparatorComponent={<View style={{ height: 10 }}></View>}
      />
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
