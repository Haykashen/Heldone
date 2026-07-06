import { ITranslate } from "@/utils/types";
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ListEpmtyComponent = () => {
  
  const hanlePress =()=>{
    router.push('/new')
  }

  return (
    //<SafeAreaProvider>    </SafeAreaProvider>
      <SafeAreaView style={{
        //marginTop:40,
        padding: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        flexDirection: 'row',
      }}>
        <Pressable onPress={hanlePress} style={{flexDirection:'row', alignContent:'center', flex:1, alignItems:'center', justifyContent:'space-around'}}>
          <View style={{flexDirection:'column', alignContent:'center',alignItems:'center', justifyContent:'center'}}>
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 16, justifyContent:'center', alignContent:'center'}}>{translate.FirstRow['ru']}</Text>           
          <Text style={{color: 'black', fontSize: 14, justifyContent:'center', alignContent:'center'}}>{translate.SecondRow['ru']}</Text>
          <Text style={{color: 'black', fontSize: 14, justifyContent:'center', alignContent:'center'}}>{translate.ThirdRow['ru']}</Text>            
          </View>
          <MaterialDesignIcons name="playlist-plus" size={44} color='#007aff' />          
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

const translate:ITranslate ={
  FirstRow:{
    ru:'У вас пока нет никаких заданий!',
    en:'You dont have any tasks yet!'
  },
  SecondRow:{
    ru:'Добавьте задачу,',
    en:'Add new tasks'
  },
  ThirdRow:{
    ru:'чтобы сделать ваш день продуктивным.',
    en:'to make your days productive.'
  },}