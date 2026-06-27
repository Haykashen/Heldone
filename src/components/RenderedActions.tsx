 import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, View } from "react-native";

interface IActionProps {
  Complete: () => void,
  Open: () => void,
  Dellete: () => void,
  statusIcon: any
}

const RenderedActions = (props: IActionProps) => {
    const {Complete, Open, Dellete, statusIcon} = props;
    const styles = style();

  return(
    <View style={styles.actionsContainer}>
      <Pressable onPress={()=>Complete()} style={[styles.button, styles.complete]}>
        <MaterialCommunityIcons name={statusIcon} color="white" size={24} />
      </Pressable>
      <Pressable onPress={()=>Open()} style={[styles.button, styles.edit]}>
        <MaterialIcons name="edit" size={24} color="white" />
      </Pressable>
      <Pressable onPress={()=>Dellete()} style={[styles.button, styles.delete]}>
        <Ionicons name='trash-outline' color="white" size={24} />
      </Pressable>
    </View>
  )};

  export default RenderedActions

  const style = (Theme?:any)=> StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    marginTop:2,
    marginLeft:2,
    height: 70,
    alignItems:'center'
  },   
  button: {
    borderRadius: 15,
    marginVertical: 5,
    marginHorizontal:2,  
    width: 65,
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