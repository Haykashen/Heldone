import { router } from "expo-router";
//import { useContext } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native"; // TouchableOpacity,  FlatList, Image,Text, 
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import { Context } from './context/context';
// import { ITranslate } from "./utils/types";

const notice = () => {

  //const { language, theme } = useContext(Context);  
  //const styles = style(theme)  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        gap: 5,
        padding: 5,
      }}>
        <View style={{ maxWidth: 1260, width: '100%', paddingHorizontal: 10, gap: 5 }}>
          <View style={{ backgroundColor: 'grey', width: 45, height: 2, borderRadius: 20, marginHorizontal: 'auto', marginTop: 5 }}></View>
          <View style={{ height: 30, flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: 'green' }}>Notice</Text>
            <Pressable style={{ height: '100%', alignItems: 'baseline' }} onPress={() => router.push('/notice')}>
              <Text style={{ color: 'silver' }}>Отметить все</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default notice   

// const translate:ITranslate ={
//   title:{
//     ru:'Уведомление',
//     en:'Notice'
//   }
// }

const style = (Theme:any)=> StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bg_Primary,
    alignItems:'center',
    gap:5,
    padding:5,
  },
  textHeader:{
    color: Theme.colors.text_Primary, 
    fontSize:22,
    fontWeight:'bold'
  },
});