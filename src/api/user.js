import request from '@/utils/request';

export function getUsers(listQuery) {
  const params = '?page=' + listQuery.page + '&size=' + listQuery.size;
  return request({
    url: '/users' + params,
    method: 'get'
  });
}

export function getUser(id) {
  return request({
    url: '/users/' + id,
    method: 'get'
  });
}

export function getUserView(id) {
  return request({
    url: '/users/view/' + id,
    method: 'get'
  });
}

export function saveUser(user) {
  return request({
    url: '/users',
    method: 'post',
    data: user
  });
}

export function deleteUser(id) {
  return request({
    url: '/users/' + id,
    method: 'delete'
  });
}
