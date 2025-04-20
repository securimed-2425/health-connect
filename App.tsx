import * as React from 'react';
import {
  Provider as PaperProvider,
  MD3LightTheme as PaperLight,
  MD3DarkTheme as PaperDark,
} from 'react-native-paper';
import {
  NavigationContainer,
  DefaultTheme as NavigationLight,
  DarkTheme as NavigationDark,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {LoginScreen} from './screens/login/index';
import QRScanner from './components/QRScanner';
import Record from './screens/records/index';
import {AuthContextProvider, UserAuth} from './context/AuthContext';

import PolyfillCrypto from 'react-native-webview-crypto';
import 'react-native-get-random-values';
import 'gun/lib/mobile';

const Stack = createNativeStackNavigator();

// Color Themes
const LightTheme = {
  ...PaperLight,
  ...NavigationLight,
  colors: {
    ...PaperLight.colors,
    ...NavigationLight.colors,
    primary: '#1E88E5',
    accent: '#90CAF9',
    background: '#FFFFFF',
    text: '#0D47A1',
    error: '#D32F2F',
  },
};

const DarkTheme = {
  ...PaperDark,
  ...NavigationDark,
  colors: {
    ...PaperDark.colors,
    ...NavigationDark.colors,
    primary: '#90CAF9',
    accent: '#1E88E5',
    background: '#121212',
    text: '#FFFFFF',
    error: '#EF5350',
  },
};

// Main App
const MainApp = () => {
  const {darkMode} = UserAuth();
  const theme = darkMode ? DarkTheme : LightTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Health Connect"
            component={Record}
            options={{headerShown: false}}
          />
          <Stack.Screen name="QRScanner" component={QRScanner} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

// Wrap Main App in context provider
const App = () => {
  return (
    <AuthContextProvider>
      <PolyfillCrypto />
      <MainApp />
    </AuthContextProvider>
  );
};

export default App;
