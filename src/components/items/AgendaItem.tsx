import { TTask } from "@/utils/types";
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import React, { useCallback } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

interface ItemProps {
  item: TTask;
}

const AgendaItem = (props:ItemProps) => {
  const {item} = props;

  const buttonPressed = useCallback(() => {
    Alert.alert('Show me more');
  }, []);

  if (!item) {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>No Events Planned Today</Text>
      </View>
    );
  }

  return (
      <View style={styles.item}>
        <View style={{width:'20%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 5 }}>
          <Text style={styles.itemHourText}>{new Date(item.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
          <MaterialDesignIcons name={item.category.icon as any} color={item.category.color} size={24} />
        </View>
        <View style={{width:'60%'}}>
          <Text  numberOfLines={1} ellipsizeMode="tail" style={styles.itemTitleText}>{item.title}</Text>
        </View>        
        {/* <View style={styles.itemButtonContainer}>
          <Button color={'grey'} title={'Info'} onPress={buttonPressed} />
        </View> */}
        <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
          <MaterialDesignIcons name={item.status.icon as any} color={item.status.color} size={32} />
        </View>        
      </View>
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
  itemDurationText: {
    color: 'grey',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4
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