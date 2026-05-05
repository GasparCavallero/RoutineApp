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
	HomeStack: undefined;
	HistoryStack: undefined;
	ProgressStack: undefined;
	SettingsStack: undefined;
};

export type HomeStackParamList = {
	Home: undefined;
	Routine: { routineId: number; routineName: string };
};

export type HistoryStackParamList = { History: undefined };
export type ProgressStackParamList = { Progress: undefined };
export type SettingsStackParamList = { Settings: undefined };

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const HistoryStack = createNativeStackNavigator<HistoryStackParamList>();
const ProgressStack = createNativeStackNavigator<ProgressStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

function useTabStackOptions() {
	const { theme } = useThemeContext();
	return {
		headerStyle: { backgroundColor: theme.surface },
		headerShadowVisible: true,
		headerTintColor: theme.text,
		headerTitleStyle: { color: theme.text },
	};
}

function HomeStackNavigator() {
	const { theme } = useThemeContext();
	const transparentOptions = {
		headerTransparent: true,
		headerShadowVisible: false,
		headerTintColor: theme.primary,
		headerTitleStyle: { color: theme.text },
	};
	return (
		<HomeStack.Navigator
			screenOptions={{
				contentStyle: {
					backgroundColor: theme.background,
				},
			}}
		>
			<HomeStack.Screen name="Home" component={HomeScreen} options={{ ...transparentOptions, title: 'Rutinas' }} />
			<HomeStack.Screen
				name="Routine"
				component={RoutineScreen}
				options={({ route }) => ({ ...transparentOptions, title: route.params.routineName })}
			/>
		</HomeStack.Navigator>
	);
}

function HistoryStackNavigator() {
	const { theme } = useThemeContext();

	const transparentOptions = {
		headerTransparent: true,
		headerShadowVisible: false,
		headerTintColor: theme.primary,
		headerTitleStyle: { color: theme.text },
	};

	return (
		<HistoryStack.Navigator
			screenOptions={{
				contentStyle: {
					backgroundColor: theme.background,
				},
			}}
		>
			<HistoryStack.Screen
				name="History"
				component={HistoryScreen}
				options={{
					...transparentOptions,
					title: 'Historial',
				}}
			/>
		</HistoryStack.Navigator>
	);
}

function ProgressStackNavigator() {
	const { theme } = useThemeContext();

	const transparentOptions = {
		headerTransparent: true,
		headerShadowVisible: false,
		headerTintColor: theme.primary,
		headerTitleStyle: { color: theme.text },
	};

	return (
		<ProgressStack.Navigator
			screenOptions={{
				contentStyle: {
					backgroundColor: theme.background,
				},
			}}
		>
			<ProgressStack.Screen
				name="Progress"
				component={ProgressScreen}
				options={{
					...transparentOptions,
					title: 'Progreso',
				}}
			/>
		</ProgressStack.Navigator>
	);
}

function SettingsStackNavigator() {
	const { theme } = useThemeContext();

	const transparentOptions = {
		headerTransparent: true,
		headerShadowVisible: false,
		headerTintColor: theme.primary,
		headerTitleStyle: { color: theme.text },
	};
	
	return (
		<SettingsStack.Navigator 
			screenOptions={{
				...transparentOptions,
				contentStyle: {
				backgroundColor: theme.background,
				},
			}}
		>
			<SettingsStack.Screen 
				name="Settings" 
				component={SettingsScreen} 
				options={{ 
					...transparentOptions,
					title: 'Opciones', 
				}} 
			/>
		</SettingsStack.Navigator>
	);
}

// function SettingsStackNavigator() {
// 	const options = useTabStackOptions();
// 	const { theme } = useThemeContext();
// 	return (
// 		<SettingsStack.Navigator 
// 			screenOptions={{
// 				...options,
// 				contentStyle: {
// 				backgroundColor: theme.background,
// 				},
// 			}}
// 		>
// 			<SettingsStack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Opciones' }} />
// 		</SettingsStack.Navigator>
// 	);
// }

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
			<Tab.Navigator
				screenOptions={{
					headerShown: false,

					sceneStyle: {
						backgroundColor: theme.background,
					},

					tabBarStyle: {
						backgroundColor: theme.surface,
						borderTopWidth: 0,
						shadowOpacity: 0,
						shadowOffset: { width: 0, height: 0 },
						shadowRadius: 0,
						elevation: 0,
					},

					tabBarActiveTintColor: theme.primary,
					tabBarInactiveTintColor: theme.textMuted,
				}}
			>
				<Tab.Screen
					name="HomeStack"
					component={HomeStackNavigator}
					options={{
						title: 'Rutinas',
						tabBarIcon: ({ color, size }) => <RoutinesIcon color={color} size={size} />,
					}}
				/>
				<Tab.Screen
					name="HistoryStack"
					component={HistoryStackNavigator}
					options={{
						title: 'Historial',
						tabBarIcon: ({ color, size }) => <HistoryIcon color={color} size={size} />,
					}}
				/>
				<Tab.Screen
					name="ProgressStack"
					component={ProgressStackNavigator}
					options={{
						title: 'Progreso',
						tabBarIcon: ({ color, size }) => <ProgressIcon color={color} size={size} />,
					}}
				/>
				<Tab.Screen
					name="SettingsStack"
					component={SettingsStackNavigator}
					options={{
						title: 'Opciones',
						tabBarIcon: ({ color, size }) => <SettingsIcon color={color} size={size} />,
					}}
				/>
			</Tab.Navigator>
		</NavigationContainer>
	);
}