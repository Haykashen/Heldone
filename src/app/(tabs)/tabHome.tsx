
import DateTimePicker from '@expo/ui/community/datetime-picker';
import { router } from "expo-router";
import { useState } from "react";
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';

const home = () => {
  const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
  return (
    <View style={{ flex: 1, alignItems: 'center', width: '100%', flexDirection: 'column', gap: 10, paddingHorizontal: 5 }}>
      <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ color: 'green' }}>Tasks</Text>
        <Pressable onPress={() => router.push('/notice')}>
        </Pressable>
      <Button title="Pick a date" onPress={() => setShow(true)} />
      {show && (
        <DateTimePicker
          value={date}
          onValueChange={(event, selectedDate) => {
            setShow(false);
            setDate(selectedDate);
          }}
          onDismiss={() => {
            setShow(false);
          }}
          mode="date"
          presentation="dialog"
        />
      )}
      </View>
    </View>  
  )
}

export default home

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
  button:{
    flex:1,  
    alignItems:'center', 
    justifyContent:'center',
    color:'white',
    fontWeight: 'bold', 
    fontSize: 16 
  }
});