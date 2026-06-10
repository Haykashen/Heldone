import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Привет</Text>
      <Pressable onPress={()=>router.push('/tabHome')}><Text>to tabs</Text></Pressable>
      <Pressable onPress={()=>router.push('/1')}><Text>to card</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
