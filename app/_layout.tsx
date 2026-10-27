import { DarkTheme, DefaultTheme, Stack, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from '../src/context/AppContext';
import { ThemeProvider, useThemeContext } from '../src/context/ThemeContext';

function RootNavigator() {
	const { mode, theme } = useThemeContext();
	const baseTheme = mode === 'dark' ? DarkTheme : DefaultTheme;
	const navigationTheme = {
		...baseTheme,
		colors: {
			...baseTheme.colors,
			background: theme.background,
			card: theme.surface,
			text: theme.text,
			border: theme.border,
		},
	};
	return (
		<>
			<StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
			<NavigationThemeProvider value={navigationTheme}>
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="(tabs)" />
				</Stack>
			</NavigationThemeProvider>
		</>
	);
}

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ThemeProvider>
				<AppProvider>
					<RootNavigator />
				</AppProvider>
			</ThemeProvider>
		</GestureHandlerRootView>
	);
}
