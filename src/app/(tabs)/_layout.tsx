import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
//import React from "react";
//import { Image } from "react-native"; (({focused, color, size})=><Image source={require('@expo/snack-static/react-native-logo.png')}/>)
//import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabsLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#4894FE',
          tabBarShowLabel: true,
          headerShown:false

        }}>
        <Tabs.Screen name="tabHome" options={{
          headerShown: false,
          title: 'Home',
        }} />        
        <Tabs.Screen name="tabExpandableCalendar" options={{
          headerShown: false,
          title: 'Calendar',
        }} />                    
        <Tabs.Screen name="tabSetting" options={{
          headerShown: false,
          title:'Setting',
          }}
        />
      </Tabs>
    </>
  )    
}