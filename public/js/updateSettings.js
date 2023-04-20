/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// type is 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://localhost:8468/api/v1/users/updateMyPassword'
        : 'http://localhost:8468/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfylly!`);
      window.setTimeout(() => {
        location.assign('/');
      }, 1200);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
