import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

const SearchBar: React.FC<Props> = ({
  value,
  onChangeText,
  placeholder = 'Search',
}) => {
  return (
    <View style={styles.container}>
      <Icon name="magnify" size={20} color="#757575" style={{marginRight: 8}} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#757575"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: -3,
  },
  input: {
    fontSize: 17,
    flex: 1,
  },
});

export default SearchBar;
