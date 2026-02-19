import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from './src/context/AppContext';
import { ThemeProvider, useThemeContext } from './src/context/ThemeContext';
import { AppNavigator } from './src/navigation/AppNavigator';

function RootApp() {
  const { mode } = useThemeContext();

  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppProvider>
          <RootApp />
        </AppProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
