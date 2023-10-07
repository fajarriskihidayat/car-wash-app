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
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import transportAPI from '../apis/transportAPI';
import moment from 'moment';
import 'moment/locale/id';

import colors from '../configs/colors';

const ModalAddList = props => {
  const {replace} = useNavigation();

  // state antrian
  const lastNo = useRef(1);
  const [nowDate, setNowDate] = useState(new Date().getDate());
  const [data, setData] = useState([]);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [tanggal, setTanggal] = useState('');
  const [jam, setJam] = useState('');
  const [nama, setNama] = useState('');

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Mobil', value: 'Mobil'},
    {label: 'Motor', value: 'Motor'},
  ]);

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

    let tempDate = new Date(currentDate);

    if (mode === 'date') {
      let fDate =
        tempDate.getFullYear() +
        '-' +
        (tempDate.getMonth() + 1) +
        '-' +
        tempDate.getDate();
      setTanggal(new Date(fDate));
    } else {
      let fTime = tempDate.getHours() + ':' + tempDate.getMinutes();
      setJam(fTime);
    }
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  closeModal = bool => {
    props.changeModalVisible(bool);
  };

  // GET DATA
  const getData = async () => {
    const nib = await AsyncStorage.getItem('nib');

    const {data} = await transportAPI.get(`/all/${nib}`);
    setData(data.data);
  };

  // TAMBAH DATA
  const addList = async () => {
    nomorAntrian();
    try {
      // if (new Date(tanggal).getDate() != nowDate) {
      //   ToastAndroid.show(
      //     'Tambah data dengan tanggal hari ini',
      //     ToastAndroid.SHORT,
      //   );
      //   return;
      // }

      // kalau mau tampilin input tanggal baris 105-112 dihapus
      // trus baris 96-102 dibuka komennya
      // dan baris 121 tanggal diubah dari new Date(fDate) jadi tanggal
      let tempDate = new Date();

      let fDate =
        tempDate.getFullYear() +
        '-' +
        (tempDate.getMonth() + 1) +
        '-' +
        tempDate.getDate();

      const nib = await AsyncStorage.getItem('nib');
      const res = await transportAPI.post('/', {
        user_nib: nib,
        nama_pemilik: nama,
        jenis: value,
        tanggal: new Date(fDate),
        waktu: jam,
        antrian: lastNo.current,
      });

      if (res.request.status === 200) {
        ToastAndroid.show('Data berhasil diinput', ToastAndroid.SHORT);
        replace('Homepage');
      }
    } catch (e) {
      console.log(e);
      ToastAndroid.show('Gagal tambah list !', ToastAndroid.SHORT);
    }
  };

  // NO ANTRIAN
  const nomorAntrian = async () => {
    const noTerakhir =
      data.length !== 0 ? data[data.length - 1].antrian + 1 : 1;
    const newDate = new Date().getDate();
    if (newDate !== nowDate) {
      lastNo.current = 1;
      setNowDate(newDate);
    } else {
      lastNo.current = noTerakhir;
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.centeredView}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Input Data</Text>
          <View style={styles.containerInput}>
            <Text style={styles.textInput}>Nama Pemilik</Text>
            <TextInput
              placeholder="Masukan Nama"
              placeholderTextColor={colors.secondary}
              onChangeText={value => setNama(value)}
              style={styles.input}
            />
            <Text style={styles.textInput}>Kendaraan</Text>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              style={{borderColor: colors.primary}}
              dropDownContainerStyle={{borderColor: colors.primary}}
              placeholder="Pilih kendaraan"
              placeholderStyle={{color: colors.secondary}}
            />
            {/* <Text style={styles.textInput}>Tanggal</Text>
            <View>
              <TextInput
                placeholder="Masukan Tanggal"
                placeholderTextColor={colors.secondary}
                caretHidden={true}
                showSoftInputOnFocus={false}
                value={tanggal && moment(tanggal).format('LL')}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => showMode('date')}>
                <Icon
                  style={styles.icon}
                  name="date-range"
                  color={colors.primary}
                  size={28}
                />
              </TouchableOpacity>
            </View> */}
            <Text style={styles.textInput}>Waktu</Text>
            <View>
              <TextInput
                placeholder="Masukan Waktu"
                placeholderTextColor={colors.secondary}
                caretHidden={true}
                showSoftInputOnFocus={false}
                value={jam && moment(jam, 'HH:mm:ss').format('HH:mm')}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => showMode('time')}>
                <Icon
                  style={styles.icon}
                  name="access-time"
                  color={colors.primary}
                  size={28}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.conBtn}>
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                if (!nama || !jam || !value) {
                  ToastAndroid.show('Data masih kosong', ToastAndroid.SHORT);
                } else {
                  await addList();
                }
              }}>
              <Text style={styles.textBtn}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: colors.danger}]}
              onPress={() => closeModal(false)}>
              <Text style={styles.textBtn}>Cancel</Text>
            </TouchableOpacity>
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
    marginBottom: 20,
  },
  containerInput: {
    width: 250,
    marginBottom: 8,
  },
  icon: {
    left: 210,
    top: -45,
    position: 'absolute',
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

export default ModalAddList;
