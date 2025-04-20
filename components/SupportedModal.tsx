import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';

const SupportedModal = ({ visible, person, onClose }) => {
  if (!person) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'white',
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{person.name}</Text>
        <Text>Alerts: {person.alerts}</Text>
        <Text>Last updated: {person.lastUpdated}</Text>
        <Pressable onPress={onClose} style={{ marginTop: 20 }}>
          <Text style={{ color: 'blue' }}>Close</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default SupportedModal;
