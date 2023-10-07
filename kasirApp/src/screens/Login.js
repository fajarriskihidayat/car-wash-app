import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import userAPI from '../apis/userAPI';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import colors from '../configs/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const {replace} = useNavigation();
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const [user, setUser] = useState({
    nib: '',
    password: '',
  });

  const handleLogin = async () => {
    try {
      const res = await userAPI.post('/login', {
        nib: user.nib,
        password: user.password,
      });

      if (res.request.status === 200) {
        ToastAndroid.show('Login berhasil', ToastAndroid.SHORT);
        await AsyncStorage.setItem('nib', user.nib);
        await AsyncStorage.setItem('password', user.password);
        await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
        replace('Homepage');
      }
    } catch (e) {
      console.log(e);
      ToastAndroid.show('NIB atau Password tidak sesuai !', ToastAndroid.SHORT);
    }
  };

  return (
    <ScrollView style={{backgroundColor: colors.black}}>
      <View style={styles.container}>
        <Image
          source={{
            uri: 'https://img.pikbest.com/png-images/20210313/blue-car-wash-clipart_6276191.png!w700wp',
          }}
          style={styles.img}
        />
        <Text style={styles.title}>Login</Text>
        <View style={styles.containerInput}>
          <Text style={styles.textInput}>NIB</Text>
          <TextInput
            placeholder="Masukkan NIB"
            placeholderTextColor={colors.secondary}
            onChangeText={nib => setUser({...user, nib: nib})}
            style={styles.input}
          />
        </View>
        <View style={styles.containerInput}>
          <Text style={styles.textInput}>Password </Text>
          <View>
            <TextInput
              placeholder="Masukkan Password"
              placeholderTextColor={colors.secondary}
              secureTextEntry={secureTextEntry}
              onChangeText={pwd => setUser({...user, password: pwd})}
              style={styles.input}
            />
            <TouchableOpacity onPress={() => showMode('date')}>
              <Icon
                style={styles.icon}
                name={secureTextEntry ? 'md-eye-off-outline' : 'md-eye-outline'}
                color={colors.primary}
                size={28}
                onPress={toggleSecureEntry}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            if (!user.nib || !user.password) {
              ToastAndroid.show('Data masih kosong', ToastAndroid.SHORT);
            } else {
              await handleLogin();
            }
          }}>
          <Text style={styles.textBtn}>Login</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', marginTop: 8}}>
          <Text style={{color: colors.dark}}>Belum punya akun ?</Text>
          <TouchableOpacity
            style={{marginHorizontal: 4, marginTop: -2}}
            onPress={() => replace('Register')}>
            <Text style={styles.navigate}>Daftar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  img: {
    width: 200,
    height: 200,
    // marginTop: -10,
    marginTop: 60,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    marginTop: -20,
  },
  containerInput: {
    width: '100%',
    marginBottom: 8,
  },
  textInput: {
    color: colors.primary,
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
  icon: {
    left: '85%',
    top: -45,
    position: 'absolute',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.primary,
    marginVertical: 4,
    padding: 12,
    borderRadius: 8,
    color: colors.dark,
  },
  button: {
    margin: 20,
    padding: 14,
    borderRadius: 8,
    backgroundColor: colors.primary,
    width: '100%',
    alignItems: 'center',
  },
  textBtn: {
    fontWeight: 'bold',
    color: colors.light,
    fontSize: 18,
  },
  navigate: {
    color: colors.primary,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Login;
