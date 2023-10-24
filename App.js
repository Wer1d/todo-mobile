import { NavigationContainer } from '@react-navigation/native';
import SignIn from './SignIn'
import SignUp from './SignUp'
import Credit from './Credit'
import SignOut from './SignOut'
import Main from './Main'
import ResetPassword from './ResetPassword'
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
import { Header, createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';

export default function App() {
  AppRegistry.registerComponent('App', () => App);
  const Stack = createStackNavigator();
  return (
    <PaperProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="sign-in">
          <Stack.Screen name="sign-in" component={SignIn} />
          <Stack.Screen name="sign-up" component={SignUp} />
          <Stack.Screen name="credit" component={Credit} />
          <Stack.Screen name="sign-out" component={SignOut} />
          <Stack.Screen name="reset-password" component={ResetPassword} />
          <Stack.Screen name="main" component={Main} options={{headerLeft: () => null}}/> 
      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
  );
}

/* เพิ่ม option ไม่งั้น พอloginเสร็จมันจะมีปุ่มถอยกลับ*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
