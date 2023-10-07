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

const Register = () => {
  const {replace} = useNavigation();
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const [register, setRegister] = useState({
    nib: '',
    nama: '',
    nama_usaha: '',
    harga_mobil: '',
    harga_motor: '',
    password: '',
  });

  const handleRegister = async () => {
    console.log('value', register);
    try {
      const res = await userAPI.post('/', {
        nib: register.nib,
        nama: register.nama,
        nama_usaha: register.nama_usaha,
        harga_mobil: register.harga_mobil,
        harga_motor: register.harga_motor,
        password: register.password,
      });
      console.log('res', res.data);
      if (res.request.status === 200) {
        ToastAndroid.show('Register berhasil', ToastAndroid.SHORT);
        replace('Login');
      }
    } catch (e) {
      console.log(e);
      ToastAndroid.show('Create user failed !', ToastAndroid.SHORT);
    }
  };

  const dataCheck = async () => {
    if (
      !register.nib ||
      !register.nama ||
      !register.nama_usaha ||
      !register.harga_motor ||
      !register.harga_mobil ||
      !register.password
    ) {
      ToastAndroid.show('Data masih kosong', ToastAndroid.SHORT);
    } else {
      await handleRegister();
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
        <Text style={styles.title}>Register</Text>
        <View style={styles.containerInput}>
          <Text style={styles.textInput}>NIB</Text>
          <TextInput
            placeholder="Masukkan NIB"
            placeholderTextColor={colors.secondary}
            onChangeText={nib => setRegister({...register, nib: nib})}
            style={styles.input}
          />
        </View>
        <View style={styles.containerInput}>
          <Text style={styles.textInput}>Nama</Text>
          <TextInput
            placeholder="Masukkan Nama"
            placeholderTextColor={colors.secondary}
            onChangeText={nama => setRegister({...register, nama: nama})}
            style={styles.input}
          />
        </View>
        <View style={styles.containerInput}>
          <Text style={styles.textInput}>Nama Usaha</Text>
          <TextInput
            placeholder="Masukkan Nama Usaha"
            placeholderTextColor={colors.secondary}
            onChangeText={nama_usaha =>
              setRegister({...register, nama_usaha: nama_usaha})
            }
            style={styles.input}
          />
        </View>
        <View style={styles.containerInput}>
          <Text style={styles.textInput}>Harga Cuci Mobil</Text>
          <TextInput
            keyboardType="numeric"
            placeholder="Masukkan Harga"
            placeholderTextColor={colors.secondary}
            onChangeText={harga_mobil =>
              setRegister({...register, harga_mobil: harga_mobil})
            }
            style={styles.input}
          />
        </View>
        <View style={styles.containerInput}>
          <Text style={styles.textInput}>Harga Cuci Motor</Text>
          <TextInput
            keyboardType="numeric"
            placeholder="Masukkan Harga"
            placeholderTextColor={colors.secondary}
            onChangeText={harga_motor =>
              setRegister({...register, harga_motor: harga_motor})
            }
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
              onChangeText={pwd => setRegister({...register, password: pwd})}
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
        <TouchableOpacity style={styles.button} onPress={dataCheck}>
          <Text style={styles.textBtn}>Register</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', marginTop: 8}}>
          <Text style={{color: colors.dark}}>Sudah punya akun ?</Text>
          <TouchableOpacity
            style={{marginHorizontal: 4, marginTop: -2}}
            onPress={() => replace('Login')}>
            <Text style={styles.navigate}>Login</Text>
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
    paddingVertical: 20,
  },
  img: {
    width: 100,
    height: 100,
    // marginTop: -10,
    marginVertical: 20,
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

export default Register;
