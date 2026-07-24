import { Context } from '@/context/context';
import PagerView, { type PagerViewRef } from '@expo/ui/community/pager-view';
import LottieView from 'lottie-react-native';
import { useContext, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const OnboardingScreen = ({ path, title }: { path: string, title: string }) => {

    return (
        <View style={{ height: 400, }}>
            <LottieView style={{ flex: 1 }} source={path} autoPlay loop />
            <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>{title}</Text>
        </View>
    )
}

const onboarding = () => {
    const [page, setPage] = useState(0)
    const pagerRef = useRef<PagerViewRef>(null);
    const { defaultCategory, setDefaultCategory, defaultPriority, setDefaultPriority, defaultTime, setDefaultTime } = useContext(Context);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#031F2B', paddingTop: 5, flexDirection: 'column', gap: 25, }}>
            <View style={{ height: 500 }}>
                <PagerView
                    ref={pagerRef}
                    style={{ flex: 1 }}
                    initialPage={0}

                    onPageSelected={event => {
                        setPage(event.nativeEvent.position)
                        console.log('selected page', event.nativeEvent.position);
                    }}>
                    <OnboardingScreen path={require('@/assets/animation/Business_plan.json')} title='Welcome!!!' />
                    <OnboardingScreen path={require('@/assets/animation/Growth_Assistance.json')} title='Welcome!!!' />
                    <OnboardingScreen path={require('@/assets/animation/Holding_value.json')} title='Welcome!!!' />
                    <OnboardingScreen path={require('@/assets/animation/Rotate_a_chart.json')} title='Welcome!!!' />
                    <OnboardingScreen path={require('@/assets/animation/Successful_target.json')} title='Welcome!!!' />
                    <OnboardingScreen path={require('@/assets/animation/Task_Loader.json')} title='Welcome!!!' />
                    <OnboardingScreen path={require('@/assets/animation/The_idea_of_change.json')} title='Welcome!!!' />
                    <OnboardingScreen path={require('@/assets/animation/Web_Design.json')} title='Welcome!!!' />
                </PagerView>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Pressable onPress={() => pagerRef.current?.setPage(page === 7 ? 0 : page + 1)}>
                    <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Go to page {page + 1}</Text>
                </Pressable>
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