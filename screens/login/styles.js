import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    width: 200,
    fontSize: 16,
    padding: 5,
  },
  inputContainer: {
    paddingVertical: 10,
    rowGap: 5,
  },
  spacer: {
    height: 20,
  },
  button: {
    width: 200,
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  buttonUnPressed: {
    backgroundColor: 'lightblue',
  },
  buttonPressed: {
    backgroundColor: 'darkblue',
  },
  buttonTextPressed: {
    color: 'white',
  },
  buttonTextUnPressed: {
    color: 'black',
  },
  textError: {
    color: 'red',
  },
  textMessage: {
    textAlign: 'center',
    width: 200,
    fontSize: 12,
  },
  textSuccess: {
    color: 'green',
  },
});
