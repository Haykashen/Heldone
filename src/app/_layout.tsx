import { OnboardingContextProvider } from '@/context/OnboardingContext';
import { SettingContextProvider } from '@/context/SettingContext';
import { TaskContextProvider } from '@/context/TaskContext';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  
  return (
    <OnboardingContextProvider>
      <SettingContextProvider>
        <TaskContextProvider>
          <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(onboarding)" />
              <Stack.Screen name="(setting)"
                options={{
                  presentation: 'transparentModal',
                }}
              />
              <Stack.Screen name="[todoID]"
                options={{
                  presentation: 'transparentModal',
                }}
              />
              <Stack.Screen name="DataBottomSheet"
                options={{
                  presentation: 'transparentModal',
                }}
              />              
            </Stack>
          </SafeAreaProvider>
        </TaskContextProvider>
      </SettingContextProvider>
    </OnboardingContextProvider>
  );
}
               //animation: 'fade_from_bottom',
               //contentStyle: { backgroundColor: "#40404040" },


              // presentation: 'formSheet',
              // gestureDirection: 'vertical',
              // sheetCornerRadius: 20,
              // animation: 'slide_from_bottom',
              // sheetGrabberVisible: true,
              // sheetInitialDetentIndex: 0,
              // sheetAllowedDetents: [0.5, 0.7, 1.0]