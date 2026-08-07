import PaginationItem from '@/components/items/PaginationItem';
import { Context } from '@/context/context';
import { setData } from '@/store/setData';
import PagerView, { type PagerViewRef } from '@expo/ui/community/pager-view';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useContext, useRef, useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OnboardingScreen = ({ path, title, text }: { path: string, title: string, text: string, }) => {

  return (
    <View style={{ height: '100%', flexDirection: 'column' }}>
      <LottieView style={{ flex: 1 }} source={path} autoPlay loop />
      <View style={{ flexDirection: 'column', alignItems: 'center', padding: 20 }}>
        <Text numberOfLines={2} style={{ color: 'white', fontSize: 28, fontWeight: 'bold', justifyContent: 'center', alignContent: 'center', textAlign: 'center' }}>{title}</Text>
        <Text numberOfLines={3} style={{ color: 'white', fontSize: 20, justifyContent: 'center', alignContent: 'center', textAlign: 'justify', marginHorizontal: 5 }}>{text}</Text>
      </View>
    </View>
  )
}

const onboarding = () => {
  const [page, setPage] = useState(0)
  const pagerRef = useRef<PagerViewRef>(null); 
  const { setOnboarded } = useContext(Context);
  const screen = require('@/assets/animation/Business_plan.json');


  const OnboardingDone = () => {
    setData('onboarded', JSON.stringify(true))
    setOnboarded(true)
    router.push('/')
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#031F2B', paddingTop: 5, flexDirection: 'column', justifyContent: 'center' }}>
      <View style={{ alignItems:'flex-end', justifyContent:'center'}}>
        <Pressable style={{marginEnd:30, borderRadius:15, borderWidth:2, borderColor:'silver'}} onPress={OnboardingDone}>
          <MaterialDesignIcons name='window-close' color={'silver'} size={36}/>
        </Pressable>
      </View>
      <View style={{ height: '70%' }}>
        <PagerView
          ref={pagerRef}
          style={{ flex: 1 }}
          initialPage={0}
          onPageSelected={event => {
            setPage(event.nativeEvent.position)
          }}>
          <View style={{ height: '100%', flexDirection: 'column', justifyContent: 'center' }}>
            <ImageBackground source={require('@/assets/images/icon.png')} style={{ width: 'auto', height: '91%', justifyContent: 'flex-end', gap: 10, padding: 20  }}>
              <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold', justifyContent: 'center', alignContent: 'center', textAlign: 'center', marginHorizontal: 5 }}>{'Добро пожаловать в Хелдон!'}</Text>
              <Text numberOfLines={3} style={{ color: 'white', fontSize: 20, justifyContent: 'center', alignContent: 'center', textAlign: 'justify', marginHorizontal: 5 }}>{'Хелдон - ваш личный помощник для эффективного планирования времени'}</Text>
            </ImageBackground>
            {/* <Image source={require('@/assets/images/icon.png')} style={{width:'100%',}} /> */}
          </View>
          <OnboardingScreen
            path={screen}
            title='Наведите порядок в хаосе дел и планов'
            text='Создавайте задачи и равномерно распределяйте их по датам, чтобы избежать суеты'
          />
          <OnboardingScreen
            path={require('@/assets/animation/Growth_Assistance.json')}
            title="Повышайте эффективность"
            text='Ежедневный контроль задач - гарантия результативного проведения дня'
          />
          <OnboardingScreen
            path={require('@/assets/animation/Rotate_a_chart.json')}
            title='Анализируйте план задач'
            text="Анализ плана задач поможет равномерно распределять усилия по всем сферам жизни"
          />
          <OnboardingScreen
            path={require('@/assets/animation/Successful_target.json')}
            title='Достигайте целей'
            text="Выполняйте поставленные задачи, плодотворно проводя время и достигая своих целей"
          />
        </PagerView>
      </View>
      <View style={{ flexDirection: 'column', alignItems: 'center', gap:15}}>
        <View style={{ width: '50%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <PaginationItem onPress={() => pagerRef.current?.setPage(0)} value={0} currentValue={page} />
          <PaginationItem onPress={() => pagerRef.current?.setPage(1)} value={1} currentValue={page} />
          <PaginationItem onPress={() => pagerRef.current?.setPage(2)} value={2} currentValue={page} />
          <PaginationItem onPress={() => pagerRef.current?.setPage(3)} value={3} currentValue={page} />
          <PaginationItem onPress={() => pagerRef.current?.setPage(4)} value={4} currentValue={page} />
        </View>
        {page !== 4 && <View
          style={{ padding: 5, borderRadius: 5, width: '50%', margin: 'auto', justifyContent:'center', alignItems:'center' }}>
          <Text style={{ color: '#031F2B', fontWeight: 'bold', fontSize: 20 }}>Готово</Text>
        </View> }
        {page === 4 && <Pressable
          onPress={OnboardingDone}
          style={{ backgroundColor: '#007aff', padding: 5, borderRadius: 5, width: '50%', margin: 'auto', justifyContent:'center', alignItems:'center' }}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Готово</Text>
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
          {/* <OnboardingScreen 
                      path={require('@/assets/animation/Holding_value.json')} 
                      title='Выполняйте ежедневный план дел' 
                      text='Ежедневно контролируйте выполнение поставленных задач, что ваши дни были плодотворными'
                    /> */}
          {/* <OnboardingScreen 
                      path={require('@/assets/animation/Task_Loader.json')} 
                      title='Достигайте свои цели' 
                      text="Выполняйте поставленные задачи, плодотворно проводя время и достигая своих целей"
                    /> */}
          {/* <OnboardingScreen 
                      path={require('@/assets/animation/The_idea_of_change.json')} 
                      title='Welcome!!!'
                      text="" 
                    />
                    <OnboardingScreen 
                      path={require('@/assets/animation/Web_Design.json')} 
                      title='Welcome!!!'
                      text=""
                    /> */}