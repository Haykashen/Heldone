import Categorys from '@/data/Category';
import { TCategoryPanel } from '@/utils/types';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { Pressable, StyleSheet, View } from 'react-native';

const CategoryPanel = ({ onPressCategory, category }: TCategoryPanel) => {
    //const styles = style(theme)

    const handlePressCategory = (key: string) => {
        console.log('handlePressCategory')
        onPressCategory(key)//id
    }

    let CategoryItems = []
    for (let key in Categorys) {
        let categoryID: string = (key.split('').join(''));
        let color = categoryID === category ? 'silver' : '#263238'; //Theme.colors.bg_input backgroundColor: Categorys[key].backColor,

        CategoryItems.push(
            <Pressable 
              key={key}
              onPress={() => handlePressCategory(key)} 
              style={{flexDirection: 'row', gap: 3, padding: 5, borderWidth: 2, borderRadius: 10, borderColor: color }}>
              <MaterialDesignIcons name={Categorys[key].icon as any} color={Categorys[key].color} size={32} />
                {/* <Text style={{ color: 'white' }}>{Categorys[key].name[language]}</Text> */}
            </Pressable>
        )
    }
    return (
        <View style={{ flexDirection: 'row', width: '100%', justifyContent:'space-around',  }}>
            {CategoryItems}
        </View>
    )
}

export default CategoryPanel

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