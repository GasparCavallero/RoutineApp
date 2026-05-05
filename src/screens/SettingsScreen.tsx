import { Alert, StyleSheet, Text, View, Animated, ScrollView } from 'react-native';
import { useRef, useState, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { useThemeContext } from '../context/ThemeContext';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/Button';
import { ThemeSlider } from './HomeScreen';

export function SettingsScreen() {
	const { theme, mode, toggleTheme } = useThemeContext();
	const { routines, exercises, getExportData, importData } = useAppContext();
	const pickerInProgressRef = useRef(false);
	const navigation = useNavigation();
	const headerHeight = useHeaderHeight();
	const scrollY = useRef(new Animated.Value(0)).current;
	const [isPickingDocument, setIsPickingDocument] = useState(false);
	const [isImportingData, setIsImportingData] = useState(false);
	const [isExportingData, setIsExportingData] = useState(false);
	const isDataActionBusy = isPickingDocument || isImportingData || isExportingData;

	const handleExportData = async () => {
		if (isDataActionBusy) {
			return;
		}

		setIsExportingData(true);
		try {
			const data = await getExportData();

			const fileName = `routine-backup-${new Date().getTime()}.json`;
			const exportFile = new FileSystem.File(FileSystem.Paths.cache, fileName);
			exportFile.create({ overwrite: true, intermediates: true });

			exportFile.write(JSON.stringify(data, null, 2));

			if (await Sharing.isAvailableAsync()) {
				await Sharing.shareAsync(exportFile.uri, {
					mimeType: 'application/json',
					dialogTitle: 'Exportar datos',
				});
				Alert.alert('Éxito', `Se exportaron ${routines.length} rutinas, ${exercises.length} ejercicios`);
			} else {
				Alert.alert('Éxito', 'Archivo exportado. Búscalo en tu gestor de descargas.');
			}
		} catch (error) {
			Alert.alert('Error', 'No se pudieron exportar los datos');
			console.error(error);
		} finally {
			setIsExportingData(false);
		}
	};

	const handleImportData = async () => {
		if (pickerInProgressRef.current || isImportingData || isExportingData) {
			return;
		}

		pickerInProgressRef.current = true;
		setIsPickingDocument(true);

		try {
			const result = await DocumentPicker.getDocumentAsync({
				type: 'application/json',
			});

			if (result.canceled || !result.assets[0]) return;

			const fileUri = result.assets[0].uri;
			const importFile = new FileSystem.File(fileUri);
			const fileContent = await importFile.text();
			const importedData = JSON.parse(fileContent);
			const routinesToImport = Array.isArray(importedData.routines) ? importedData.routines : [];
			const exercisesToImport = Array.isArray(importedData.exercises) ? importedData.exercises : [];
			const historyToImport = Array.isArray(importedData.history) ? importedData.history : [];

			if (!routinesToImport.length) {
				Alert.alert('Error', 'Formato de archivo inválido');
				return;
			}

			Alert.alert(
				'Importar datos',
				`Se importarán ${routinesToImport.length} rutinas y ${exercisesToImport.length} ejercicios.\n\n¿Deseas continuar?`,
				[
					{ text: 'Cancelar', style: 'cancel' },
					{
						text: 'Importar',
						style: 'destructive',
						onPress: async () => {
							setIsImportingData(true);
							try {
								await importData({
									routines: routinesToImport,
									exercises: exercisesToImport,
									history: historyToImport,
								});
								Alert.alert('Éxito', 'Los datos se importaron correctamente');
							} catch (error) {
								Alert.alert('Error', 'No se pudieron importar los datos');
								console.error(error);
							} finally {
								setIsImportingData(false);
							}
						},
					},
				],
			);
		} catch (error) {
			if (error instanceof Error && error.message.toLowerCase().includes('different document picking in progress')) {
				Alert.alert('Importación en curso', 'Espera a que termine el selector de archivos actual.');
				return;
			}

			if (!(error instanceof Error) || !error.message.toLowerCase().includes('cancel')) {
				Alert.alert('Error', 'No se pudo leer el archivo');
				console.error(error);
			}
		} finally {
			pickerInProgressRef.current = false;
			setIsPickingDocument(false);
		}
	};

	const SCROLL_THRESHOLD = 80;

	const headerOpacity = scrollY.interpolate({
		inputRange: [0, SCROLL_THRESHOLD],
		outputRange: [0, 1],
		extrapolate: 'clamp',
	});

	useLayoutEffect(() => {
		navigation.setOptions({
			headerTransparent: true,
			headerShadowVisible: false,
			headerBackground: () => (
				<Animated.View
					style={{
						flex: 1,
						backgroundColor: headerOpacity,
					}}
				/>
			),
		});
	}, [navigation, headerOpacity]);

	return (
		<Animated.ScrollView
			scrollEventThrottle={16}
			onScroll={Animated.event(
				[{ nativeEvent: { contentOffset: { y: scrollY } } }],
				{ useNativeDriver: false }
			)}
			style={[styles.container, { backgroundColor: "transparent" }]}
			contentContainerStyle={{ paddingTop: headerHeight + 14 }}
		>
			<View style={[styles.section, { borderColor: theme.border }]}>
				<View style={styles.themeHeader}>
					<Text style={[styles.sectionTitle, { color: theme.text }]}>Tema</Text>
					<ThemeSlider onPress={toggleTheme} mode={mode} theme={theme} />
				</View>
			</View>

			<View style={[styles.section, { borderColor: theme.border }]}>
				<Text style={[styles.sectionTitle, { color: theme.text }]}>Datos</Text>
				<Button
					title={isPickingDocument || isImportingData ? 'Importando...' : 'Importar datos'}
					onPress={handleImportData}
					variant="primary"
					disabled={isDataActionBusy}
				/>
				<View style={{ height: 8 }} />
				<Button
					title={isExportingData ? 'Exportando...' : 'Exportar datos'}
					onPress={handleExportData}
					variant="primary"
					disabled={isDataActionBusy}
				/>
			</View>

			<View style={[styles.section, { borderColor: theme.border }]}>
				<Text style={[styles.info, { color: theme.textMuted }]}>
					Versión 1.0.0
				</Text>
			</View>
		</Animated.ScrollView>
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
