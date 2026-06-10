import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="index" />
      <Stack.Screen name="[todoID]" />
      <Stack.Screen
        name="notice"
        options={{
          presentation: 'formSheet',
          gestureDirection: 'vertical',
          sheetCornerRadius: 20,
          animation: 'slide_from_bottom',
          sheetGrabberVisible: true,
          sheetInitialDetentIndex: 0,
          sheetAllowedDetents: [0.5, 0.7, 1.0]
        }}
      />
    </Stack>
  );
}
