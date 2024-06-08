import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from './screens/login/index';
import Record from './screens/records/index';
import {AuthContextProvider} from './context/AuthContext';

import PolyfillCrypto from 'react-native-webview-crypto';
import 'react-native-get-random-values';
import 'gun/lib/mobile';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <>
      <AuthContextProvider>
        <PolyfillCrypto />
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Health Connect"
              component={Record}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContextProvider>
    </>
  );
};

export default App;
