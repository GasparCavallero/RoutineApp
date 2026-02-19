import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/Button';
import { ThemeSlider } from './HomeScreen';

export function SettingsScreen() {
	const { theme, mode, toggleTheme } = useThemeContext();
	const { routines, exercises, history } = useAppContext();

	const handleExportData = async () => {
		try {
			const data = {
				routines,
				exercises,
				history,
				exportedAt: new Date().toISOString(),
			};

			// Aquí puedes implementar la exportación real con Share o FileSystem
			Alert.alert('Éxito', `Se exportaron ${routines.length} rutinas, ${exercises.length} ejercicios`);
		} catch (error) {
			Alert.alert('Error', 'No se pudieron exportar los datos');
		}
	};

	const handleImportData = async () => {
		// Aquí puedes implementar la importación de datos
		Alert.alert('Importar', 'Funcionalidad de importación en desarrollo');
	};

	return (
		<ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
			<View style={[styles.section, { borderColor: theme.border }]}>
				<View style={styles.themeHeader}>
					<Text style={[styles.sectionTitle, { color: theme.text }]}>Tema</Text>
					<ThemeSlider onPress={toggleTheme} mode={mode} theme={theme} />
				</View>
			</View>

			<View style={[styles.section, { borderColor: theme.border }]}>
				<Text style={[styles.sectionTitle, { color: theme.text }]}>Datos</Text>
				<Button title="Importar datos" onPress={handleImportData} variant="primary" />
				<View style={{ height: 8 }} />
				<Button title="Exportar datos" onPress={handleExportData} variant="primary" />
			</View>

			<View style={[styles.section, { borderColor: theme.border }]}>
				<Text style={[styles.info, { color: theme.textMuted }]}>
					Versión 1.0.0
				</Text>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 14,
	},
	section: {
		marginBottom: 20,
		paddingBottom: 16,
		borderBottomWidth: 1,
		gap: 12,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '700',
	},
	themeHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	info: {
		fontSize: 12,
		textAlign: 'center',
	},
});
