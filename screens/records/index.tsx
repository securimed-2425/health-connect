import React from 'react';
import BottomNav from '../../components/bottomNav';
import {SafeAreaView, StyleSheet} from 'react-native';

import 'react-native-get-random-values';
import 'gun/lib/mobile';
import 'react-native-webview-crypto';
import 'react-native-get-random-values';
import 'gun/lib/radix.js';
import 'gun/lib/radisk.js';
import 'gun/lib/store.js';

export default function Record() {
  return (
    <SafeAreaView style={styles.container}>
      <BottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f1f6',
  },
});