import { Stack } from "expo-router";

export default function NoticeLayout() {
  return (
      <Stack>
        <Stack.Screen
          name="notice"
          options={{
            headerShown: false,
            presentation: 'transparentModal',
            animation: 'slide_from_bottom',
            sheetAllowedDetents: 'fitToContents',
            contentStyle: { backgroundColor: "#40404040" },            
            // presentation: 'formSheet',
            // gestureDirection: 'vertical',
            // sheetCornerRadius: 20,
            // animation: 'slide_from_bottom',
            // sheetGrabberVisible: true,
            // sheetInitialDetentIndex: 0,
            // sheetAllowedDetents: [0.5, 0.7, 1.0]


          }}
        />
      </Stack>
  );
}
