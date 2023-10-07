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
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userAPI from '../apis/userAPI';

import colors from '../configs/colors';

const ModalEditPassword = props => {
  const id = props.id;
  const {replace, navigate} = useNavigation();
  const [user, setUser] = useState({
    nib: '',
    nama: '',
    password: '',
  });
  const [newProfile, setNewProfile] = useState({
    passwordLama: '',
    passwordBaru: '',
    confirmPassword: '',
  });

  // state securetextentry
  const [secureTextOld, setSecureTextOld] = useState(true);
  const [secureTextNew, setSecureTextNew] = useState(true);
  const [secureTextConfirm, setSecureTextConfirm] = useState(true);

  const toggleSecureOld = () => {
    setSecureTextOld(!secureTextOld);
  };

  const toggleSecureNew = () => {
    setSecureTextNew(!secureTextNew);
  };

  const toggleSecureConfirm = () => {
    setSecureTextConfirm(!secureTextConfirm);
  };

  const getUser = async () => {
    try {
      const password = await AsyncStorage.getItem('password');
      const user = await AsyncStorage.getItem('user');
      const data = JSON.parse(user);
      if (data) {
        // setUser(JSON.parse(data));
        setUser({
          nib: data.nib,
          nama: data.nama,
          password: password,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const resetPassword = async value => {
    try {
      const res = await userAPI.put('/', {
        nib: value.nib,
        password: value.passwordLama,
        passwordBaru: value.passwordBaru,
      });

      if (res.request.status === 200) {
        ToastAndroid.show('Password berhasil diubah !', ToastAndroid.SHORT);
        console.log('status', res.request.status);
        replace('Homepage');
        setNewProfile({
          passwordLama: '',
          passwordBaru: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      console.log(err.message);
      ToastAndroid.show('Edit Password Gagal !', ToastAndroid.SHORT);
    }
  };

  const handleEdit = () => {
    if (
      newProfile.passwordLama == '' ||
      newProfile.passwordBaru == '' ||
      newProfile.confirmPassword == ''
    ) {
      ToastAndroid.show('Data masih kosong', ToastAndroid.SHORT);
    } else if (newProfile.passwordLama !== user.password) {
      ToastAndroid.show('Password salah !', ToastAndroid.SHORT);
    } else if (newProfile.passwordBaru !== newProfile.confirmPassword) {
      ToastAndroid.show(
        'Password Baru dan Confirm Password tidak sesuai !',
        ToastAndroid.SHORT,
      );
    } else {
      resetPassword({
        nib: user.nib,
        passwordLama: newProfile.passwordLama,
        passwordBaru: newProfile.passwordBaru,
      });
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
          <Text style={styles.title}>Edit Password</Text>
          <View style={styles.containerInput}>
            <Text style={styles.textInput}>Password Lama</Text>
            <View>
              <TextInput
                placeholder="Masukan Password"
                placeholderTextColor={colors.secondary}
                onChangeText={password =>
                  setNewProfile({...newProfile, passwordLama: password})
                }
                value={newProfile.passwordLama}
                secureTextEntry={secureTextOld}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => showMode('date')}>
                <Icon
                  style={styles.icon}
                  name={secureTextOld ? 'md-eye-off-outline' : 'md-eye-outline'}
                  color={colors.primary}
                  size={28}
                  onPress={toggleSecureOld}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.textInput}>Password Baru</Text>
            <View>
              <TextInput
                placeholder="Masukan Password"
                placeholderTextColor={colors.secondary}
                onChangeText={password =>
                  setNewProfile({...newProfile, passwordBaru: password})
                }
                value={newProfile.passwordBaru}
                secureTextEntry={secureTextNew}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => showMode('date')}>
                <Icon
                  style={styles.icon}
                  name={secureTextNew ? 'md-eye-off-outline' : 'md-eye-outline'}
                  color={colors.primary}
                  size={28}
                  onPress={toggleSecureNew}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.textInput}>Konfirmasi Password</Text>
            <View>
              <TextInput
                placeholder="Masukan Password"
                placeholderTextColor={colors.secondary}
                onChangeText={confirmPwd =>
                  setNewProfile({...newProfile, confirmPassword: confirmPwd})
                }
                value={newProfile.confirmPassword}
                secureTextEntry={secureTextConfirm}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => showMode('date')}>
                <Icon
                  style={styles.icon}
                  name={
                    secureTextConfirm ? 'md-eye-off-outline' : 'md-eye-outline'
                  }
                  color={colors.primary}
                  size={28}
                  onPress={toggleSecureConfirm}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.conBtn}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleEdit()}>
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
  icon: {
    left: 210,
    top: -45,
    position: 'absolute',
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

export default ModalEditPassword;
