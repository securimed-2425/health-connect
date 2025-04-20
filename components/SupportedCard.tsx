import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SupportedCard = ({ name, alerts, lastUpdated, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Cute Icon */}
      <Icon name="favorite" size={32} color="#1E88E5" />

      {/* Name and Alerts */}
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.alerts}>{alerts} Alerts</Text>
      </View>

      {/* Last Updated */}
      <Text style={styles.updated}>{lastUpdated}</Text>
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
  updated: {
    fontSize: 12,
    color: '#90A4AE',
    alignSelf: 'flex-start',
  },
});

export default SupportedCard;
