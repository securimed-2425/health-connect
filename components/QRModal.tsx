import React from 'react';
import {Modal, View, Text, Pressable, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-clipboard/clipboard';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface QRModalProps {
  visible: boolean;
  onClose: () => void;
  userInfo: any;
  styles: any;
}

const QRModal = ({visible, onClose, userInfo, styles}: QRModalProps) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: '#FAFAFA',
          paddingTop: insets.top + 20,
          paddingHorizontal: 24,
        }}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onClose} style={{ alignSelf: 'flex-start' }}>
            <Icon name="close" size={28} color="#234859" />
          </Pressable>
          <Text style={{ fontSize: 20, color: '#234859', fontWeight: '500' }}>
            Your QR Code
          </Text>
          <Pressable>
            <Icon name="qrcode-scan" size={28} color="#234859" />
          </Pressable>
        </View>

        {/* Content */}
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            rowGap: 20,
          }}>
          <Text style={{ fontSize: 23, color: '#234859', fontWeight: '600' }}>
            {userInfo.username}
          </Text>
          <View style={styles.qrContainer}>
            <QRCode value={userInfo.usersea.pub} size={220} color="#1E88E5" />
          </View>
          <Text style={{ textAlign: 'center' }}>
            When you share your QR code with someone, they will be able to see
            your username & heart rate data.
          </Text>
          <Text style={{ color: '#1E88E5' }}>Reset QR Code</Text>
        </View>

        {/* Share Button */}
        <Pressable
          onPress={() => {
            Clipboard.setString(userInfo.usersea.pub);
            Alert.alert(
              'Copied!',
              'Your public key has been copied to the clipboard.',
            );
          }}
          style={{
            backgroundColor: '#1E88E5',
            paddingVertical: 14,
            borderRadius: 10,
            alignItems: 'center',
            marginBottom: insets.bottom + 16,
          }}>
          <Text style={{color: 'white', fontSize: 16, fontWeight: '600'}}>
            Share
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default QRModal;
