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
import DateTimePicker from '@react-native-community/datetimepicker';
import {useNavigation} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import transportAPI from '../apis/transportAPI';
import moment from 'moment';
import 'moment/locale/id';

import colors from '../configs/colors';

const ModalEditList = props => {
  const id = props.id;
  const {replace} = useNavigation();
  const [nowDate, setNewDate] = useState(new Date().getDate());

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [data, setData] = useState({});

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
        setTanggal(data.tanggal);
      } else {
        setJam(data.waktu);
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
      setData({...data, tanggal: new Date(fDate)});
    } else {
      let fTime = tempDate.getHours() + ':' + tempDate.getMinutes();
      // setJam(fTime);
      setData({...data, waktu: fTime});
    }
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const getList = async () => {
    try {
      const {data} = await transportAPI.get(`/details/${id}`);
      setData(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const editList = async () => {
    // if (new Date(data.tanggal).getDate() != nowDate) {
    //   ToastAndroid.show(
    //     'Edit data dengan tanggal hari ini',
    //     ToastAndroid.SHORT,
    //   );
    //   return;
    // }

    // kalau mau tampilin input baris 87-93 dibuka komennya
    // dan baris 113 dibuka komennya

    try {
      const res = await transportAPI.put('/', {
        id: id,
        nama_pemilik: data.nama_pemilik,
        jenis: value,
        // tanggal: data.tanggal,
        waktu: data.waktu,
      });

      if (res.request.status === 200) {
        ToastAndroid.show('Data berhasil diedit', ToastAndroid.SHORT);
        replace('Homepage');
      }
    } catch (e) {
      console.log(e);
      ToastAndroid.show('Edit Data gagal !', ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  closeModal = bool => {
    props.changeModalVisible(bool);
  };

  return (
    <View style={styles.centeredView}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Edit Data</Text>
          <View style={styles.containerInput}>
            <Text style={styles.textInput}>Nama Pemilik</Text>
            <TextInput
              placeholder="Masukan Nama"
              placeholderTextColor={colors.secondary}
              onChangeText={value => setData({...data, nama_pemilik: value})}
              style={styles.input}
              value={data.nama_pemilik}
            />
            <Text style={styles.textInput}>Kendaraan</Text>
            <DropDownPicker
              open={open}
              value={value ? value : data.jenis}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              onChangeValue={e => setValue(e)}
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
                value={moment(data.tanggal).format('LL')}
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
                value={moment(data.waktu, 'HH:mm:ss').format('HH:mm')}
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
                if (!data.nama_pemilik) {
                  ToastAndroid.show('Data masih kosong', ToastAndroid.SHORT);
                } else {
                  await editList();
                }
              }}>
              <Text style={styles.textBtn}>Edit</Text>
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

export default ModalEditList;
