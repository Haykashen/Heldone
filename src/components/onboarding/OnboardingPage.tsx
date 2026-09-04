import LottieView from "lottie-react-native"
import { StyleSheet, Text, View } from "react-native"

type TOnboardingPage ={ path: string, titleFirst: string, titleSecond: string, text: string }

const OnboardingPage = ({ path, titleFirst, titleSecond, text }: TOnboardingPage) => {

  return (
    <View style={styles.onboarding_container}>
      <LottieView style={styles.lottie} source={path} autoPlay loop />
      <View style={styles.onboarding_view}>
        <View>
          <Text numberOfLines={1} style={styles.onboarding_title}>{titleFirst}</Text>
          <Text numberOfLines={1} style={styles.onboarding_title}>{titleSecond}</Text>
        </View>
        <Text numberOfLines={4} style={styles.onboarding_text}>{text}</Text>
      </View>
    </View>
  )
}

export default OnboardingPage

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