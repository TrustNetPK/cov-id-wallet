import axios from 'axios';
import {BASE_URL} from '../helpers/ConfigApp';

export default axios.create({
  baseURL: BASE_URL,
});
