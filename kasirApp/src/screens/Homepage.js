import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Alert,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import transportAPI from '../apis/transportAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import 'moment/locale/id';

import colors from '../configs/colors';
import statusList from '../configs/statusList';

import ModalEditList from '../components/ModalEditList';
import ModalDetailList from '../components/ModalDetailList';

const Homepage = ({navigation}) => {
  const [lists, setLists] = useState([]);
  const [users, setUsers] = useState({});
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState('');
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  // state modal
  const [id, setId] = useState('');
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDetail, setModalDetail] = useState(false);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (e, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    if (e.type === 'dismissed') {
      if (mode === 'date') {
        setTanggal('');
      } else {
        setJam('');
      }
      return;
    }

    // data baru
    let tempDate = new Date(currentDate);

    if (mode === 'date') {
      let fDate =
        tempDate.getFullYear() +
        '-' +
        (tempDate.getMonth() + 1) +
        '-' +
        tempDate.getDate();
      // setTanggal(fDate);
      setSearch(fDate);
    }
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const changeModalEdit = bool => {
    setModalEdit(bool);
  };

  const changeModalDetail = bool => {
    setModalDetail(bool);
  };

  // GET DATA
  const getList = async () => {
    try {
      const nib = await AsyncStorage.getItem('nib');
      const user = await AsyncStorage.getItem('user');
      const getUser = JSON.parse(user);

      const {data} = await transportAPI.get(`/all/${nib}`);
      setLists(data.data);
      setUsers(getUser);
      totalUang(lists);
      setSearch('');
    } catch (e) {
      console.log(e);
    }
  };

  // SEARCH
  const searchList = async () => {
    try {
      const nib = await AsyncStorage.getItem('nib');
      const {data} = await transportAPI.get(
        `/search?nib=${nib}&tanggal=${search}`,
      );
      setLists(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  // DELETE
  const deleteList = async id => {
    try {
      const res = await transportAPI.delete(`/${id}`);
      if (res.request.status === 200) {
        ToastAndroid.show(res.data.metadata, ToastAndroid.SHORT);
        getList();
      }
    } catch (e) {
      console.log(e);
      ToastAndroid.show('Delete list gagal !', ToastAndroid.SHORT);
    }
  };

  const alertDelete = id => {
    Alert.alert(
      'Delete List',
      'Apakah ingin menghapus data?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {text: 'OK', onPress: async () => await deleteList(id)},
      ],
      {
        cancelable: true,
      },
    );
  };

  // TOTAL PENDAPATAN
  const totalUang = async () => {
    let jumlah = 0;
    const mobil = users.harga_mobil;
    const motor = users.harga_motor;

    // while (!mobil || !motor) {
    //   await new Promise(resolve => setTimeout(resolve, 100));
    // }

    lists.map(data => {
      return data.jenis === 'Mobil' ? (jumlah += mobil) : (jumlah += motor);
    });

    setTotal(jumlah);
  };

  useEffect(() => {
    Promise.all([getList()]).then(() => setLoading(false));
  }, []);

  useEffect(() => {
    totalUang();
  }, [getList]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.top}>
        <View>
          <Text style={styles.textName}>Welcome, {users.nama}</Text>
          <Text style={{fontStyle: 'italic'}}>{users.nama_usaha}</Text>
        </View>
        <Image
          source={{uri: 'https://reqres.in/img/faces/1-image.jpg'}}
          style={styles.img}
        />
      </View>
      <View style={styles.search}>
        <TextInput
          style={styles.inputSearch}
          placeholder="Search..."
          caretHidden={true}
          showSoftInputOnFocus={false}
          onChangeText={value => setSearch(value)}
          value={search && moment(new Date(search)).format('DD MMMM YYYY')}
        />
        <TouchableOpacity onPress={() => showMode('date')}>
          <Icon
            style={styles.icon}
            name="date-range"
            color={colors.primary}
            size={32}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnSearch}
          onPress={searchList}
          disabled={!search && true}>
          <Text style={styles.btnText}>Search</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.conTotal}>
        <Text style={{fontWeight: 'bold', color: colors.light, fontSize: 16}}>
          Total Pendapatan :{' '}
        </Text>
        <Text style={{color: colors.light, fontSize: 20}}>
          Rp. {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
        </Text>
      </View>
      <View style={styles.top}>
        <Text style={styles.title}>Data Pelanggan</Text>
        <TouchableOpacity style={styles.btnSearch} onPress={() => getList()}>
          <Icon name="refresh" size={20} color={colors.light} />
          <Text style={styles.btnText}>Data Hari Ini</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        {statusList.map((data, i) => (
          <TouchableOpacity onPress={() => setActive(i)} key={data.id}>
            <Text
              style={[
                styles.textStatus,
                active === i && {color: colors.primary},
              ]}>
              {data.status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{flex: 1, paddingBottom: 20}}>
        {active == 0
          ? lists.map(
              (item, i) =>
                item.status === 'Belum Selesai' && (
                  <TouchableOpacity
                    style={styles.list}
                    key={i}
                    onPress={() => {
                      changeModalDetail(true);
                      setId(item.id);
                    }}>
                    <View style={{width: '70%', flexDirection: 'row'}}>
                      <View style={styles.antrian}>
                        <Text style={styles.textAntrian}>{item.antrian}</Text>
                      </View>
                      <View style={{marginLeft: 8}}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.listName}>
                            {moment(item.tanggal).format('LL')}{' '}
                          </Text>
                          <Text style={styles.listName}>
                            {moment(item.waktu, 'HH:mm:ss').format('HH:mm')}
                          </Text>
                        </View>
                        <Text style={styles.listStatus}>
                          <Text style={{fontWeight: 'bold'}}>
                            Nama Pemilik :
                          </Text>{' '}
                          {item.nama_pemilik}
                        </Text>
                        <Text style={styles.listStatus} numberOfLines={1}>
                          <Text style={{fontWeight: 'bold'}}>Kendaraan :</Text>{' '}
                          {item.jenis}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.button}>
                      <TouchableOpacity
                        style={{
                          ...styles.btnList,
                          backgroundColor: colors.info,
                        }}
                        onPress={() => {
                          changeModalEdit(true);
                          setId(item.id);
                        }}>
                        <Icon name="mode-edit" color={colors.light} size={16} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          ...styles.btnList,
                          backgroundColor: colors.danger,
                        }}
                        onPress={() => alertDelete(item.id)}>
                        <Icon name="delete" color={colors.light} size={16} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ),
            )
          : lists.map(
              (item, i) =>
                item.status === 'Selesai' && (
                  <TouchableOpacity
                    style={styles.list}
                    key={i}
                    onPress={() => {
                      changeModalDetail(true);
                      setId(item.id);
                    }}>
                    <View style={{width: '70%', flexDirection: 'row'}}>
                      <View style={styles.antrian}>
                        <Text style={styles.textAntrian}>{item.antrian}</Text>
                      </View>
                      <View style={{marginLeft: 8}}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.listName}>
                            {moment(item.tanggal).format('LL')}{' '}
                          </Text>
                          <Text style={styles.listName}>
                            {moment(item.waktu, 'HH:mm:ss').format('HH:mm')}
                          </Text>
                        </View>
                        <Text style={styles.listStatus}>
                          <Text style={{fontWeight: 'bold'}}>
                            Nama Pemilik :
                          </Text>{' '}
                          {item.nama_pemilik}
                        </Text>
                        <Text style={styles.listStatus} numberOfLines={1}>
                          <Text style={{fontWeight: 'bold'}}>Kendaraan :</Text>{' '}
                          {item.jenis}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.button}>
                      <TouchableOpacity
                        style={{
                          ...styles.btnList,
                          backgroundColor: colors.info,
                        }}
                        onPress={() => {
                          changeModalEdit(true);
                          setId(item.id);
                        }}>
                        <Icon name="mode-edit" color={colors.light} size={16} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          ...styles.btnList,
                          backgroundColor: colors.danger,
                        }}
                        onPress={() => alertDelete(item.id)}>
                        <Icon name="delete" color={colors.light} size={16} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ),
            )}
      </View>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEdit}
        onRequestClose={() => {
          changeModalEdit(false);
        }}>
        <ModalEditList changeModalVisible={changeModalEdit} id={id} />
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalDetail}
        onRequestClose={() => {
          changeModalDetail(false);
        }}>
        <ModalDetailList changeModalVisible={changeModalDetail} id={id} />
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  img: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  textName: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
  search: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  inputSearch: {
    color: colors.dark,
    borderRadius: 4,
    paddingHorizontal: 20,
    fontSize: 16,
    height: 44,
    borderWidth: 1,
    borderColor: colors.primary,
    width: '77%',
  },
  btnSearch: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  btnText: {
    color: colors.light,
    fontSize: 16,
  },
  icon: {
    left: -40,
    top: 4,
    position: 'absolute',
  },
  conTotal: {
    backgroundColor: colors.success,
    padding: 12,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  textStatus: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  list: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  antrian: {
    padding: 8,
    backgroundColor: colors.success,
    width: '18%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  textAntrian: {
    color: colors.light,
    fontWeight: 'bold',
    fontSize: 16,
  },
  listName: {
    color: colors.light,
    fontSize: 16,
    fontWeight: 'bold',
  },
  listStatus: {
    color: colors.light,
  },
  listActivity: {
    color: colors.light,
    fontStyle: 'italic',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnList: {
    padding: 8,
    borderRadius: 4,
    marginLeft: 4,
  },
});

export default Homepage;
