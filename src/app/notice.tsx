
import Categorys from '@/data/Category';
import BottomSheet from '@expo/ui/community/bottom-sheet';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { router } from 'expo-router';
import { useRef } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DATA = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);

const notice = () => {
  const sheetRef = useRef<BottomSheet>(null);

  return (
    <SafeAreaView style={{ height: 'auto', backgroundColor: '#031F2B', paddingTop: 5, flexDirection: 'column', gap: 10 }}>
      <View style={{ flex: 1 }}>
        {/* <Button title="Open" onPress={() => sheetRef.current?.snapToIndex(0)} /> */}
        <BottomSheet
          ref={sheetRef}
          snapPoints={['50%', '90%']}
          index={0} //-1
          enablePanDownToClose
          onClose={() => router.back()}
          style={{}}
        >
          <FlatList
            nestedScrollEnabled
            style={{ flex: 1 }}
            data={Object.values(Categorys)}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 24,backgroundColor:'#1f1f1d' }}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', gap:10, backgroundColor: '#2c2c2a', borderRadius: 15, alignItems:'center' }}>
                <View style={{ height: 50, width: 50, backgroundColor: item.backColor, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialDesignIcons name={item.icon as any} color={item.color} size={38} />
                </View>
                <Text style={{ paddingVertical: 16, marginBottom: 10, color: 'white' }}>{item.name.ru}</Text>
              </View>)}
            ItemSeparatorComponent={<View style={{ height: 10 }}></View>}
          />
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