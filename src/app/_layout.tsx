import { ContextProvider } from '@/context/context';
import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <ContextProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(notice)" />
          <Stack.Screen name="[todoID]"
            options={{
              presentation: 'modal',
              gestureDirection: 'vertical',
              sheetCornerRadius: 20,
              animation: 'slide_from_bottom',
              sheetGrabberVisible: true,
              sheetInitialDetentIndex: 0,
              sheetAllowedDetents: [0.7, 1.0]
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </ContextProvider>
  );
}
