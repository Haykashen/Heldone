import { Context } from '@/app/context/context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useContext } from 'react';
import { StyleSheet, Text, View } from "react-native";
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { TItem } from '../../utils/types';
import RenderedActions from '../RenderedActions';


const TaskItem = (props:TItem) => {
  const {id, date, title, category, status, timeStatus, onItemPress, onCompletePress, onDeletePress} = props;
  const { theme } = useContext(Context); 
  const styles = style(theme)
  let datetime = new Date(date).toLocaleDateString()+' '+new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const Open=()=>{
    onItemPress()
  }

  const Dellete = ()=>{
    console.log('Dellete ')
    onDeletePress()//id
  }

  const Complete = ()=>{
    console.log('Complete ')
    onCompletePress()//id
  }  
  


  return (
    <Swipeable renderRightActions={() => <RenderedActions Complete={Complete} Open={Open} Dellete={Dellete} statusIcon={status.icon as any} />}>
      <View style={{ flexDirection: 'row', padding: 10, gap: 10, backgroundColor: theme.colors.bg_Secondary, borderRadius: 15, marginVertical: 2, width: '100%', alignItems: 'center' }}>
        <View style={{ height: 50, width: 50, backgroundColor: category.backColor, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialCommunityIcons name={category.icon as any} color={category.color} size={38} />
        </View>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'flex-start' }}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.itemTitleText, { textAlign: 'left' }]}>{title}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'flex-start' }}>
              <MaterialCommunityIcons name={timeStatus.icon as any} color={timeStatus.color} size={18} />
              <Text style={{ color: '#031F2B'}}>{datetime}</Text>
            </View>
          </View>
        </View>
        <View style={{ height: 50, width: 50, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialCommunityIcons name={status.icon as any} color={status.color} size={32} />
        </View>
      </View>
    </Swipeable>
  )
}
//backgroundColor: 'green', borderRadius: 15,
export default TaskItem


const style = (Theme:any)=> StyleSheet.create({
  list_item_title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlignVertical: "center",
    textAlign: "center",
    color: '#031F2B'
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 2,
    height: 70,
  },   
  button: {
    borderRadius: 15,
    marginVertical: 5,
    marginHorizontal:2,  
    width: 70,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  edit: {
    backgroundColor: '#ffab00',
  },
  delete: {
    backgroundColor: '#ff1744',
  },
  complete:{
    backgroundColor: 'green',    
  },
  itemTitleText: {
    color: '#031F2B',
    fontWeight: 'bold',
    fontSize: 16
  }, 
});
