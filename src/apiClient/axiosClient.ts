import axios from 'axios';
import { CACHE_SERVER_URL } from '../constants';

const instance = axios.create({
  baseURL: CACHE_SERVER_URL,
});

export default instance;
