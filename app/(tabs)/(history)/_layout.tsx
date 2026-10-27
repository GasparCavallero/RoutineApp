import { Stack } from 'expo-router';

export default function HistoryLayout() {
	return <Stack screenOptions={{ headerTransparent: true, headerShadowVisible: false }}><Stack.Screen name="index" options={{ title: 'Historial' }} /></Stack>;
}
