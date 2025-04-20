import * as React from 'react';
import {BottomNavigation} from 'react-native-paper';
import HealthScreen from '../screens/HealthScreen';
import SharingScreen from '../screens/SharingScreen';
import SettingsScreen from '../screens/SettingsScreen';

const BottomNav = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: 'health',
      title: 'Health',
      focusedIcon: 'heart',
      unfocusedIcon: 'heart-outline',
    },
    {
      key: 'sharing',
      title: 'Care Circle',
      focusedIcon: 'account-supervisor',
      unfocusedIcon: 'account-supervisor-outline',
    },
    {
      key: 'settings',
      title: 'Settings',
      focusedIcon: 'cog',
      unfocusedIcon: 'cog-outline',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    health: HealthScreen,
    sharing: SharingScreen,
    settings: SettingsScreen,
  });

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={{
        backgroundColor: '#FFFFFF',
      }}
      activeColor="#1E88E5"
      inactiveColor="#9E9E9E"
      theme={{
        colors: {
          secondaryContainer: 'transparent',
        },
      }}
    />
  );
};

export default BottomNav;
