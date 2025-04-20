import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';

const QRScanner = () => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(false);

  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE]);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  useEffect(() => {
    if (barcodes.length > 0) {
      const code = barcodes[0].displayValue;
      if (code) {
        Alert.alert('QR Code Scanned', `Scanned: ${code}`, [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    }
  }, [barcodes]);

  if (device == null || !hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Waiting for camera permissions...</Text>
      </View>
    );
  }

  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      frameProcessor={frameProcessor}
      frameProcessorFps={5}
    />
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    color: '#333',
    fontSize: 18,
  },
});

export default QRScanner;
