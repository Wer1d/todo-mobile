import React from 'react';
import { View, Text, TextInput,StyleSheet , Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';  
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

export default function SignUp() {
  
  const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [hide, setHide] = useState(true);

  const signUp = () => {
    axios.post('https://7b19-49-228-96-103.ngrok-free.app/Users', 
      { username: username, password: password },
    )
      .then(async (response) => {
                
        Alert.alert('register successful', '', [{ text: 'OK', onPress: () => {
          setUsername(''); // Clearing username
          setPassword(''); // Clearing password
          navigation.navigate('SignIn');
        }}]);
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

  return (
    <View style={styles.container}>
              <TextInput
                style={styles.input}
                placeholder="new Username"
                value={username}
                onChangeText={setUsername}
              />
              <TextInput
                style={styles.input}
                placeholder="new Password"
                secureTextEntry={hide}
                value={password}
                onChangeText={setPassword}
              />
              <Button mode='elevated' style={styles.button} onPress={() => navigation.navigate('SignIn')}>
                <Text>ยกเลิก</Text>
              </Button>


              <Button mode='elevated' style={styles.button} onPress={signUp}>
                <Text>สมัคร</Text>
              </Button>
              <StatusBar style="auto" />
            </View>


  );
    
  
}

