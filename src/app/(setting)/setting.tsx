import CategoryBottomSheet from '@/components/bottomSheet/CategoryBottomSheet';
import PriorityBottomSheet from '@/components/bottomSheet/PriorityBottomSheet';
import NavigationButton from '@/components/buttons/NavigationButton';
import CardRow from '@/components/CardRow';
import { Context } from '@/context/context';
import CategoryData from '@/data/CategoryData';
import PriorityData from '@/data/PriorityData';
import { setData } from '@/store/setData';
import BottomSheet, { BottomSheetMethods, BottomSheetView } from '@expo/ui/community/bottom-sheet';
import DateTimePicker from '@expo/ui/community/datetime-picker';
import { router } from 'expo-router';
import { RefObject, useContext, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const settings = () => {
  const { defaultCategory, setDefaultCategory, defaultPriority, setDefaultPriority, defaultTime, setDefaultTime, defaultNotify, setDefaultNotify } = useContext(Context);
  const pkg = require('@/../package.json')
  const appVersion = pkg.version;
  const [time, setTime] = useState(new Date())
  const [show, setShow] = useState(false);
  const sheetPriorityRef = useRef<BottomSheet>(null);
  const sheetCategoryRef = useRef<BottomSheet>(null);

  const changeDefaultCategory = (id: string) => {
    setDefaultCategory(id);
    setData('defaultCategory', JSON.stringify(id))
  }

  const changeDefaultPriority = (id: string) => {
    setDefaultPriority(id);
    setData('defaultPriority', JSON.stringify(id))
  }
  const setRefPriorityBottomSheet = (ref: RefObject<BottomSheetMethods | null>, index: number) => {
    ref.current?.snapToIndex(index)
  }

  const setRefCategoryBottomSheet = (ref: RefObject<BottomSheetMethods | null>, index: number) => {
    ref.current?.snapToIndex(index)
  }

  const changeDefaultNotify =()=>{
    setData('defaultNotify', JSON.stringify(!defaultNotify)) 
    setDefaultNotify(!defaultNotify)      
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
            const time = selectedDate.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
            setDefaultTime(time)
            setData('defaultTime', JSON.stringify(time))
            setTime(selectedDate)
            setShow(false);
          }}
          onDismiss={() => {
            setShow(false);
          }}
        />)
      }
      <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 10, gap:10 }}>
        <NavigationButton onPress={()=>router.back()} icon={'arrow-left'} size={38}/>
        <View style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
          <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>{'Настройки'}</Text>
          <Text style={{ color: '#7a92a5', fontSize: 16 }}>{'приложения и аккаунта'}</Text>
        </View>
      </View>    
      <BottomSheetView style={{ flex: 1 }}>
        <View style={{ flexDirection: 'column', gap: 10, paddingHorizontal: 10, }} >
          <Text style={{ color: '#7a92a5', fontSize: 16, fontWeight: 'bold', paddingHorizontal: 10, marginTop:5 }}>Системные</Text>
          <View style={{ backgroundColor: '#263238', padding: 10, borderRadius: 15, gap: 10 }}>
            <CardRow
              title='Язык'
              text={'Русский'}
              icon={'web'}
              iconBackColor={'#263238'}
              iconColor={'white'}
              onPress={() => null}
            />
            <CardRow
              title='Стиль'
              text={'Классический'}
              icon={'weather-night'}
              iconBackColor={'#263238'}
              iconColor={'white'}
              onPress={() => null}
            />
          </View>
          <Text style={{ color: '#7a92a5', fontSize: 16, fontWeight: 'bold', paddingHorizontal: 10, marginTop:20 }}>Значения по умолчанию</Text>
          <View style={{ backgroundColor: '#263238', padding: 10, borderRadius: 15, gap: 10 }}>
            <CardRow
              title='Время'
              text={defaultTime}
              icon={'clock'}
              iconBackColor={'#263238'}
              iconColor={'white'}
              onPress={() => setShow(true)}
            />
            <CardRow
              title='Приоритет'
              text={PriorityData[defaultPriority].name.ru}
              icon={PriorityData[defaultPriority].icon}
              iconBackColor={PriorityData[defaultPriority].color}
              iconColor={'white'}
              onPress={() => setRefPriorityBottomSheet(sheetPriorityRef, 0)}
            />
            <CardRow
              title='Категория'
              text={CategoryData[defaultCategory].name.ru}
              icon={CategoryData[defaultCategory].icon}
              iconBackColor={CategoryData[defaultCategory].backColor}
              iconColor={CategoryData[defaultCategory].color}
              onPress={() => setRefCategoryBottomSheet(sheetCategoryRef, 0)}
            />
            <CardRow
              title='Создание уведомлений'
              text={defaultNotify?'Включены':'Выключены'}
              icon={defaultNotify?'bell-ring':'bell-off'}
              iconBackColor={''}
              iconColor={'white'}
              onPress={changeDefaultNotify}
            />            
            {/* <Pressable onPress={() => setData('onboarded', JSON.stringify(false))}>
              <Text style={{ color: 'white' }}>Сбросить онбординг</Text>
            </Pressable> */}
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#7a92a5', fontSize: 16, fontWeight: 'bold', paddingHorizontal: 10 }}>Хелдон {appVersion}</Text>
          </View>
        </View>
        <PriorityBottomSheet
          currentId={PriorityData[defaultPriority].id}
          setValue={changeDefaultPriority}
          setRef={setRefPriorityBottomSheet}
          sheetRef={sheetPriorityRef}
        />
        <CategoryBottomSheet
          currentId={defaultCategory}
          setValue={changeDefaultCategory}
          setRef={setRefCategoryBottomSheet}
          sheetRef={sheetCategoryRef}
        />
      </BottomSheetView>
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