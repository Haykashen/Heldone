import { Stack } from "expo-router";

export default function SettingLayout() {

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="setting"
        options={{
          animation: 'slide_from_right',

        }}
      />
    </Stack>
  )
}