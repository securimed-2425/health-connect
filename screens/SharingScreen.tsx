import React, { useState } from 'react';
import {
  ScrollView,
  SafeAreaView,
  View,
  Image,
  Text,
  StyleSheet,
  Alert,
  Button,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {UserAuth} from '../context/AuthContext';

import QRModal from '../components/QRModal';
import SearchBar from '../components/SearchBar';
import CaregiverCard from '../components/CaregiverCard';
import SupportedCard from '../components/SupportedCard';
import CaregiverModal from '../components/CaregiverModal';
import SupportedModal from '../components/SupportedModal';

const SharingScreen = () => {
  const [qrVisible, setQrVisible] = useState(false);
  const handleOpenQR = () => setQrVisible(true);
  const handleCloseQR = () => setQrVisible(false);

  const {userInfo, user, db} = UserAuth();

  const [searchQuery, setSearchQuery] = useState('');

  // Dummy data
  const [caregivers, setCaregivers] = useState([
    { name: 'Lara Mendoza', access: 'Alerts Only', },
    { name: 'Carlos Rivera', access: 'Alerts Only', },
    { name: 'Dr. Elisa Chan', access: 'Full Access', },
  ]);
  const [supportedPeople, setSupportedPeople] = useState([
    { name: 'Lola Santos', alerts: 2, lastUpdated: '2 min ago' },
    { name: 'Tito Bob', alerts: 0, lastUpdated: '3 min ago' },
    { name: 'Kuya Jake', alerts: 0, lastUpdated: '10 min ago' },
    { name: 'Maxine', alerts: 1, lastUpdated: 'Yesterday' },
    { name: 'Uncle Jojo', alerts: 1, lastUpdated: 'Yesterday' },
  ]);

  // Filter logic
  const filteredCaregivers = caregivers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const filteredSupported = supportedPeople.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const [selectedCaregiver, setSelectedCaregiver] = useState(null);
  const [selectedSupported, setSelectedSupported] = useState(null);
  const [caregiverModalVisible, setCaregiverModalVisible] = useState(false);
  const [supportedModalVisible, setSupportedModalVisible] = useState(false);

  //****** FRONTEND START ******//

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Care Circle</Text>
          <TouchableOpacity onPress={handleOpenQR}>
            <Icon name="qr-code" size={32} />
          </TouchableOpacity>
        </View>

        {/* Modals */}
        {userInfo && (
          <QRModal
            visible={qrVisible}
            onClose={handleCloseQR}
            userInfo={userInfo}
            styles={styles}
          />
        )}

        <CaregiverModal
          visible={caregiverModalVisible}
          caregiver={selectedCaregiver}
          onClose={() => setCaregiverModalVisible(false)}
        />

        <SupportedModal
          visible={supportedModalVisible}
          person={selectedSupported}
          onClose={() => setSupportedModalVisible(false)}
        />

        {/* Search Bar */}
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        {/* Sharing Sections */}
        <ScrollView contentContainerStyle={{rowGap: 28, paddingHorizontal: 2, paddingVertical: 4,}}>
          {/* Caregivers */}
          <View>
            <Text style={styles.sectionLabel}>Your Caregivers</Text>
            {filteredCaregivers.map((person, idx) => (
              <React.Fragment key={idx}>
                <CaregiverCard
                  name={person.name}
                  access={person.access}
                  onPress={() => {
                    setSelectedCaregiver(person);
                    setCaregiverModalVisible(true);
                  }}
                />
              </React.Fragment>
            ))}
            <TouchableOpacity style={styles.card}>
              <Icon name="person-add-alt" size={20} style={{ marginRight: 9 }} />
              <Text style={styles.addText}>Add another caregiver</Text>
            </TouchableOpacity>
          </View>

          {/* People You Support */}
          <View>
            <Text style={styles.sectionLabel}>People You Support</Text>
            {filteredSupported.map((person, idx) => (
              <React.Fragment key={idx}>
                <SupportedCard
                  name={person.name}
                  alerts={person.alerts}
                  lastUpdated={person.lastUpdated}
                  onPress={() => {
                    setSelectedSupported(person);
                    setSupportedModalVisible(true);
                  }}
                />
              </React.Fragment>
            ))}
            <TouchableOpacity style={styles.card}>
              <Icon name="person-add-alt" size={20} style={{ marginRight: 9 }} />
              <Text style={styles.addText}>Add another person</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
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
  title: {
    fontWeight: 'bold',
    fontSize: 25,
    color: '#234859',
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#234859',
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
    paddingVertical: 6,
  },
  nameText: {
    fontSize: 16,
    color: '#444',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 1,
  },
  addText: {
    fontSize: 16,
  },
});

export default SharingScreen;
