import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CaregiverCard = ({ name, access, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Icon name="favorite" size={32} color="#F06292" />

      {/* Name and Alerts */}
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.alerts}>{access}</Text>
      </View>

      <Icon name="chevron-right" size={23} color="#90A4AE" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    marginBottom: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#234859',
  },
  alerts: {
    fontSize: 13,
    color: '#757575',
    marginTop: 2,
  },
});

export default CaregiverCard;
