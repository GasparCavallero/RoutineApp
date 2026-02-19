import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useThemeContext } from '../context/ThemeContext';
import { HistoryScreen } from '../screens/HistoryScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { RoutineScreen } from '../screens/RoutineScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { RoutinesIcon } from '../components/RoutinesIcon';
import { HistoryIcon } from '../components/HistoryIcon';
import { ProgressIcon } from '../components/ProgressIcon';
import { SettingsIcon } from '../components/SettingsIcon';

export type RootStackParamList = {
	MainTabs: undefined;
	Routine: { routineId: number; routineName: string };
};

export type MainTabParamList = {
	Home: undefined;
	History: undefined;
	Progress: undefined;
	Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
	const { theme } = useThemeContext();

	return (
		<Tab.Navigator
			screenOptions={{
				headerStyle: { backgroundColor: theme.surface },
				headerTintColor: theme.text,
				tabBarStyle: { backgroundColor: theme.surface, borderTopColor: theme.border },
				tabBarActiveTintColor: theme.primary,
				tabBarInactiveTintColor: theme.textMuted,
			}}
		>
			<Tab.Screen 
				name="Home" 
				component={HomeScreen} 
				options={{ 
					title: 'Rutinas',
					tabBarIcon: ({ color, size }) => <RoutinesIcon color={color} size={size} />
				}} 
			/>
			<Tab.Screen 
				name="History" 
				component={HistoryScreen} 
				options={{ 
					title: 'Historial',
					tabBarIcon: ({ color, size }) => <HistoryIcon color={color} size={size} />
				}} 
			/>
			<Tab.Screen 
				name="Progress" 
				component={ProgressScreen} 
				options={{ 
					title: 'Progreso',
					tabBarIcon: ({ color, size }) => <ProgressIcon color={color} size={size} />
				}} 
			/>
			<Tab.Screen 
				name="Settings" 
				component={SettingsScreen} 
				options={{ 
					title: 'Opciones',
					tabBarIcon: ({ color, size }) => <SettingsIcon color={color} size={size} />
				}} 
			/>
		</Tab.Navigator>
	);
}

export function AppNavigator() {
	const { theme, mode } = useThemeContext();

	return (
		<NavigationContainer
			theme={{
				dark: mode === 'dark',
				colors: {
					primary: theme.primary,
					background: theme.background,
					card: theme.surface,
					text: theme.text,
					border: theme.border,
					notification: theme.primary,
				},
				fonts: {
					regular: { fontFamily: 'System', fontWeight: '400' },
					medium: { fontFamily: 'System', fontWeight: '500' },
					bold: { fontFamily: 'System', fontWeight: '700' },
					heavy: { fontFamily: 'System', fontWeight: '800' },
				},
			}}
		>
			<Stack.Navigator
				screenOptions={{
					headerStyle: { backgroundColor: theme.surface },
					headerTintColor: theme.text,
				}}
			>
				<Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
				<Stack.Screen
					name="Routine"
					component={RoutineScreen}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
