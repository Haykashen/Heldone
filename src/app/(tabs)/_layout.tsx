import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
//import { NavigationBar } from 'expo-navigation-bar';
//import React from "react";
//import { Image } from "react-native"; (({focused, color, size})=><Image source={require('@expo/snack-static/react-native-logo.png')}/>)
//import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabsLayout() {
  return (
    <>
      <StatusBar style='auto' />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#007aff',
          tabBarInactiveTintColor:'grey',
          tabBarShowLabel: false,
          headerShown:false
          
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
        <Tabs.Screen name="setting" options={{
          title:'Setting',
          tabBarIcon: ({ color, focused }) => (
            <MaterialDesignIcons name={focused ? 'account' : 'account-outline'} color={color} size={24} />
          ),            
          }}
        />
      </Tabs>
    </>
  )    
}