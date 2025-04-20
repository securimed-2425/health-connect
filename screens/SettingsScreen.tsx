import React, { useState } from 'react';
import {
  ScrollView,
  RefreshControl,
  SafeAreaView,
  View,
  Image,
  Text,
  StyleSheet,
  Alert,
  Button,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';

import {UserAuth} from '../context/AuthContext';

import Icon from 'react-native-vector-icons/MaterialIcons';
import QRModal from '../components/QRModal';

const SettingsScreen = () => {
  const [qrVisible, setQrVisible] = useState(false);
  const handleOpenQR = () => setQrVisible(true);
  const handleCloseQR = () => setQrVisible(false);

  const {userInfo, user, db} = UserAuth();

  //****** FRONTEND START ******//

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={{fontWeight: 'bold', fontSize: 25, color: '#234859'}}>
            Settings
          </Text>
          <TouchableOpacity onPress={handleOpenQR}>
            <Icon name="qr-code" size={32} />
          </TouchableOpacity>
        </View>

        {/* QR Modal */}
        <QRModal
          visible={qrVisible}
          onClose={handleCloseQR}
          userInfo={userInfo}
          styles={styles}
        />
      </View>
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
    rowGap: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default SettingsScreen;
