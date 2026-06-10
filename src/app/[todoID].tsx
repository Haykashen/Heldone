
import { StyleSheet, Text, View } from "react-native"; //AppState, 
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const taskCard = () => {

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex:1, backgroundColor:'black', justifyContent:'center', alignItems:'center'}}>
          <View style={{backgroundColor:'#272a2d', height:80, width:300, borderRadius:15}}>
            <Text style={{color:'white'}}>Test 666</Text>
          </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default taskCard


const style = (Theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bg_Primary,
    alignItems: 'center',
    gap: 5,
    padding: 5
  },
  textHeader: {
    color: Theme.colors.text_Primary,
    fontSize: 22,
    fontWeight: 'bold'
  },
  text: {
    fontSize: 16,
    color: Theme.colors.text_Secondary
  },
  row:{ 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%' 
  }
});