import request from '@/utils/request';

export function getLanguages() {
  return request({
    url: '/languages',
    method: 'get'
  });
}

export function getLanguageNameMap() {
  return request({
    url: '/languages/nameMap',
    method: 'get'
  });
}
