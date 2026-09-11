import { OnboardingContextProvider } from '@/context/OnboardingContext';
import { SettingContextProvider } from '@/context/SettingContext';
import { TaskContextProvider } from '@/context/TaskContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {

  return (
    <ThemeProvider>
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
                    presentation: 'formSheet',
                    sheetAllowedDetents: 'fitToContents',
                    animation:'none',
                    //sheetAllowedDetents: [0.6, 0.9], // Шторка на 60% или 90% экрана
                    //sheetInitialDetentIndex: 0,      // По умолчанию открывать на 60%
                    sheetGrabberVisible: true,       // Индикатор смахивания сверху                    
                    sheetCornerRadius: 25,
                    // ДОБАВЛЯЕМ ЦВЕТ ТЕМЫ В ПОДЛОЖКУ НАВИГАТОРА
                    contentStyle: {
                      height: 'auto',
                      backgroundColor: '#1E293B', // Цвет вашей карточки задачи
                    }
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
    </ThemeProvider>
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