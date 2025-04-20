import * as React from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoginScreen} from './screens/login/index';
import QRScanner from './components/QRScanner';
import Record from './screens/records/index';
import {AuthContextProvider} from './context/AuthContext';

import PolyfillCrypto from 'react-native-webview-crypto';
import 'react-native-get-random-values';
import 'gun/lib/mobile';

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1E88E5',
    accent: '#90CAF9',
    background: '#FFFFFF',
    text: '#0D47A1',
    error: '#D32F2F',
  },
};

const App = () => {
  return (
    <>
      <AuthContextProvider>
        <PolyfillCrypto />
        <PaperProvider theme={theme}>
          <NavigationContainer>
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
      </AuthContextProvider>
    </>
  );
};

export default App;
