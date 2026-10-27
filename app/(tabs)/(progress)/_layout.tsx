import { Stack } from 'expo-router';

export default function ProgressLayout() {
	return <Stack screenOptions={{ headerTransparent: true, headerShadowVisible: false }}><Stack.Screen name="index" options={{ title: 'Progreso' }} /></Stack>;
}
