import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignOut() {
  const navigation = useNavigation();

  useEffect(() => {
    const signOut = async () => {
      try {
        await AsyncStorage.removeItem("token");
        console.log("Token cleared:");
      } catch (error) {
        console.log("Failed to clear token:", error);
      }
      // Navigate to the 'SignIn' screen after token is cleared
      navigation.navigate('SignIn');
    };

    signOut();
  }, []); // Added dependency array to prevent unnecessary re-renders

  return (
    <View>
      {/* You can add a loading spinner or a message here if you like */}
    </View>
  );
}
