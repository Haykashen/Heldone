import Priority from '@/components/buttons/Priority';
import CategoryItem from '@/components/items/CategoryItem';
import SettingRow from '@/components/SettingRow';
import Header from '@/components/TabHeader';
import { Context } from '@/context/context';
import CategoryData from '@/data/CategoryData';
import PriorityData from '@/data/PriorityData';
import { setData } from '@/store/setData';
import DateTimePicker from '@expo/ui/community/datetime-picker';
import { useContext, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const settings = () => {
  const { defaultCategory, setDefaultCategory, defaultPriority, setDefaultPriority, defaultTime, setDefaultTime} = useContext(Context);  
  const pkg = require('@/../package.json')
  const appVersion = pkg.version;
  const [time,setTime] = useState(new Date())
  const [show, setShow] = useState(false);

  // const defaultCategory = 'Target';
  // const defaultPriority = 'Low';
  console.log('defaultCategory', defaultCategory)
  console.log('defaultPriority', defaultPriority)
  const changeDefaultCategory =(id:string)=>{
    //alert('категория')
    setDefaultCategory(id);
    setData('defaultCategory', JSON.stringify(id))    
  }

  const changeDefaultPriority =(id:string)=>{
    //alert('Приоритет')
    setDefaultPriority(id);
    setData('defaultPriority', JSON.stringify(id))    
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#031F2B', paddingTop: 5, flexDirection: 'column', gap: 25, }}>
      {show && (
        <DateTimePicker
          mode='time'
          locale='ru_RU'
          presentation="dialog"
          value={time}
          onValueChange={(event, selectedDate) => {
            setDefaultTime(selectedDate.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }))
            setTime(selectedDate)
            setShow(false);
          }}
          onDismiss={() => {
            setShow(false);
          }}
        />)
      }
      <Header title='Настройки' text='приложения и аккаунта' />
      <View style={{ flexDirection: 'column', gap: 10, paddingHorizontal: 10 }} >
        <SettingRow title='Язык' text='Русский' onPress={() => null} />
        <SettingRow title='Стиль' text='Классический' onPress={() => null} />
        <SettingRow title='Время по умолчанию' text={defaultTime} onPress={() => setShow(true)} />
        <SettingRow title='Категория по умолчанию' text={CategoryData[defaultCategory].name.ru} onPress={() => setShow(true)} />
        <View>
          <FlatList
            //initialScrollIndex={}
            nestedScrollEnabled
            horizontal
            //style={{ width: '100%', gap:30}}
            contentContainerStyle={{ gap: 10 }}
            data={Object.values(CategoryData)}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <CategoryItem categoryID={item.id} currentID={defaultCategory} onPressCategory={changeDefaultCategory} />}
          />
        </View>
        <SettingRow title='Приоритет по умолчанию' text={PriorityData[defaultPriority].name.ru} onPress={() => null} />
        <View style={styles.setting_row}>
          <Priority currValue={defaultPriority} changePriority={changeDefaultPriority} priority={PriorityData.High.id} />
          <Priority currValue={defaultPriority} changePriority={changeDefaultPriority} priority={PriorityData.Medium.id} />
          <Priority currValue={defaultPriority} changePriority={changeDefaultPriority} priority={PriorityData.Low.id} />
        </View>
        <SettingRow title='Версия' text={appVersion} onPress={() => null} />
      </View>
    </SafeAreaView>
  )
}

export default settings

const styles = StyleSheet.create({
  setting_row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center', 
  },

});