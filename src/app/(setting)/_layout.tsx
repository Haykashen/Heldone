import { Stack } from "expo-router";

export default function SettingLayout() {

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="setting"
        options={{
          presentation: 'transparentModal',
        }}
      />

    </Stack>
  )
}