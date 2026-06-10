import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const settings = () => {

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex:1, backgroundColor:'#32312f'}}>
         <View style={{height:80, width:400, backgroundColor:'#464543'}}>
          <Text style={{color:'white'}}>Settings</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
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
