import request from '@/utils/request';

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  };
  return request({
    url: '/auth/login',
    method: 'post',
    data
  });
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  });
}

export function sendPasswordResetMail(email) {
  return request({
    url: '/auth/sendPasswordResetMail',
    method: 'post',
    params: { email }
  });
}

export function resetPassword(postData) {
  return request({
    url: '/auth/reset-password',
    method: 'post',
    data: postData
  });
}

export function register(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  });
}

export function confirmRegistration(data) {
  return request({
    url: '/auth/confirm-registration',
    method: 'post',
    data
  });
}
