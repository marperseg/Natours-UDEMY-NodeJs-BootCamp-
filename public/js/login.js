/* eslint-disable */
import axios from 'axios';

import { showAlert } from './alerts';

export const login = async (email, password) => {
  console.log('Logging in...');
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:8468/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in Successfylly!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1200);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:8468/api/v1/users/logout',
    });
    console.log('LOGOUT', res.data.status);
    if ((res.data.status = 'success')) location.reload(true);
  } catch (err) {
    showAlert('error', 'Error loging out...');
  }
};
