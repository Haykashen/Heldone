
import BottomSheet from '@expo/ui/community/bottom-sheet';
import { useRef } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';

const DATA = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);

const notice = () => {
  const sheetRef = useRef<BottomSheet>(null);

  return (
    <View style={{ flex: 1 }}>
      <Button title="Open" onPress={() => sheetRef.current?.snapToIndex(0)} />

      <BottomSheet ref={sheetRef} snapPoints={['50%', '90%']} index={-1} enablePanDownToClose>
        <FlatList
          nestedScrollEnabled
          style={{ flex: 1 }}
          data={DATA}
          keyExtractor={item => item}
          contentContainerStyle={{ padding: 24 }}
          renderItem={({ item }) => <Text style={{ paddingVertical: 16 }}>{item}</Text>}
        />
      </BottomSheet>
    </View>
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