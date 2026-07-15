import Priority from '@/components/buttons/Priority';
import CategoryItem from '@/components/items/CategoryItem';
import { Context } from '@/context/context';
import CategoryData from '@/data/CategoryData';
import PriorityData from '@/data/PriorityData';
import { setData } from '@/store/setData';
import { useContext } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const settings = () => {
  const { defaultCategory, setDefaultCategory, defaultPriority, setDefaultPriority} = useContext(Context);  
  const pkg = require('@/../package.json')
  const appVersion = pkg.version;

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#031F2B', paddingTop: 5, flexDirection: 'column', gap: 10 }}>
      <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 10 }}>
        <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Настройки</Text>
      </View>
      <View style={{ width: '100%', paddingHorizontal: 10, gap: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: 'white', fontSize: 16 }}>Язык</Text>
          <Text style={{ color: 'white', fontSize: 16 }}>Русский</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: 'white', fontSize: 16 }}>Стиль</Text>
          <Pressable>
            <Text style={{ color: 'white', fontSize: 16 }}>Классический</Text>
          </Pressable>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: 'white', fontSize: 16 }}>Категория по умолчанию</Text>
          <Pressable>
            <Text style={{ color: 'white', fontSize: 16 }}>{CategoryData[defaultCategory].name.ru}</Text>
          </Pressable>
        </View>
        <FlatList
          nestedScrollEnabled
          horizontal
          //style={{ width: '100%', gap:30}}
          contentContainerStyle={{ gap: 10 }}
          data={Object.values(CategoryData)}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <CategoryItem categoryID={item.id} currentID={defaultCategory} onPressCategory={changeDefaultCategory} />}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: 'white', fontSize: 16 }}>Приоритет по умолчанию</Text>
          <Text style={{ color: 'white', fontSize: 16 }}>{PriorityData[defaultPriority].name.ru}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
          <Priority currValue={defaultPriority} changePriority={changeDefaultPriority} priority={PriorityData.High.id} />
          <Priority currValue={defaultPriority} changePriority={changeDefaultPriority} priority={PriorityData.Medium.id} />
          <Priority currValue={defaultPriority} changePriority={changeDefaultPriority} priority={PriorityData.Low.id} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: 'white', fontSize: 16 }}>Версия</Text>
          <Text style={{ color: 'white', fontSize: 16 }}>{appVersion}</Text>
        </View>
      </View>
    </SafeAreaView>
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
