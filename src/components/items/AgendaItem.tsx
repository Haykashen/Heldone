import TaskStatus from "@/data/TaskStatus";
import { TItem } from "@/utils/types";
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const AgendaItem = (props:TItem) => {
  const {id, date, title, category, status, timeStatus, onItemPress, onCompletePress, onDeletePress} = props;
  const statusName  = status.id === TaskStatus.Completed.id ? status.name.ru : timeStatus.name.ru;
  const statusColor = status.id === TaskStatus.Completed.id ? status.color : timeStatus.color;

  const handleComplete = ()=>{
    console.log('Complete AgendaItem')
    onCompletePress()
  }

  const handleOpen=()=>{
    onItemPress()
  }


  return (
    <Pressable onPress={handleOpen} style={styles.item}>
      <View style={{ width: '20%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 5 }}>
        {/* <Text style={styles.itemHourText}>{date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text> */}
        <MaterialDesignIcons name={category.icon as any} color={category.color} size={38} />
      </View>
      <View style={{ width: '60%', flexDirection:'column' }}>
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.itemTitleText}>{title}</Text>
        <View style={{ width: '100%', flexDirection:'row', alignItems:'center', gap:3 }}>
          <MaterialDesignIcons name={timeStatus.icon as any} color={timeStatus.color} size={18} />
          <Text style={styles.itemHourText}>
            {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - 
            <Text  style={[styles.itemHourText, {color:statusColor}]}> {statusName}</Text>
          </Text>
        </View>       
      </View>
      <Pressable onPress={handleComplete} style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
        <MaterialDesignIcons name={status.icon as any} color={status.color} size={32} />
      </Pressable>
    </Pressable>
  );
};

export default React.memo(AgendaItem);

const styles = StyleSheet.create({
  item: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    flexDirection: 'row',
    gap:10
  },
  itemHourText: {
    color: 'black'
  },
  itemTitleText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16
  },
  itemButtonContainer: {
    flex: 1,
    alignItems: 'flex-end'
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey'
  },
  emptyItemText: {
    color: 'lightgrey',
    fontSize: 14
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
  } 
});