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
  {time: '2025-03-27T08:00:00Z', beatsPerMinute: 75}, // 8 AM
  {time: '2025-03-27T09:00:00Z', beatsPerMinute: 80}, // 9 AM
  {time: '2025-03-27T10:00:00Z', beatsPerMinute: 78}, // 10 AM
  {time: '2025-03-27T11:00:00Z', beatsPerMinute: 85}, // 11 AM
  {time: '2025-03-27T12:03:00Z', beatsPerMinute: 82}, // 12:03 PM
  {time: '2025-03-27T00:00:00Z', beatsPerMinute: 65}, // 12 AM
  {time: '2025-03-27T07:00:00Z', beatsPerMinute: 70}, // 7 AM
  {time: '2025-03-27T12:00:00Z', beatsPerMinute: 75}, // 12 PM
  {time: '2025-03-27T19:00:00Z', beatsPerMinute: 80}, // 7 PM
];

const xAxisLabels = ['12 AM', '6 AM', '12 PM', '6 PM', '12 AM'];

// Map time to normalized x-position (0 to 24 range)
const mapTimeToX = (time: string | number | Date) => {
  const date = new Date(time);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return hours + minutes / 60; // 0 → 24 range
};

// Format chart data with proper x-axis alignment
const formatChartData = (records: any[]) => {
  const totalHours = 24; // Range of 24 hours for the entire day
  const dataPoints = new Array(totalHours * 4).fill(null); // Higher resolution

  // Map each record to its precise x-position
  records.forEach(record => {
    const xPos = mapTimeToX(record.time);
    const index = Math.floor((xPos / totalHours) * dataPoints.length); // Scaled index
    dataPoints[index] = record.beatsPerMinute;
  });

  return {
    labels: xAxisLabels, // Fixed labels
    datasets: [
      {
        data: dataPoints.map(value => value ?? null), // Fill null gaps
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.textBlack, {fontWeight: '800', fontSize: 33, color: '#3882f4'}]}>SecuriMed</Text>
        <Icon name="qr-code" size={33} color="#3882f4" />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Icon name="search" size={20} />
        <Text style={{fontSize: 17}}>Search</Text>
      </View>

      {/* Heart Rate */}
      <View style={[styles.headingMargins, styles.headingWithMore]}>
        <Text style={styles.headingText}>Heart Rate</Text>
        <View style={{flexDirection: 'row', columnGap: 4, alignItems: 'center'}}>
          <Icon name="share" size={14} color="#3882f4"/>
          <Text style={{fontSize: 16, color: '#3882f4'}}>Share</Text>
        </View>
      </View>

      <View style={styles.whiteCard}>

        {0 === 0 ? (
          <LineChart
            data={formatChartData(samplerecords)}
            width={Dimensions.get('window').width - 40}
            height={280}
            yAxisLabel=""
            yAxisSuffix=" BPM"
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 0) => `rgba(34, 139, 230, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: '4',
              },
            }}
            bezier
            style={{marginLeft: -11, marginTop: 10}}
          />
        ) : (
          <Text>No data available</Text>
        )}

        <View
          style={{
            width: '100%',
            borderBottomWidth: 0.2,
            borderBottomColor: '#929292',
          }}
        />
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
    backgroundColor: '#f2f1f6',
    padding: 12,
    rowGap: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: -9,
  },
  searchBar: {
    flexDirection: 'row', 
    columnGap: 4, 
    alignItems: 'center', 
    backgroundColor: '#E4E3E9', 
    color: '#929292', 
    borderRadius: 24, 
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  headingMargins: {
    marginTop: 6,
    marginBottom: -12,
    marginLeft: 3,
    marginRight: 4,
  },
  headingWithMore: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headingText: {
    color: '#040404',
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
