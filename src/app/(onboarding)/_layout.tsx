import { Stack } from "expo-router";

export default function TabsLayout() {

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding"
        options={{
          animation: 'slide_from_right',

        }}
      />
    </Stack>
  )
}