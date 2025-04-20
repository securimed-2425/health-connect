import React, {useEffect} from 'react';
import {Alert, StyleSheet} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';

export default function QRScanner({ navigation }) {
  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes(
    [BarcodeFormat.QR_CODE],
    { checkInverted: true }
  );

  useEffect(() => {
    if (barcodes.length > 0) {
      const code = barcodes[0]?.rawValue;
      if (code) {
        Alert.alert('QR Code Detected', code);
        navigation.goBack(); // Go back after scanning
      }
    }
  }, [barcodes]);

  if (!device) return null;

  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      frameProcessor={frameProcessor}
      frameProcessorFps={5}
    />
  );
}
