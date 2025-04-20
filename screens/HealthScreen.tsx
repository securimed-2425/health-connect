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
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import HeartRateGraph from '../components/HeartRateGraph';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  initialize,
  insertRecords,
  readRecords,
  requestPermission,
  deleteRecordsByTimeRange,
} from 'react-native-health-connect';

import {UserAuth} from '../context/AuthContext';

import 'react-native-get-random-values';
import 'gun/lib/mobile';
import Gun from 'gun';
import 'react-native-webview-crypto';
import 'react-native-get-random-values';
import 'gun/lib/radix.js';
import 'gun/lib/radisk.js';
import 'gun/lib/store.js';

import Favicon from '../assets/favicon.png';
import QRModal from '../components/QRModal';

const getLastWeekDate = (): Date => {
  return new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
};
  
const getTodayDate = (): Date => {
  return new Date();
};
  
type RestingHeartRateRecord = {
  time: number;
  beatsPerMinute: number;
};

const HealthScreen = () => {
  const [qrVisible, setQrVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const handleOpenQR = () => setQrVisible(true);
  const handleCloseQR = () => setQrVisible(false);

  const {userInfo, user, db} = UserAuth();
  const [records, setRecords] = React.useState<RestingHeartRateRecord[]>([]);
  const [isAutoSync, setIsAutoSync] = React.useState(false);

  const isKeyInArray = (array: any[], key: any) => {
    return array.some(obj => obj.hasOwnProperty(key));
  };

  const getAllRecords = async (willAlert = true) => {
    const isInitialized = await initialize();
    const grantedPermissions = await requestPermission([
      {accessType: 'read', recordType: 'HeartRate'},
    ]);
    console.log(`${isInitialized} ${grantedPermissions}`);

    return readRecords('HeartRate', {
      timeRangeFilter: {
        operator: 'before',
        endTime: getTodayDate().toISOString(),
      },
    }).then(result => {
      console.log('Retrieved records: ', JSON.stringify({result}, null, 2));
      let results = new Array<RestingHeartRateRecord>();
      result.forEach(record => {
        record.samples.forEach(sample => {
          results.push({
            time: new Date(sample.time).getTime(),
            beatsPerMinute: sample.beatsPerMinute,
          });
        });
      });
      setRecords(results);
      if (willAlert)
        Alert.alert(
          'Refreshing records',
          `Retrieved ${results.length} records`,
        );
      return results;
    });
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await getAllRecords(); // your existing record-fetching function
    setRefreshing(false);
  };
  
  // Use for testing only
  // Create sample data of increasing resting hear rate per minute recorded from today
  const insertNewSampleData = async () => {
    const isInitialized = await initialize();
    const grantedPermissions = await requestPermission([
      {accessType: 'write', recordType: 'HeartRate'},
    ]);

    const baseDate = getLastWeekDate();
    insertRecords([
      {
        recordType: 'HeartRate',
        samples: [
          {time: baseDate.toISOString(), beatsPerMinute: 70},
            {time: new Date(baseDate.getTime() + 60 * 1000).toISOString(), beatsPerMinute: 75},
            {time: new Date(baseDate.getTime() + 2 * 60 * 1000).toISOString(), beatsPerMinute: 80},
          ],
        startTime: baseDate.toISOString(),
        endTime: new Date(baseDate.getTime() + 2 * 60 * 1000).toISOString(),
      }
    ]).then(ids => {
      console.log('Records inserted ', {ids});
      Alert.alert('Insert Sample Data', `Inserted ${ids.length} records`);
    });
  };
  
  const deleteAllRecords = async () => {
    const isInitialized = await initialize();
    const grantedPermissions = await requestPermission([
      { accessType: 'write', recordType: 'HeartRate' },
    ]);
  
    deleteRecordsByTimeRange('HeartRate', {
      operator: 'before',
      endTime: getTodayDate().toISOString(),
    })
    console.log('All records deleted');
    Alert.alert('Delete All Records', 'All records deleted');
  }
  
  const syncToDatabase = async (willAlert = true) => {
    if ( ! userInfo && ! userInfo.hrkeypair) {
      console.log( 'No user info found' );
      return;
    }
    getAllRecords(false).then(() => {
      records.forEach( async (record) => {
        let data: {[key: number]: string} = {};
        const encrypted_bpm = await Gun.SEA.encrypt(
          record.beatsPerMinute,
          userInfo.hrkeypair);
        data[record.time] = encrypted_bpm;
        user.get('securimed').get('rex').get('hr').put(data);
        console.log('Data synced to database', data);
      });
      if (willAlert) Alert.alert('Sync to Database', 'Data synced to database');
    });
  };

  React.useEffect(() => {
    syncToDatabase(false);
    console.log('UserInfo', userInfo);
  }, []);

  // Run syncToDatabase every 60 seconds
  // only if isAutoSync is true
  React.useEffect(() => {
    if (isAutoSync) {
      const interval = setInterval(() => {
        syncToDatabase(false);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [isAutoSync]);

  //****** FRONTEND START ******//

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1E88E5']}
          />
        }>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={Favicon}
                style={{ width: 30, height: 30, marginRight: 8 }}
                resizeMode="contain"
              />
              <Text style={{ fontWeight: 'bold', fontSize: 25, color: '#234859' }}>
                SecuriMed
              </Text>
            </View>
            <TouchableOpacity onPress={handleOpenQR}>
              <Icon name="qr-code" size={32} />
            </TouchableOpacity>
          </View>

          {userInfo && (
            <QRModal
              visible={qrVisible}
              onClose={handleCloseQR}
              userInfo={userInfo}
              styles={styles}
            />
          )}

          {/* Heart Rate */}
          <View>
            <Text style={styles.sectionLabel}>Heart Rate</Text>
            <View style={styles.whiteCard}>
              <HeartRateGraph />
              <View
                style={{
                  width: '100%',
                  borderBottomWidth: 0.2,
                  borderBottomColor: '#929292',
                }}
              />
            </View>
          </View>

          <Button title="Insert Sample Data (For Testing Only)" onPress={insertNewSampleData} />
          <Button title="Delete All Records (For Testing Only)" onPress={deleteAllRecords} />
          {/* <Button title="Sync to Database" onPress={() => syncToDatabase()} />
          <View style={{flexDirection: 'row'}}>
            <Text>Auto Sync</Text>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              onValueChange={() => {
                setIsAutoSync(prev => !prev);
              }}
              value={isAutoSync}
            />
          </View> */}
        </View>
      </ScrollView>
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
  qrContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    alignSelf: 'center',
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#234859',
    marginBottom: 8,
  },
  headingMargins: {
    marginTop: 6,
    marginBottom: -10,
    marginLeft: 3,
    marginRight: 4,
  },
  headingWithMore: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headingText: {
    color: '#234859',
    fontSize: 23,
    fontWeight: 'bold',
  },

  whiteCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    overflow: 'hidden',
  },
});

export default HealthScreen;
