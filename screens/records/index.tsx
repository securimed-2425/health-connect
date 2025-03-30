import React, {useState} from 'react';
import {DataTable} from 'react-native-paper';
import {LineChart} from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  Image,
  Pressable,
  Button,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  Switch,
  Dimensions,
} from 'react-native';

import {
  initialize,
  insertRecords,
  readRecords,
  requestPermission,
  deleteRecordsByTimeRange,
} from 'react-native-health-connect';

import {UserAuth} from '../../context/AuthContext';

import 'react-native-get-random-values';
import 'gun/lib/mobile';
import Gun from 'gun';
import SEA from 'gun/sea';
import 'react-native-webview-crypto';
import 'react-native-get-random-values';
import 'gun/lib/radix.js';
import 'gun/lib/radisk.js';
import 'gun/lib/store.js';

const samplerecords = [
  {time: '2025-03-27T08:00:00Z', beatsPerMinute: 75},
  {time: '2025-03-27T09:00:00Z', beatsPerMinute: 80},
  {time: '2025-03-27T10:00:00Z', beatsPerMinute: 78},
  {time: '2025-03-27T11:00:00Z', beatsPerMinute: 85},
  {time: '2025-03-27T12:00:00Z', beatsPerMinute: 82},
];

// Helper function to format the records into chart-friendly data
const formatChartData = (records) => {
  const labels = records.map((record) =>
    new Date(record.time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
  );

  const bpmData = records.map((record) => record.beatsPerMinute);

  return {
    labels,
    datasets: [
      {
        data: bpmData,
        strokeWidth: 2,
      },
    ],
  };
};

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

export default function Record() {
  const {userInfo, user, db} = UserAuth();
  const [records, setRecords] = React.useState<RestingHeartRateRecord[]>([]);
  const [isAutoSync, setIsAutoSync] = React.useState(false);

  const isKeyInArray = (array : any[], key: any) => { 
    return array.some(obj => obj.hasOwnProperty(key)); 
  }

  const getAllRecords = async (willAlert = true) => {
    const isInitialized = await initialize();
    const grantedPermissions = await requestPermission([
      { accessType: 'read', recordType: 'HeartRate' },
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
          results.push({time: new Date(sample.time).getTime(), beatsPerMinute: sample.beatsPerMinute});
        });
      });
      setRecords(results);
      if (willAlert)
        Alert.alert('Refreshing records', `Retrieved ${results.length} records`);
      return results;
    });
  };

  // Use for testing only
  // Create sample data of increasing resting hear rate per minute recorded from today
  const insertNewSampleData = async () => {
    const isInitialized = await initialize();
    const grantedPermissions = await requestPermission([
      { accessType: 'write', recordType: 'HeartRate' },
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
        const encrypted_bpm = await Gun.SEA.encrypt(record.beatsPerMinute, userInfo.hrkeypair);
          data[record.time] = encrypted_bpm;
          user.get('securimed')
            .get('rex')
            .get('hr')
            .put(data);
          console.log('Data synced to database', data);
      });
      if (willAlert)
        Alert.alert('Sync to Database', 'Data synced to database');
    });
  }

  React.useEffect(() => {
    syncToDatabase(false);
    console.log( 'UserInfo', userInfo );
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

  const [activeTab, setActiveTab] = useState('Tab1');

  const getTabButtonStyle = (isActive: boolean) => ({
    ...styles.tabButton,
    backgroundColor: isActive ? '#3882f4' : '#eeeeee',
  });

  const getTabTextStyle = (isActive: boolean) => ({
    color: isActive ? 'white' : '#707070',
  });

  const chartData = formatChartData(records);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, styles.margin]}>
        <Text style={[styles.textBlack, {fontWeight: 'bold', fontSize: 30, color: '#3882f4'}]}>SecuriMed</Text>
        <Icon name="qr-code" size={30} color="#3882f4" />
      </View>

      {/* Search Bar */}
      <View style={[styles.margin, {backgroundColor: '#eeeeee', color: '#707070', borderRadius: 20, padding: 13}]}>
        <Text>Search</Text>
      </View>

      {/* BPM Graph */}
      <View style={styles.graphContainer}>

        <View style={{flexDirection: 'row', columnGap: 10}}>
          <View style={{backgroundColor: 'white', borderRadius: 20, paddingVertical: 18, paddingLeft: 13, paddingRight: 23, flexDirection: 'row', columnGap: 8}}>
            <View>
              <Text
                style={[styles.textBlack, {fontWeight: 500, marginBottom: -2}]}>
                {userInfo.username}'s
              </Text>
              <Text
                style={[styles.textBlack, {fontSize: 25, fontWeight: 'bold'}]}>
                Heart Rate
              </Text>
            </View>
          </View>

          <View style={{backgroundColor: '#3882f4', borderRadius: 20, padding: 13}}>
            <Text style={{color: 'white', fontWeight: 500, marginBottom: -9}}>Latest</Text>
            <View style={{flexDirection: 'row', columnGap: 5, alignItems: 'flex-end'}}>
              <Text style={{color: 'white', fontSize: 40 , fontWeight: 500, marginBottom: -5}}>54</Text>
              <Text style={{color: 'white', fontSize: 16}}>BPM</Text>
            </View>
          </View>
        </View>

        {0 === 0 ? (
          <LineChart
            data={formatChartData(samplerecords)}
            width={Dimensions.get('window').width - 23}
            height={250}
            yAxisLabel=""
            yAxisSuffix=" BPM"
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(34, 139, 230, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#3882f4',
              },
            }}
            bezier
            style={styles.chart}
          />
        ) : (
          <Text>No data available</Text>
        )}
      </View>

      <View style={styles.margin}>
        {/* Tab Buttons */}
        <View style={styles.tabButtons}>
          <Pressable
            onPress={() => setActiveTab('Tab1')}
            style={StyleSheet.flatten([
              styles.tabButton,
              getTabButtonStyle(activeTab === 'Tab1'),
            ])}>
            <Text style={getTabTextStyle(activeTab === 'Tab1')}>Trustors</Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('Tab2')}
            style={StyleSheet.flatten([
              styles.tabButton,
              getTabButtonStyle(activeTab === 'Tab2'),
            ])}>
            <Text style={getTabTextStyle(activeTab === 'Tab2')}>Trustees</Text>
          </Pressable>
        </View>

        {/* Tab Content */}
        <View style={styles.friendCard}>
          {activeTab === 'Tab1' ? (
            <View style={styles.profile}>
              <View style={[styles.friendImage, {backgroundColor: 'white'}]} />
              <View style={styles.whiteCard}>
                <Text style={[styles.textBlue, styles.leadingTight]}>
                  Lance Raphael Bassig
                </Text>
                <Text style={styles.textBlack}>Friend</Text>
              </View>
            </View>
          ) : (
            <Text>Content for Tab 2</Text>
          )}
        </View>
      </View>

      <Text>Public key: {userInfo.usersea.pub}</Text>
      <Button title="Insert Sample Data (For Testing Only)" onPress={insertNewSampleData} />
      <Button title="Delete All Records (For Testing Only)" onPress={deleteAllRecords} />
      <Button title="Refresh Records" onPress={() => {getAllRecords()}} />
      <Button title="Sync to Database" onPress={() => syncToDatabase()} />
      <View style={{flexDirection: 'row'}}>
        <Text>Auto Sync</Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          onValueChange={() => {
            setIsAutoSync(prev => !prev);
          }}
          value={isAutoSync}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  bpmDisplay: {
    backgroundColor: '#EFF4FF',
    height: 400,
  },
  graphContainer: {
    backgroundColor: '#C3DAFC',
    padding: 12,
    rowGap: 12,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212020',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 20,
  },
  margin: {
    margin: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profile: {
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
  },
  tabButtons: {
    flexDirection: 'row',
    columnGap: 5,
    marginBottom: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendCard: {
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#c3dafc',
    borderRadius: 20,
  },
  friendImage: {
    width: 55,
    height: 55,
    borderRadius: 50,
  },
  whiteCard: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  leadingTight: {
    marginBottom: -1,
  },
  textBlue: {
    color: '#3882f4',
  },
  textBlack: {
    color: '#212020',
  },
  textGray: {
    color: '#828181',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  table: {
    padding: 15,
  },
});
