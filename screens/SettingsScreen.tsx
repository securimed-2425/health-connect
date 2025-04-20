import React, {useState} from 'react';
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

import {UserAuth} from '../context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import QRModal from '../components/QRModal';

const SettingsScreen = () => {
  // QR Code Logic
  const [qrVisible, setQrVisible] = useState(false);
  const handleOpenQR = () => setQrVisible(true);
  const handleCloseQR = () => setQrVisible(false);

  // Toggle Dark Mode Logic
  const {darkMode, toggleDarkMode} = UserAuth();

  // Logout Logic
  const navigation = useNavigation();
  const {userInfo, logOut} = UserAuth();
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logOut();
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        },
      },
    ]);
  };

  // Help Logic
  const handleHelp = () => {
    Alert.alert('Help', 'You can contact support@example.com for help.');
  };

  // Change Password Logic
  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Redirect to change password screen (TBD)');
  };

  //****** FRONTEND START ******//

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <TouchableOpacity onPress={handleOpenQR}>
            <Icon name="qr-code" size={32} />
          </TouchableOpacity>
        </View>

        {/* Settings Options */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            thumbColor={darkMode ? '#1E88E5' : '#ccc'}
          />
        </View>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleChangePassword}>
          <Text style={styles.settingText}>Change Password / PIN</Text>
          <Icon name="lock" size={24} color="#234859" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={handleHelp}>
          <Text style={styles.settingText}>Help</Text>
          <Icon name="help-outline" size={24} color="#234859" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
          <Text style={[styles.settingText, {color: '#D32F2F'}]}>Logout</Text>
          <Icon name="logout" size={24} color="#D32F2F" />
        </TouchableOpacity>
      </ScrollView>

      {/* QR Modal */}
      {userInfo && (
        <QRModal
          visible={qrVisible}
          onClose={handleCloseQR}
          userInfo={userInfo}
          styles={styles}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    flex: 1,
    padding: 12,
    rowGap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
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
