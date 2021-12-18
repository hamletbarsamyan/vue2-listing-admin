import request from '@/utils/request';

export function getCurrencies() {
  return request({
    url: '/currencies',
    method: 'get'
  });
}
