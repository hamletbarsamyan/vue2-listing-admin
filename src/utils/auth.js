import Cookies from 'js-cookie';

const tokenKey = 'auth';
const expires = 1;

export function getToken() {
  return Cookies.get(tokenKey);
}

export function setToken(token) {
  return Cookies.set(tokenKey, token, { expires: expires });
}

export function removeToken() {
  return Cookies.remove(tokenKey);
}
