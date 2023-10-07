import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import userAPI from '../apis/userAPI';
import ModalEditPassword from '../components/ModalEditPassword';

import colors from '../configs/colors';
import ModalEditUsaha from '../components/ModalEditUsaha';

const Account = () => {
  const {replace, navigate} = useNavigation();
  const [user, setUser] = useState({});
  const [id, setId] = useState('');
  const [modalEditPw, setModalEditPw] = useState(false);
  const [modalEditData, setModalEditData] = useState(false);

  const changeModalEditPw = bool => {
    setModalEditPw(bool);
  };

  const changeModalEditData = bool => {
    setModalEditData(bool);
  };

  const getData = async () => {
    try {
      const nib = await AsyncStorage.getItem('nib');
      const {data} = await userAPI.get(`/${nib}`);
      setUser(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    replace('Login');
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={{uri: 'https://reqres.in/img/faces/1-image.jpg'}}
        style={styles.img}
      />
      <Text style={styles.nama}>{user.nama_usaha}</Text>
      <Text>
        <Text style={{fontWeight: 'bold'}}>Owner :</Text> {user.nama} (
        {user.nib})
      </Text>
      <View style={styles.line} />
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          changeModalEditData(true);
          setId(user.id);
        }}>
        <Text style={styles.btnText}>Edit Data Usaha</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          changeModalEditPw(true);
          setId(user.id);
        }}>
        <Text style={styles.btnText}>Edit Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => handleLogout()}>
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEditPw}
        onRequestClose={() => {
          changeModalEditPw(false);
        }}>
        <ModalEditPassword changeModalVisible={changeModalEditPw} id={id} />
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEditData}
        onRequestClose={() => {
          changeModalEditData(false);
        }}>
        <ModalEditUsaha changeModalVisible={changeModalEditData} id={id} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  img: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  nama: {
    fontSize: 24,
    color: colors.dark,
    fontWeight: 'bold',
    marginTop: 16,
  },
  line: {
    width: '90%',
    height: 3,
    backgroundColor: colors.primary,
    marginVertical: 20,
    borderRadius: 50,
  },
  btn: {
    backgroundColor: colors.primary,
    padding: 16,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 8,
  },
  btnText: {
    color: colors.light,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Account;
