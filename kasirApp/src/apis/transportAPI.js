import axios from 'axios';

const transportAPI = axios.create({
  baseURL: 'http://192.168.34.152:5000/transports',
});

export default transportAPI;
