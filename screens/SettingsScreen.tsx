import React, { useState } from 'react';
import {
  ScrollView,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Alert,
  Switch,
  TouchableOpacity,
  Pressable,
} from 'react-native';

import { UserAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import QRModal from '../components/QRModal';

const SettingsScreen = () => {
  const [qrVisible, setQrVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const { userInfo, logout } = UserAuth();

  const handleOpenQR = () => setQrVisible(true);
  const handleCloseQR = () => setQrVisible(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const handleHelp = () => {
    Alert.alert('Help', 'You can contact support@example.com for help.');
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Redirect to change password screen (TBD)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Settings</Text>
          <TouchableOpacity onPress={handleOpenQR}>
            <Icon name="qr-code" size={32} color="#234859" />
          </TouchableOpacity>
        </View>

        {/* Settings Options */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            thumbColor={darkMode ? '#1E88E5' : '#ccc'}
          />
        </View>

        <TouchableOpacity style={styles.settingItem} onPress={handleChangePassword}>
          <Text style={styles.settingText}>Change Password / PIN</Text>
          <Icon name="lock" size={24} color="#234859" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={handleHelp}>
          <Text style={styles.settingText}>Help</Text>
          <Icon name="help-outline" size={24} color="#234859" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
          <Text style={[styles.settingText, { color: '#D32F2F' }]}>Logout</Text>
          <Icon name="logout" size={24} color="#D32F2F" />
        </TouchableOpacity>
      </ScrollView>

      {/* QR Modal */}
      <QRModal
        visible={qrVisible}
        onClose={handleCloseQR}
        userInfo={userInfo}
        styles={styles}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    padding: 16,
    rowGap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 25,
    color: '#234859',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    padding: 14,
    borderRadius: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#234859',
    fontWeight: '500',
  },
});

export default SettingsScreen;
