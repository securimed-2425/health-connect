import * as React from 'react';
import { BottomNavigation, Text} from 'react-native-paper';

import HealthScreen from '../screens/HealthScreen';

const SharingRoute = () => <Text>owo</Text>;

const SettingsRoute = () => <Text>hihi</Text>;

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
      title: 'Sharing',
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
    sharing: SharingRoute,
    settings: SettingsRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default BottomNav;