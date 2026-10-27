import { Stack } from 'expo-router';

export default function RoutinesLayout() {
	return (
		<Stack screenOptions={{ headerTransparent: true, headerShadowVisible: false }}>
			<Stack.Screen name="index" options={{ title: 'Rutinas' }} />
			<Stack.Screen name="Routine" options={{ title: 'Rutina' }} />
		</Stack>
	);
}
