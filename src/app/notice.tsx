
import Categorys from '@/data/CategoryData';
//import BottomSheet from '@expo/ui/community/bottom-sheet';
import BottomSheet, { BottomSheetView } from '@expo/ui/community/bottom-sheet';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { router } from 'expo-router';
//import { router } from 'expo-router';
import { useRef } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DATA = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);

const notice = () => {
   const sheetRef = useRef<BottomSheet>(null);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <Button label="Open" onPress={() => setIsPresented(true)} /> */}

      <View style={{ flex: 1, marginTop: 60 }}>
        {/* <Button title="Open" onPress={() => sheetRef.current?.snapToIndex(0)} /> */}
        <BottomSheet
          ref={sheetRef}
          index={0}
          snapPoints={['70%', '90%']}
          onClose={()=>router.back()}
          enablePanDownToClose
        >
          <BottomSheetView style={{ flex:1 }}>
            <FlatList
              nestedScrollEnabled
              style={{ flex: 1 }}
              data={Object.values(Categorys)}
              keyExtractor={item => item.id}
              contentContainerStyle={{ padding: 24, backgroundColor: '#031F2B', paddingBottom: 100  }}
              renderItem={({ item }) => (
                <View style={{ flexDirection: 'row', gap: 10, backgroundColor: '#263238', borderRadius: 15, alignItems: 'center' }}>
                  <View style={{ height: 50, width: 50, backgroundColor: item.backColor, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialDesignIcons name={item.icon as any} color={item.color} size={38} />
                  </View>
                  <View style={{alignItems:'center', justifyContent:'center', minWidth:'70%'}}>
                    <Text style={{ paddingVertical: 16, color: 'white' }}>{item.name.ru}</Text>
                  </View>               
                </View>)}
              ItemSeparatorComponent={<View style={{ height: 10 }}></View>}
            />
          </BottomSheetView>
        </BottomSheet>
      </View>
    </SafeAreaView> 
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