import * as React from 'react';
import {
  Provider as PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
} from 'react-native-paper';
import {
  NavigationContainer,
  DefaultTheme as NavLightTheme,
  DarkTheme as NavDarkTheme,
} from '@react-navigation/native';
import {ThemeProvider, ThemeContext} from './context/ThemeContext';
import {AuthContextProvider} from './context/AuthContext';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoginScreen} from './screens/login/index';
import Record from './screens/records/index';

import PolyfillCrypto from 'react-native-webview-crypto';

const Stack = createNativeStackNavigator();

const App = () => {
  const {isDark} = React.useContext(ThemeContext);

  const paperTheme = isDark ? MD3DarkTheme : MD3LightTheme;
  const navTheme = isDark ? NavDarkTheme : NavLightTheme;

  return (
    <ThemeProvider>
      <AuthContextProvider>
        <PolyfillCrypto />
        <PaperProvider theme={paperTheme}>
          <NavigationContainer theme={navTheme}>
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
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </AuthContextProvider>
    </ThemeProvider>
  );
};

export default App;
