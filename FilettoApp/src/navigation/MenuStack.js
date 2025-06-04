import React from 'react';
import { View } from 'react-native';
import TextButton from '@components/base/TextButton';
import { createStackNavigator } from '@react-navigation/stack';

import MenuScreen from '@src/screens/MenuScreen';
import GameScreen from '@src/screens/GameScreen';

import { NAVIGATION } from '@config/ConfigNavigation';
import SPACING, { getMarginTop } from '@config/ConfigSpacing';
import JoinScreen from '@src/screens/JoinScreen';
import JoinFromLinkScreen from '@src/screens/JoinFromLinkScreen';
import FindRoomScreen from '@src/screens/FindRoomScreen';
import RoomScreen from '@src/screens/RoomScreen';
import HostGameScreen from '@src/screens/HostGameScreen';
import CreateRoomScreen from '@src/screens/CreateRoomScreen';

const Stack = createStackNavigator();

// Header with button
// Hiding the header for now
const Header = ({ navigation }) => {
  return null;
  return (
    <View style={{
      position: "absolute",
      alignItems: 'flex-start',
      height: SPACING.sizeHeader,
      paddingLeft: SPACING.paddingHorizontal,
      marginTop: getMarginTop()
    }}>
      <TextButton
        text={"Back"}
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

const MenuStack = () => {
  return (
    <Stack.Navigator initialRouteName={NAVIGATION.SCREENS.MENU}>
      <Stack.Screen 
        name={NAVIGATION.SCREENS.MENU}
        component={MenuScreen} 
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name={NAVIGATION.SCREENS.FIND_ROOM}
        component={FindRoomScreen} 
        options={({ navigation }) => ({
          header: () => <Header navigation={navigation} />,  // Custom header component
        })}
      />
      <Stack.Screen 
        name={NAVIGATION.SCREENS.CREATE_ROOM}
        component={CreateRoomScreen} 
        options={({ navigation }) => ({
          header: () => <Header navigation={navigation} />,  // Custom header component
        })}
      />
      <Stack.Screen 
        name={NAVIGATION.SCREENS.ROOM}
        component={RoomScreen} 
        options={({ navigation }) => ({
          header: () => <Header navigation={navigation} />,  // Custom header component
        })}
      />
      <Stack.Screen 
        name={NAVIGATION.SCREENS.JOIN_FROM_LINK}
        component={JoinFromLinkScreen} 
        options={({ navigation }) => ({
          header: () => <Header navigation={navigation} />,  // Custom header component
        })}
      />
      <Stack.Screen 
        name={NAVIGATION.SCREENS.JOIN}
        component={JoinScreen} 
        options={({ navigation }) => ({
          header: () => <Header navigation={navigation} />,  // Custom header component
        })}
      />
      <Stack.Screen 
        name={NAVIGATION.SCREENS.GAME}
        component={GameScreen} 
        options={({ navigation }) => ({
          header: () => <Header navigation={navigation} />,  // Custom header component
        })}
      />
      <Stack.Screen 
        name={NAVIGATION.SCREENS.HOST_GAME}
        component={HostGameScreen} 
        options={({ navigation }) => ({
          header: () => <Header navigation={navigation} />,  // Custom header component
        })}
      />
    </Stack.Navigator>
)};

export default MenuStack;