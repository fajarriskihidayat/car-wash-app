import axios from 'axios';

const userAPI = axios.create({
  baseURL: 'http://192.168.34.152:5000/users',
});

export default userAPI;
