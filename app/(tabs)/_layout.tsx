import { NativeTabs } from 'expo-router/native-tabs';
import { DynamicColorIOS, Platform } from 'react-native';
import { useThemeContext } from '../../src/context/ThemeContext';

export default function TabsLayout() {
	const { mode } = useThemeContext();
	const isDark = mode === 'dark';
	const inactiveTabColor = isDark
		? Platform.OS === 'ios'
			? DynamicColorIOS({ dark: '#FFFFFF', light: '#111827' })
			: '#FFFFFF'
		: undefined;
	const selectedTabColor = isDark
		? Platform.OS === 'ios'
			? DynamicColorIOS({ dark: '#EFF6FF', light: '#2563EB' })
			: '#EFF6FF'
		: undefined;

	return (
		<NativeTabs
			iconColor={inactiveTabColor}
			tintColor={selectedTabColor}
			backgroundColor={isDark ? '#F8FAFC' : undefined}
			blurEffect={isDark ? 'systemMaterialLight' : undefined}
			labelStyle={inactiveTabColor ? { color: inactiveTabColor } : undefined}
		>
			<NativeTabs.Trigger name="(routines)">
				<NativeTabs.Trigger.Label>Rutinas</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon sf={{ default: 'list.bullet', selected: 'list.bullet' }} md="checklist" />
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="(history)">
				<NativeTabs.Trigger.Label>Historial</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon sf="clock.arrow.circlepath" md="history" />
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="(progress)">
				<NativeTabs.Trigger.Label>Progreso</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon sf="chart.xyaxis.line" md="show_chart" />
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="(settings)">
				<NativeTabs.Trigger.Label>Opciones</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon sf="slider.horizontal.3" md="settings" />
			</NativeTabs.Trigger>
		</NativeTabs>
	);
}
