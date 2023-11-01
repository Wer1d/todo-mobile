import { NavigationContainer } from '@react-navigation/native';
import SignIn from './SignIn';
import SignUp from './SignUp'
import Credit from './Credit'
import SignOut from './SignOut'
import Main from './Main'
import {  StyleSheet, Text, View } from 'react-native';
import { Header, createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function AppDrawer() {
  return (
    <Drawer.Navigator initialRouteName='Main'>
      <Drawer.Screen name="Main" component={Main} options={{headerLeft:null}}/>
      <Drawer.Screen name="Credit" component={Credit} />
      <Drawer.Screen name="SignOut" component={SignOut} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: true, headerLeft:null }}/>
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: true, headerLeft:null }}/>
        <Stack.Screen name="AppDrawer" component={AppDrawer} options={{ headerShown: false , headerLeft:null}}/>
      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
    
  );
}


