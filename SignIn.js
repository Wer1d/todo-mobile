import { View, Text, Alert } from "react-native"
import { StyleSheet } from "react-native";
import { TextInput } from "react-native";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-paper';

export default function SignIn() {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [hide, setHide] = useState(true);
    const togglePasswordVisibility = () => {
        setHide(!hide);
    };
    const storeCookie = async (token) => {
      try {
        console.log("Storing token in AsyncStorage");
        console.log(token);
        await AsyncStorage.setItem('token', token);
        
      } catch (error) {
        console.log('Failed to store token:', error);
      }
    };  
    const signIn = () => {
      axios.post('https://4a49-161-200-191-29.ngrok-free.app/Tokens', 
        { username: username, password: password },
        { headers: { /* Authorization: 'Bearer ' + token */ }, timeout: 10 * 1000 }
      )
        .then(async (response) => {
          console.log("hi")
          const token = response.data.token;
          console.log(token);
          console.log(response.data);
          await storeCookie(token);
                  
          Alert.alert('Login successful');
          // setUsername('');
          // setPassword('');
          navigation.navigate('main');
        })
        .catch((error) => {
          if (error.code === 'ERR_NETWORK') {
            Alert.alert('server is down');
          } else if (error.code === 'ERR_BAD_REQUEST'){
            Alert.alert('Invalid username or password');
          }else {
            // Something happened in setting up the request that triggered an error
            Alert.alert(error.code);
          }
        });
    };
    

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'stretch',
        },
        input: {
          borderWidth : 1,
          padding: 10,
          marginBottom: 10,
          marginTop: 10,
          marginLeft: 20,
          marginRight: 20,
        },
        button: {
          alignItems: 'center',
          backgroundColor: '#DDDDDD',
          padding: 10,
          marginBottom: 10,
          marginTop: 10,
          marginLeft: 20,
          marginRight: 20,
        },
      });
    

    const handleForgotPassword = () => {
        navigation.navigate('reset-password');
    };
    const handleSignUp = () => {
        navigation.navigate('sign-up');
    };
    return (
        
            <View style={styles.container}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={hide}
                value={password}
                onChangeText={setPassword}
              />
              <Button mode='elevated' style={styles.button} onPress={signIn}>
                <Text>เข้าสู่ระบบ</Text>
              </Button>

              <Button mode='elevated' style={styles.button} onPress={() => navigation.navigate('reset-password')}>
                <Text>Forgot Password</Text>
              </Button>

              <Button mode='elevated' style={styles.button} onPress={handleSignUp}>
                <Text>Sign Up</Text>
              </Button>
              <StatusBar style="auto" />
            </View>
    )
}
        
        