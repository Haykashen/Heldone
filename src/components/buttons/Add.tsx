import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { router } from "expo-router";
import { Pressable } from "react-native";

const Add =()=>{

  const hanlePress =()=>{
    router.push('/new')
  }

    return(
      <Pressable
        onPress={hanlePress}
        style={{ margin: 10, height: 60, width: 60, borderRadius: 45, backgroundColor: '#007aff', position: 'absolute', bottom: 15, right: 15, alignItems: 'center', justifyContent: 'center' }}>
        <MaterialDesignIcons name={"plus"} size={34} color={"white"} />
      </Pressable>
    )
}

export default Add