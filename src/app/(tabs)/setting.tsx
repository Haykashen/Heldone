import PriorityBottomSheet from '@/components/bottomSheet/PriorityBottomSheet';
import CategoryItem from '@/components/items/CategoryItem';
import SettingRow from '@/components/SettingRow';
import Header from '@/components/TabHeader';
import { Context } from '@/context/context';
import CategoryData from '@/data/CategoryData';
import PriorityData from '@/data/PriorityData';
import { setData } from '@/store/setData';
import BottomSheet, { BottomSheetMethods } from '@expo/ui/community/bottom-sheet';
import DateTimePicker from '@expo/ui/community/datetime-picker';
import LottieView from 'lottie-react-native';
import { RefObject, useContext, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const settings = () => {
  const { defaultCategory, setDefaultCategory, defaultPriority, setDefaultPriority, defaultTime, setDefaultTime} = useContext(Context);  
  const pkg = require('@/../package.json')
  const appVersion = pkg.version;
  const [time,setTime] = useState(new Date())
  const [show, setShow] = useState(false);
  const sheetPriorityRef = useRef<BottomSheet>(null);

  console.log('defaultCategory', defaultCategory)
  console.log('defaultPriority', defaultPriority)

  const changeDefaultCategory =(id:string)=>{
    setDefaultCategory(id);
    setData('defaultCategory', JSON.stringify(id))    
  }

  const changeDefaultPriority =(id:string)=>{
    setDefaultPriority(id);
    setData('defaultPriority', JSON.stringify(id))    
  }
  const setRefPriorityBottomSheet =(ref:RefObject<BottomSheetMethods | null>, index: number)=>{
    ref.current?.snapToIndex(index)
  }
  
  const animation = require('@/assets/animation/Business_plan.json');
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#031F2B', paddingTop: 5, flexDirection: 'column', gap: 25, }}>
      <View style={{height:400}}>
        <LottieView style={{ flex:1 }} source={animation} autoPlay loop />
      </View>
          
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
        <SettingRow title='Категория по умолчанию' text={CategoryData[defaultCategory].name.ru} onPress={() => null} />
        <FlatList
          //initialScrollIndex={}
          nestedScrollEnabled
          horizontal
          contentContainerStyle={{ gap: 10 }}
          data={Object.values(CategoryData)}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <CategoryItem categoryID={item.id} currentID={defaultCategory} onPressCategory={changeDefaultCategory} />}
        />
        <SettingRow title='Приоритет по умолчанию' text={PriorityData[defaultPriority].name.ru} onPress={() => setRefPriorityBottomSheet(sheetPriorityRef, 0)} />
        <SettingRow title='Версия' text={appVersion} onPress={() => null} />
      </View>
      <PriorityBottomSheet
        currentId={PriorityData[defaultPriority].id}
        setValue={changeDefaultPriority}
        setRef={setRefPriorityBottomSheet}
        sheetRef={sheetPriorityRef}
      />
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