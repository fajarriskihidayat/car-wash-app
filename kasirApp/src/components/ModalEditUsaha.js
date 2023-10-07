import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userAPI from '../apis/userAPI';

import colors from '../configs/colors';

const ModalEditUsaha = props => {
  const id = props.id;
  const {replace, navigate} = useNavigation();
  const [user, setUser] = useState({});
  const [newProfile, setNewProfile] = useState({
    passwordLama: '',
    passwordBaru: '',
    confirmPassword: '',
  });

  console.log('usaha', user);

  const getUser = async () => {
    try {
      const nib = await AsyncStorage.getItem('nib');
      const {data} = await userAPI.get(`/${nib}`);
      setUser(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const resetData = async () => {
    try {
      const password = await AsyncStorage.getItem('password');
      const res = await userAPI.put('/', {
        nib: user.nib,
        nama: user.nama,
        nama_usaha: user.nama_usaha,
        harga_mobil: user.harga_mobil,
        harga_motor: user.harga_motor,
        password: password,
        passwordBaru: password,
      });

      if (res.request.status === 200) {
        ToastAndroid.show('Data berhasil diubah', ToastAndroid.SHORT);
        replace('Homepage');
      }
    } catch (err) {
      console.log(err.message);
      ToastAndroid.show('Edit Data Gagal !', ToastAndroid.SHORT);
    }
  };

  const dataCheck = async () => {
    if (
      !user.nama ||
      !user.nama_usaha ||
      !user.harga_mobil ||
      !user.harga_motor
    ) {
      ToastAndroid.show('Data masih kosong', ToastAndroid.SHORT);
    } else {
      await resetData();
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  closeModal = bool => {
    props.changeModalVisible(bool);
  };

  return (
    <View style={styles.centeredView}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Edit Data Usaha</Text>
          <View style={styles.containerInput}>
            <Text style={styles.textInput}>Nama Pemilik Usaha</Text>
            <TextInput
              placeholder="Masukan Nama"
              placeholderTextColor={colors.secondary}
              onChangeText={nama => setUser({...user, nama: nama})}
              value={user.nama}
              style={styles.input}
            />
            <Text style={styles.textInput}>Nama Usaha</Text>
            <TextInput
              placeholder="Masukan Nama"
              placeholderTextColor={colors.secondary}
              onChangeText={nama_usaha =>
                setUser({...user, nama_usaha: nama_usaha})
              }
              value={user.nama_usaha}
              style={styles.input}
            />
            <Text style={styles.textInput}>Harga Cuci Mobil</Text>
            <TextInput
              keyboardType="numeric"
              placeholder="Masukan Harga"
              placeholderTextColor={colors.secondary}
              onChangeText={mobil => setUser({...user, harga_mobil: mobil})}
              value={`${user.harga_mobil}`}
              style={styles.input}
            />
            <Text style={styles.textInput}>Harga Cuci Motor</Text>
            <TextInput
              keyboardType="numeric"
              placeholder="Masukan Harga"
              placeholderTextColor={colors.secondary}
              onChangeText={motor => setUser({...user, harga_motor: motor})}
              value={`${user.harga_motor}`}
              style={styles.input}
            />
          </View>
          <View style={styles.conBtn}>
            <TouchableOpacity style={styles.button} onPress={dataCheck}>
              <Text style={styles.textBtn}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: colors.danger}]}
              onPress={() => closeModal(false)}>
              <Text style={styles.textBtn}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
  },
  containerInput: {
    width: 250,
    marginBottom: 8,
  },
  textInput: {
    color: colors.primary,
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.primary,
    marginVertical: 4,
    padding: 10,
    borderRadius: 8,
    color: colors.dark,
  },
  conBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: 250,
  },
  button: {
    // margin: 20,
    marginLeft: 4,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
  },
  textBtn: {
    fontWeight: 'bold',
    color: colors.light,
    fontSize: 16,
  },
});

export default ModalEditUsaha;
