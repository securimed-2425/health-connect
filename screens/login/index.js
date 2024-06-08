import React from 'react';
import {
  View,
  Pressable,
  Text,
  TextInput,
  Button,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StyleSheet} from 'react-native';
import {styles} from './styles';
import {UserAuth} from '../../context/AuthContext';
import 'react-native-get-random-values';
import 'gun/lib/mobile';
import 'gun/sea';
import 'gun/lib/radix.js';
import 'gun/lib/radisk.js';
import 'gun/lib/store.js';

export const  HomeScreen = ({navigation}) => {
  const {signIn} = UserAuth();

  const insets = useSafeAreaInsets();

  const insetStyles = StyleSheet.create({
    safeArea: {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    },
  });

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isError, setIsError] = React.useState(true);
  const [message, setMessage] = React.useState('');

  const loginHandler = async () => {
    if (username === '' || password === '') {
      setIsError(true);
      setMessage('Please enter a username and password');
      return;
    }

    // signUp(username, password);
    await signIn(username, password).then(success => {
      if (success) {
        setMessage('');
        navigation.navigate('Health Connect');
      } else {
        setIsError(true);
        setMessage('Invalid username or password');
      }
    });
  };

  // const signUpHandler = async () => {
  //   if (username === '' || password === '') {
  //     setIsError(true);
  //     setMessage('Please enter a username and password');
  //     return;
  //   }
  //   await signUp(username, password).then(success => {
  //     if (success) {
  //       setIsError(false);
  //       setMessage(
  //         'Account created successfully. Please log in with your credentials.',
  //       );
  //       setPassword('');
  //       setUsername('');
  //     } else {
  //       setIsError(true);
  //       setMessage('Account creation failed. Username already exists.');
  //     }
  //   });
  // };

  return (
    <View style={[insetStyles.safeArea, styles.container]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View>
            <View style={styles.inputContainer}>
              <Text>Username</Text>
              <TextInput
                value={username}
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={text => setUsername(text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text>Password</Text>
              <TextInput
                value={password}
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={text => setPassword(text)}
                secureTextEntry={true}
              />
            </View>
            {message.length === 0 ? (
              <></>
            ) : (
              <Text
                style={[
                  styles.textMessage,
                  isError ? styles.textError : styles.textSuccess,
                ]}>
                {message}
              </Text>
            )}
            <View style={styles.spacer} />
            <Pressable onPress={loginHandler}>
              {({pressed}) => (
                <View
                  style={[
                    styles.button,
                    pressed && styles.buttonPressed,
                    !pressed && styles.buttonUnPressed,
                  ]}>
                  <Text style={pressed && styles.buttonTextPressed}>LOGIN</Text>
                </View>
              )}
            </Pressable>
            {/* <Pressable onPress={signUpHandler}>
              {({pressed}) => (
                <View
                  style={[
                    styles.button,
                    pressed && styles.buttonPressed,
                    !pressed && styles.buttonUnPressed,
                  ]}>
                  <Text style={pressed && styles.buttonTextPressed}>
                    SIGN UP
                  </Text>
                </View>
              )}
            </Pressable> */}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

/*
export const ProfileScreen = ({navigation}) => {
  const [hr, setHr] = React.useState(0);
  const {userInfo, user, db} = UserAuth();
  console.log(userInfo);

  db.user(
    'usVu30n-0tkA3GQVPbC6wXlVUXZnDlppaQudy1XV2C8.QO8-QkweUu-dF8a8-FNBt-s8GUlUCO0S_DkBJmkxQuA',
  )
    .get('securimed')
    .get('rx')
    .get('hr')
    .on(data => {
      console.log('data', data);
    });

  const add = () => {
    const datetime = new Date().valueOf();
    const data = {};
    data[datetime] = hr;
    user.get('securimed').get('rx').get('hr').put(data);
  };
  return (
    <View>
      <Text>This is {userInfo.username}'s profile</Text>
      <Text>This is my public key: {userInfo.usersea.pub}</Text>

      <View style={styles.inputContainer}>
        <Text>Dummy HR</Text>
        <TextInput
          value={hr}
          style={styles.input}
          autoCorrect={false}
          onChangeText={text => setHr(parseInt(text, 10))}
          keyboardType="numeric"
        />
      </View>
      <Pressable onPress={add}>
        {({pressed}) => (
          <View
            style={[
              styles.button,
              pressed && styles.buttonPressed,
              !pressed && styles.buttonUnPressed,
            ]}>
            <Text style={pressed && styles.buttonTextPressed}>
              Add Dummy Data
            </Text>
          </View>
        )}
      </Pressable>
      <Button
        title="Go to Jane's profile"
        onPress={() => navigation.navigate('Health Connect')}
      />
    </View>
  );
};
*/