import {View, StyleSheet, Image, Text} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../configs/colors';

const SplashScreen = () => {
  const {replace} = useNavigation();

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('nib');
      value === null
        ? setTimeout(() => {
            replace('Login');
          }, 3000)
        : setTimeout(() => {
            replace('Homepage');
          }, 3000);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://img.pikbest.com/png-images/20210313/blue-car-wash-clipart_6276191.png!w700wp',
        }}
        style={styles.logo}
      />
      <Text style={styles.text}>Kasir App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  text: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
