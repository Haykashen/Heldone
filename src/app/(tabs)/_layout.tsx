import { useAppColors } from '@/context/ThemeContext';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";


export default function TabsLayout() {
  
  const colors = useAppColors(); // Вся палитра доступна здесь автоматически!

  return (
    <>
      <StatusBar style='auto' />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#007aff',
          tabBarInactiveTintColor: 'grey',
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle:{
            backgroundColor: colors.cardBg,
            borderColor: colors.cardBg,  
          }
        }}>
        <Tabs.Screen name="index" options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <MaterialDesignIcons name={focused ? 'home' : 'home-outline'} color={color} size={24} />
          ),
        }} />
        <Tabs.Screen name="list" options={{
          title: 'List',
          tabBarIcon: ({ color, focused }) => (
            <MaterialDesignIcons name={focused ? 'clipboard-text' : 'clipboard-text-outline'} color={color} size={24} />
          ),
        }} />
        <Tabs.Screen name="calendar" options={{
          title: 'Calendar',
          tabBarIcon: ({ color, focused }) => (
            <MaterialDesignIcons name={focused ? 'calendar-month' : 'calendar-month-outline'} color={color} size={24} />
          ),
        }} />
      </Tabs>
    </>
  )
}