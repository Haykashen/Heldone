import { Context } from '@/app/context/context';
import { ITranslate } from "@/app/utils/types";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
//import Octicons from '@expo/vector-icons/Octicons';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const ListEpmtyComponent = () => {
  const { language, theme } = useContext(Context);
  const styles = style(theme)
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={{alignContent:'center', flex:1, alignItems:'center', justifyContent:'center', paddingVertical:25}}>
          <FontAwesome6 name="list-check" size={96} color="#4894FE" />
          {/* <Octicons name="checklist" size={96} color="#4894FE" /> */}
          <Text style={{color:'white', justifyContent:'center', alignContent:'center'}}>{translate.FirstRow[language]}</Text>           
          <Text style={{color:'white', justifyContent:'center', alignContent:'center'}}>{translate.SecondRow[language]}</Text>
          <Text style={{color:'white', justifyContent:'center', alignContent:'center'}}>{translate.ThirdRow[language]}</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
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
    ru:'Добавляйте новые задачи,',
    en:'Add new tasks'
  },
  ThirdRow:{
    ru:'чтобы сделать ваши дни продуктивными.',
    en:'to make your days productive.'
  },}