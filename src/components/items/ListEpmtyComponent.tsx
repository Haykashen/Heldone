import { scaleEnd, scaleStart } from '@/utils/animation';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { RelativePathString, router } from "expo-router";
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ListEpmtyComponent = ({ date, title, text }:{date?:string, title:string, text:string }) => {

  const scale = useRef(new Animated.Value(1)).current; 

  const hanlePress =()=>{
    router.push(('/new?day='+date) as RelativePathString)
  }

  // Функция для анимации нажатия
  const handlePressIn = () => {
    scaleStart(scale, 1.5)
  };

  // Возврат к обычному размеру
  const handlePressOut = () => {
    scaleEnd(scale, 1)
  };

  return (
    //<SafeAreaProvider>    </SafeAreaProvider>
    <SafeAreaView style={{
      padding: 20,
      backgroundColor: 'white',
      borderBottomWidth: 1,
      borderBottomColor: 'lightgrey',
      flexDirection: 'row',
    }}>
      <Pressable
        onPress={hanlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ flexDirection: 'column', flex: 1, alignItems: 'center',justifyContent:'center'}}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <MaterialDesignIcons name="playlist-plus" size={64} color='#007aff' />
        </Animated.View>
        <View style={{ flexDirection: 'column', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16, justifyContent: 'center', alignContent: 'center' }}>{title}</Text>
          <Text numberOfLines={2} style={{ color: 'black', fontSize: 14, justifyContent: 'center', alignContent: 'center', textAlign: 'center' }}>{text}</Text>
        </View>
      </Pressable>
    </SafeAreaView>
  )
}

export default ListEpmtyComponent


const style = (Theme:any)=> StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bg_Primary,
    alignItems:'center',
    gap:5,
    padding:5
  },
});