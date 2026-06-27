//import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native"; // TouchableOpacity,  FlatList, Image,Text, 
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
        backgroundColor: 'green',
        alignItems: 'center',
        gap: 5,
        padding: 5,
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'green' }}>Notice</Text>
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