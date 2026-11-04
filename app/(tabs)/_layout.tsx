import { NativeTabs } from 'expo-router/native-tabs';

export default function TabsLayout() {
	return (
		<NativeTabs
			backgroundColor="#000000"
			blurEffect="systemMaterialDark"
			tintColor="#FFFFFF"
			labelStyle={{ color: '#FFFFFF' }}
		>
			<NativeTabs.Trigger name="(routines)">
				<NativeTabs.Trigger.Label hidden>Rutinas</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon
					src={{
						default: require('../../src/assets/icons/native-tabs/routines-outline.png'),
						selected: require('../../src/assets/icons/native-tabs/routines-filled.png'),
					}}
					renderingMode="original"
				/>
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="(history)">
				<NativeTabs.Trigger.Label hidden>Historial</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon
					src={{
						default: require('../../src/assets/icons/native-tabs/history-outline.png'),
						selected: require('../../src/assets/icons/native-tabs/history-filled.png'),
					}}
					renderingMode="original"
				/>
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="(progress)">
				<NativeTabs.Trigger.Label hidden>Progreso</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon
					src={{
						default: require('../../src/assets/icons/native-tabs/progress-outline.png'),
						selected: require('../../src/assets/icons/native-tabs/progress-filled.png'),
					}}
					renderingMode="original"
				/>
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="(settings)">
				<NativeTabs.Trigger.Label hidden>Opciones</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon
					src={{
						default: require('../../src/assets/icons/native-tabs/settings-outline.png'),
						selected: require('../../src/assets/icons/native-tabs/settings-filled.png'),
					}}
					renderingMode="original"
				/>
			</NativeTabs.Trigger>
		</NativeTabs>
	);
}
