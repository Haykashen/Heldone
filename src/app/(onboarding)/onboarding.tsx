import { Context } from '@/context/context';
import { setData } from '@/store/setData';
import { scaleEnd, scaleStart } from '@/utils/animation';
import PagerView, { type PagerViewRef } from '@expo/ui/community/pager-view';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useContext, useRef, useState } from 'react';
import { Animated, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OnboardingScreen = ({ path, title, text }: { path: string, title: string, text: string,  }) => {

    return (
        <View style={{ height: '100%', flexDirection: 'column' }}>
            <LottieView style={{ flex: 1 }} source={path} autoPlay loop />
            <View style={{ flexDirection: 'column', alignItems: 'center', padding: 20 }}>
                <Text numberOfLines={2} style={{ color: 'white', fontSize: 28, fontWeight: 'bold', justifyContent: 'center', alignContent: 'center', textAlign: 'center' }}>{title}</Text>
                <Text numberOfLines={3} style={{ color: 'white', fontSize: 20, justifyContent: 'center', alignContent: 'center', textAlign: 'center'}}>{text}</Text>
            </View>
        </View>
    )
}

const onboarding = () => {
    const [page, setPage] = useState(0)
    const pagerRef = useRef<PagerViewRef>(null);
    const { setOnboarded } = useContext(Context);
  const scale = useRef(new Animated.Value(1)).current;
    const screen = require('@/assets/animation/Business_plan.json');

  // Функция для анимации нажатия
  const handlePressIn = () => {
    scaleStart(scale, 1.7)
  };

  // Возврат к обычному размеру
  const handlePressOut = () => {
    scaleEnd(scale, 1)
  };
    const OnboardingDone = ()=>{
      setData('onboarded', JSON.stringify(true))
      setOnboarded(true)
      router.push('/')
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#031F2B', paddingTop: 5, flexDirection: 'column', gap: 25, justifyContent:'center'}}>
            <View style={{ height:'70%' }}>
                <PagerView
                    ref={pagerRef}
                    style={{ flex: 1 }}
                    initialPage={0}
                    onPageSelected={event => {
                        setPage(event.nativeEvent.position)
                        console.log('selected page', event.nativeEvent.position);
                    }}>
                    <View style={{ height: '100%', flexDirection: 'column', justifyContent: 'center' }}>
                        <Animated.View style={{ transform: [{ scale }] }}>
                            <ImageBackground source={require('@/assets/images/icon.png')} style={{ width: 'auto', height: '91%', justifyContent: 'flex-end', gap: 10 }}>
                                <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold', justifyContent: 'center', alignContent: 'center', textAlign: 'center', marginHorizontal:5 }}>{'Добро пожаловать в Хелдон!'}</Text>
                                <Text numberOfLines={3} style={{ color: 'white', fontSize: 20, justifyContent: 'center', alignContent: 'center', textAlign: 'justify', marginHorizontal:5  }}>{'Хелдон - ваш личный помощник для эффективного планирования времени'}</Text>

                            </ImageBackground>
                            {/* <Image source={require('@/assets/images/icon.png')} style={{width:'100%',}} /> */}
                        </Animated.View>
                    </View>

                    <OnboardingScreen
                      path={screen} 
                      title='Наведите порядок в хаосе дел и планов' 
                      text='Создавайте задачи и распределяйте их на необходимые даты, чтобы избежать суеты'
                    />
                    <OnboardingScreen 
                      path={require('@/assets/animation/Growth_Assistance.json')} 
                      title=""
                      text='Создавайте задачи и распределяйте их на необходимые даты, чтобы избежать суеты'
                    />
                    <OnboardingScreen 
                      path={require('@/assets/animation/Holding_value.json')} 
                      title='Выполняйте ежедневный план дел' 
                      text='Ежедневно контролируйте выполнение поставленных задач, что ваши дни были плодотворными'
                    />
                    <OnboardingScreen 
                      path={require('@/assets/animation/Rotate_a_chart.json')} 
                      title='Welcome!!!'
                      text=""
                    />
                    <OnboardingScreen 
                      path={require('@/assets/animation/Successful_target.json')} 
                      title='Welcome!!!'
                      text="" 
                    />
                    <OnboardingScreen 
                      path={require('@/assets/animation/Task_Loader.json')} 
                      title='Welcome!!!' 
                      text=""
                    />
                    <OnboardingScreen 
                      path={require('@/assets/animation/The_idea_of_change.json')} 
                      title='Welcome!!!'
                      text="" 
                    />
                    <OnboardingScreen 
                      path={require('@/assets/animation/Web_Design.json')} 
                      title='Welcome!!!'
                      text=""
                    />
                </PagerView>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Pressable onPress={() => pagerRef.current?.setPage(page === 7 ? 0 : page + 1)}>
                    <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Go to page {page + 1}</Text>
                </Pressable>
                {page === 7 && <Pressable onPress={OnboardingDone}>
                    <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Done</Text>
                </Pressable>}                
            </View>
        </SafeAreaView>
    )
}

export default onboarding

const styles = StyleSheet.create({
    setting_row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    page: { flex: 1, alignItems: 'center', justifyContent: 'center' },


});