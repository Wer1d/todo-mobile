import React from 'react';
import { View, Text } from 'react-native';
export default function SignOut() {
  const [cookies, removeCookie] = useCookies(['token']);
  const navigation = useNavigation();
  useEffect(() => {
    removeCookie('token');
    // Navigate to the 'sign-in' screen without passing username and password parameters
    navigation.navigate('sign-in');
  }, [removeCookie, navigation]);
  return (
    <View>
    </View>
  );
}