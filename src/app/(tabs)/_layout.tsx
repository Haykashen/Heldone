import { scaleEnd, scaleStart } from '@/utils/animation';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef } from 'react';
import { Animated } from 'react-native';

export default function TabsLayout() {
  const scale = useRef(new Animated.Value(1)).current;

  // Функция для анимации нажатия
  const handlePressIn = () => {
    scaleStart(scale, 1.7)
  };

  // Возврат к обычному размеру
  const handlePressOut = () => {
    scaleEnd(scale, 1)
  };

  return (
    <>
      <StatusBar style='auto' />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#007aff',
          tabBarInactiveTintColor:'grey',
          tabBarShowLabel: false,
          headerShown:false,         
        }}>
        <Tabs.Screen name="index" options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Animated.View style={{transform: [{ scale }]}} onTouchStart={handlePressIn} onTouchEnd={handlePressOut}>
              <MaterialDesignIcons name={focused ? 'home' : 'home-outline'} color={color} size={24} />
            </Animated.View>            
          ),        
        }} />  
        <Tabs.Screen name="list" options={{
          title: 'List',
          tabBarIcon: ({ color, focused }) => (
            <Animated.View style={{transform: [{ scale }]}} onTouchStart={handlePressIn} onTouchEnd={handlePressOut}>
              <MaterialDesignIcons name={focused ? 'clipboard-text' : 'clipboard-text-outline'} color={color} size={24} />
            </Animated.View>                
       
          ),          
        }} />                 
        <Tabs.Screen name="calendar" options={{
          title: 'Calendar',
          tabBarIcon: ({ color, focused }) => (
            <Animated.View style={{transform: [{ scale }]}} onTouchStart={handlePressIn} onTouchEnd={handlePressOut}>
              <MaterialDesignIcons name={focused ? 'calendar-month' : 'calendar-month-outline'} color={color} size={24} />
            </Animated.View>            
          ),  
        }} />                    
        <Tabs.Screen name="setting" options={{
          title:'Setting',
          tabBarIcon: ({ color, focused }) => (
            <Animated.View style={{transform: [{ scale }]}} onTouchStart={handlePressIn} onTouchEnd={handlePressOut}>
              <MaterialDesignIcons name={focused ? 'cog' : 'cog-outline'} color={color} size={24} />
            </Animated.View>     
          ),            
          }}
        />
      </Tabs>
    </>
  )    
}