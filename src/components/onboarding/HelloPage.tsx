import { Image, StyleSheet, Text, View } from "react-native";

const HelloPage = () => {

  return (
    <View style={[{ flex: 1, flexDirection: 'column', alignItems: 'center', padding: 10 },]}>
      <Image source={require('@/assets/images/icon.png')} style={styles.lottie} resizeMode='contain' />
      <View style={styles.onboarding_view}>
        <View>
          <Text numberOfLines={1} style={styles.onboarding_title}>{'Добро пожаловать'}</Text>
          <Text numberOfLines={1} style={styles.onboarding_title}>{'в Heldone!'}</Text>
        </View>
        <Text numberOfLines={4} style={styles.onboarding_text}>{'Хелдон - ваш личный помощник для эффективного планирования и управления временем'}</Text>
      </View>
    </View>
  )
}

export default HelloPage

const styles = StyleSheet.create({
  onboarding_container:{
    height: '100%', 
    flexDirection: 'column', 
    padding:10 
  }, 
  lottie:{
   flex: 1   
  },  
  onboarding_title:{ 
    color: 'white', 
    fontSize: 28, 
    fontWeight:'bold',
    justifyContent: 'center', 
    alignContent: 'center', 
    textAlign: 'left',
    paddingLeft:5 
  },
  onboarding_text:{ 
    color: 'white', 
    fontSize: 18, 
    justifyContent: 'center', 
    alignContent: 'center', 
    textAlign: 'left', 
    marginHorizontal: 5 
  },
  onboarding_view:{ 
    flexDirection: 'column', 
    alignItems: 'flex-start', 
    padding: 20 ,
    gap:10
  }
});