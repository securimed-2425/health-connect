import * as React from 'react';

import {Button, StyleSheet, View, Text} from 'react-native';
import {DataTable} from 'react-native-paper';
import {
  aggregateRecord,
  getGrantedPermissions,
  initialize,
  insertRecords,
  getSdkStatus,
  readRecords,
  requestPermission,
  revokeAllPermissions,
  SdkAvailabilityStatus,
  openHealthConnectSettings,
  openHealthConnectDataManagement,
  readRecord,
} from 'react-native-health-connect';

import {UserAuth} from '../../context/AuthContext';

const getLastWeekDate = (): Date => {
  return new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
};


const getTodayDate = (): Date => {
  return new Date();
};


// RestingHeartRateRecord(
//   time: Instant,
//   zoneOffset: ZoneOffset?,
//   beatsPerMinute: Long,
//   metadata: Metadata
// )

type RestingHeartRateRecord = {
  time: string;
  beatsPerMinute: number;
  id?: string;
};

export default function Record() {
  const [hr, setHr] = React.useState(0);
  const {userInfo, user, db} = UserAuth();
  const [records, setRecords] = React.useState<RestingHeartRateRecord[]>([]);

  const getAllRecords = async () => {
    const isInitialized = await initialize();
    const grantedPermissions = await requestPermission([
      { accessType: 'read', recordType: 'RestingHeartRate' },
    ]);
    console.log(`${isInitialized} ${grantedPermissions}`);

    readRecords('RestingHeartRate', {
      timeRangeFilter: {
        operator: 'before',
        endTime: getTodayDate().toISOString(),
      },
    }).then(result => {
      console.log('Retrieved records: ', JSON.stringify({result}, null, 2));
      let results = new Array<RestingHeartRateRecord>();
      result.forEach(record => {
        results.push({
          time: record.time,
          beatsPerMinute: record.beatsPerMinute,
          id: record.metadata?.id,
        });
      });
      setRecords(results);
    });
  };

  // Use for testing only
  // Create sample data of increasing resting hear rate per minute recorded from today
  const insertNewSampleData = async () => {
    const isInitialized = await initialize();
    const grantedPermissions = await requestPermission([
      { accessType: 'write', recordType: 'RestingHeartRate' },
    ]);

    const baseDate = getLastWeekDate();
    insertRecords([
      {
        recordType: 'RestingHeartRate',
        beatsPerMinute: 70,
        time: baseDate.toISOString(),
      },
      {
        recordType: 'RestingHeartRate',
        beatsPerMinute: 100,
        time: new Date(baseDate.getTime() + 60 * 1000).toISOString(),
      },
      {
        recordType: 'RestingHeartRate',
        beatsPerMinute: 120,
        time: new Date(baseDate.getTime() + 2 * 60 * 1000).toISOString(),
      },
      {
        recordType: 'RestingHeartRate',
        beatsPerMinute: 300,
        time: new Date(baseDate.getTime() + 3 * 60 * 1000).toISOString(),
      }
    ]).then(ids => {
      console.log('Records inserted ', {ids});
    });
  };

  return (
    <View style={styles.container}>
      <Text>This is {userInfo.username}'s profile</Text>
      <Text>This is my public key: {userInfo.usersea.pub}</Text>
      <Button title="Get Records / Refresh Records" onPress={getAllRecords} />
      <Button title="Insert Sample Data" onPress={insertNewSampleData} />

        <DataTable style={styles.table}> 
        <DataTable.Header style={styles.tableHeader}> 
          <DataTable.Title style={{flex: 3}}>Time</DataTable.Title> 
          <DataTable.Title>BPM</DataTable.Title> 
        </DataTable.Header> 

        {records.map((record, index) => (
          <DataTable.Row key={index}>
            <DataTable.Cell style={{flex: 3}}>{record.time}</DataTable.Cell>
            <DataTable.Cell>{record.beatsPerMinute}</DataTable.Cell>
          </DataTable.Row>
        ))}
     
      </DataTable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
