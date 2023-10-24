import { View, Text, Alert } from "react-native"
import { StyleSheet } from "react-native";
import { TextInput } from "react-native";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

export default function ResetPassword() {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');  
    
    const resetPassword = () => {
      if (password !== confirmPassword) {
        Alert.alert("Passwords don't match");
        setPassword('');
        setConfirmPassword('');
        return;
      }
      axios.get('http://192.168.1.134:5180/Users')
      .then((response) => {
        const data = response.data;
        const resultUser = data.filter(user => user.username === username);
        console.log(resultUser  )
        if (resultUser.length === 0) {
            alert("User doesn't exist");
        }
        const userId = resultUser.map(user => user.id);
        axios.put('http://192.168.1.134:5180/Users/'+userId,
        {username: username, password: password},
        ).then((response) => {

          navigation.navigate('main');

         }).catch((error) => {

          if (error.code === 'ECONNABORTED') {
            Alert.alert('Request timeout');
          } else if (error.code === 'ERR_BAD_REQUEST'){
            Alert.alert('Invalid username or password');
          }else {
            // Something happened in setting up the request that triggered an error
            Alert.alert(error.code);
          }
        })
      }).catch((error) => {
          Alert.alert("Error Fetching Data");
      });
    
    };
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        input: {
          width: '80%',
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
        },
      });
  
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
                value={password}
                onChangeText={setPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="confirm password"
                
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity style={styles.button} onPress={resetPassword}>
                <Text>submit</Text>
              </TouchableOpacity>

      

              
              <StatusBar style="auto" />
            </View>
    );
        
}