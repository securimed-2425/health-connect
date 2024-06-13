import * as React from 'react';

import {Button, StyleSheet, View, Text, ScrollView, Alert, Switch} from 'react-native';
import {DataTable} from 'react-native-paper';
import {
  initialize,
  insertRecords,
  readRecords,
  requestPermission,
  deleteRecordsByTimeRange
} from 'react-native-health-connect';

import {UserAuth} from '../../context/AuthContext';

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
          {time: new Date(baseDate.getTime() + 60 * 1000).toISOString(), beatsPerMinute: 100},
          {time: new Date(baseDate.getTime() + 2 * 60 * 1000).toISOString(), beatsPerMinute: 120},
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
    getAllRecords(false).then(() => {
      records.forEach(record => {
        let data: {[key: string]: number} = {};
        data[record.time] = record.beatsPerMinute;
        db.get('securimed')
          .get('rx')
          .get('heartRate')
          .put(data);
        console.log('Data synced to database', data);
        
      });
      if (willAlert)
        Alert.alert('Sync to Database', 'Data synced to database');
    });

    // db.get('securimed')
    // .get('rx')
    // .get('heartRate')
    // .on((data: any) => {
    //   console.log(data);
    // });
  }

  React.useEffect(() => {
    syncToDatabase(false);
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
      <Text style={{fontSize: 20, textAlign: 'left'}}> Username: {userInfo.username}</Text>
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
            setIsAutoSync(prev => !prev)
          }}
          value={isAutoSync}
      ></Switch>
      </View>
      <DataTable style={{flex: 1}}> 
        <DataTable.Header style={styles.tableHeader}> 
          <DataTable.Title style={{flex: 4}}>Time</DataTable.Title> 
          <DataTable.Title>BPM</DataTable.Title> 
        </DataTable.Header> 
        
        <ScrollView>
        {records.map((record, index) => (
          <DataTable.Row key={index}>
            <DataTable.Cell style={{flex: 4}}>{(new Date(record.time)).toUTCString()}</DataTable.Cell>
            <DataTable.Cell>{record.beatsPerMinute}</DataTable.Cell>
          </DataTable.Row>
        ))}
        </ScrollView>
      </DataTable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    rowGap: 16,
    margin: 20,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  table : {
    padding: 15,
  },
  tableHeader: { 
    backgroundColor: '#DCDCDC', 
  }, 
});
