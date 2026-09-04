import HelloPage from '@/components/onboarding/HelloPage';
import OnboardingPage from '@/components/onboarding/OnboardingPage';
import PaginationItem from '@/components/onboarding/PaginationItem';
import { OnboardingContext } from '@/context/OnboardingContext';
import { setData } from '@/store/setData';
//import { checkPermissions } from '@/utils/notificationUtils';
import PagerView, { type PagerViewRef } from '@expo/ui/community/pager-view';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { router } from 'expo-router';
import { useContext, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const endIndex = 5;
const Business_plan = require('@/assets/animation/Business_plan.json');
const Growth_assistance = require('@/assets/animation/Growth_Assistance.json')
const Rotate_a_chart = require('@/assets/animation/Rotate_a_chart.json')
const Successful_target = require('@/assets/animation/Successful_target.json')
const Notification = require('@/assets/animation/Notification.json')

const OnboardingScreen = () => {
  const [page, setPage] = useState(0)
  const pagerRef = useRef<PagerViewRef>(null);
  const { setOnboarded } = useContext(OnboardingContext);

  const OnboardingDone = async() => {
    if(page !== endIndex)
      return;
    //await checkPermissions()
    await setData('onboarded', JSON.stringify(true))
    await setOnboarded(true)
    router.push('/')
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.close_container}>
        <Pressable style={styles.close_button} onPress={OnboardingDone}>
          <MaterialDesignIcons name='window-close' color={'silver'} size={36} />
        </Pressable>
      </View>
      <View style={styles.pager_view_container}>
        <PagerView
          ref={pagerRef}
          style={styles.pager_view}
          initialPage={0}
          onPageSelected={event => {
            setPage(event.nativeEvent.position)
          }}>
          <HelloPage/>
          <OnboardingPage
            path={Business_plan}
            titleFirst='Наведите порядок'
            titleSecond='в хаосе дел'
            text='Создавайте задачи и равномерно распределяйте их по датам, чтобы избежать суеты'
          />
          <OnboardingPage
            path={Growth_assistance}
            titleFirst="Повышайте"
            titleSecond='эффективность'
            text='Ежедневный контроль выполнения задач - гарантия результативного проведения дня'
          />
          <OnboardingPage
            path={Rotate_a_chart}
            titleFirst='Анализируйте'
            titleSecond='план задач'
            text="Систематически анализируйте список задач для равномерного распределения усилий"
          />
          <OnboardingPage
            path={Successful_target}
            titleFirst='Достигайте'
            titleSecond='целей'
            text="Выполняйте поставленные задачи, плодотворно проводя время и достигая своих целей"
          />
          <OnboardingPage
            path={Notification}
            titleFirst='Не пропускайте'
            titleSecond='события'
            text="Разрешите приложению отправлять вам уведомления, чтобы не пропускать задачи"
          />                   
        </PagerView>
      </View>
      <View style={styles.footer__container}>
        <View style={styles.pagination_container}>
          <PaginationItem onPress={() => pagerRef.current?.setPage(0)} value={0} currentValue={page} />
          <PaginationItem onPress={() => pagerRef.current?.setPage(1)} value={1} currentValue={page} />
          <PaginationItem onPress={() => pagerRef.current?.setPage(2)} value={2} currentValue={page} />
          <PaginationItem onPress={() => pagerRef.current?.setPage(3)} value={3} currentValue={page} />
          <PaginationItem onPress={() => pagerRef.current?.setPage(4)} value={4} currentValue={page} />
          <PaginationItem onPress={() => pagerRef.current?.setPage(5)} value={5} currentValue={page} />              
        </View>
        <Pressable
          onPress={OnboardingDone}
          style={[page === endIndex && {backgroundColor: '#007aff'}, styles.done_button]}>
          <Text style={{ color: page === endIndex? 'white':'#031F2B', fontWeight: 'bold', fontSize: 20 }}>Разрешить</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default OnboardingScreen

const styles = StyleSheet.create({
  container:{ 
    flex: 1, 
    backgroundColor: '#031F2B', 
    paddingTop: 5, 
    flexDirection: 'column', 
    justifyContent: 'center' 
  },
  close_container:{ 
    alignItems: 'flex-end', 
    justifyContent: 'center' 
  },
  close_button:{ 
    marginEnd: 30, 
    borderRadius: 15, 
    borderWidth: 2, 
    borderColor: 'silver' 
  },
  pager_view_container:{
    height: '70%'
  },
  pager_view:{
    flex: 1
  },
  footer__container:{ 
    flexDirection: 'column', 
    alignItems: 'center', 
    gap: 15 
  },
  pagination_container:{ 
    width: '50%', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  done_button:{
    padding: 5, 
    borderRadius: 5, 
    width: '50%', 
    margin: 'auto', 
    justifyContent: 'center', 
    alignItems: 'center'
  }
});