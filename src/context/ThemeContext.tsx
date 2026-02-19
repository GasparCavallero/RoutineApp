import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { darkTheme } from '../theme/dark';
import { AppTheme, lightTheme } from '../theme/light';

type ThemeMode = 'light' | 'dark';

type ThemeContextValue = {
	mode: ThemeMode;
	theme: AppTheme;
	toggleTheme: () => void;
};

const STORAGE_KEY = 'routineapp.theme';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: PropsWithChildren) {
	const [mode, setMode] = useState<ThemeMode>('light');

	useEffect(() => {
		const load = async () => {
			const saved = await AsyncStorage.getItem(STORAGE_KEY);
			if (saved === 'light' || saved === 'dark') {
				setMode(saved);
			}
		};

		load();
	}, []);

	const value = useMemo<ThemeContextValue>(
		() => ({
			mode,
			theme: mode === 'dark' ? darkTheme : lightTheme,
			toggleTheme: () => {
				const next = mode === 'dark' ? 'light' : 'dark';
				setMode(next);
				AsyncStorage.setItem(STORAGE_KEY, next);
			},
		}),
		[mode],
	);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error('useThemeContext must be used inside ThemeProvider');
	}

	return context;
}
