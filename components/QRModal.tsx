import React from 'react';
import {Modal, View, Text, Pressable, Alert, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-clipboard/clipboard';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

interface QRModalProps {
  visible: boolean;
  onClose: () => void;
  userInfo: any;
  styles: any; // styles.header and styles.qrContainer come from parent
}

const QRModal = ({visible, onClose, userInfo, styles}: QRModalProps) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={[
          localStyles.container,
          {
            paddingTop: insets.top + 20,
          },
        ]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onClose} style={localStyles.headerButton}>
            <Icon name="close" size={28} color="#234859" />
          </Pressable>
          <Text style={localStyles.title}>Your QR Code</Text>
          <Pressable onPress={() => navigation.navigate('QRScanner')}>
            <Icon name="qrcode-scan" size={28} color="#234859" />
          </Pressable>
        </View>

        {/* Content */}
        <View style={localStyles.content}>
          <Text style={localStyles.username}>{userInfo.username}</Text>
          <View style={styles.qrContainer}>
            <QRCode value={userInfo.usersea.pub} size={220} color="#1E88E5" />
          </View>
          <Text style={localStyles.description}>
            When you share your QR code with someone, they’ll be added to your
            list of caregivers and will be able to view your heart rate data.
          </Text>
          <Text style={localStyles.resetText}>Reset QR Code</Text>
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
          style={[localStyles.shareButton, {marginBottom: insets.bottom + 16}]}>
          <Text style={localStyles.shareText}>Share</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default QRModal;

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 24,
  },
  headerButton: {
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 20,
    color: '#234859',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 20,
  },
  username: {
    fontSize: 23,
    color: '#234859',
    fontWeight: '600',
  },
  description: {
    textAlign: 'center',
  },
  resetText: {
    color: '#1E88E5',
  },
  shareButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  shareText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
