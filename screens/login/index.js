import React from 'react';
import {
  View,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TextInput, Button, Text, Card, Title} from 'react-native-paper';
import {UserAuth} from '../../context/AuthContext';

export const LoginScreen = ({navigation}) => {
  const {signIn} = UserAuth();
  const insets = useSafeAreaInsets();

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const loginHandler = async () => {
    if (!username || !password) {
      setIsError(true);
      setMessage('Please enter a username and password');
      return;
    }

    const success = await signIn(username, password);
    if (success) {
      setIsError(false);
      setMessage('');
      navigation.navigate('Health Connect');
    } else {
      setIsError(true);
      setMessage('Invalid username or password');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left + 16,
            paddingRight: insets.right + 16,
          },
        ]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Card style={styles.card} elevation={1}>
            <Card.Content>
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../assets/favicon.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              <Title style={styles.title}>Welcome to SecuriMed</Title>

              <TextInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                mode="outlined"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!isPasswordVisible}
                style={styles.input}
                right={
                  <TextInput.Icon
                    icon={isPasswordVisible ? 'eye-off' : 'eye'}
                    onPress={() => setIsPasswordVisible(prev => !prev)}
                  />
                }
              />

              {message.length > 0 && (
                <Text
                  style={[
                    styles.message,
                    isError ? styles.errorText : styles.successText,
                  ]}>
                  {message}
                </Text>
              )}

              <Button
                mode="contained"
                onPress={loginHandler}
                style={styles.button}
                contentStyle={{paddingVertical: 8}}>
                Login
              </Button>
            </Card.Content>
          </Card>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 12,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    width: 72,
    height: 72,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#2B4C6F',
  },
  input: {
    marginBottom: 12,
  },
  message: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 14,
  },
  errorText: {
    color: '#D32F2F',
  },
  successText: {
    color: '#388E3C',
  },
  button: {
    marginTop: 12,
    borderRadius: 8,
  },
});
