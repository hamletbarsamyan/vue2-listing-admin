import request from '@/utils/request';

export function getUserInfo(token) {
  return request({
    url: '/profile/info',
    method: 'get',
    params: { token }
  });
}

export function getProfile() {
  return request({
    url: '/profile',
    method: 'get'
  });
}

export function saveProfile(user) {
  return request({
    url: '/profile',
    method: 'post',
    data: user
  });
}

export function changePassword(passwordChangeData) {
  return request({
    url: '/profile/changePassword',
    method: 'post',
    data: passwordChangeData
  });
}

export function getImageUploadPath() {
  return process.env.BASE_API + '/profile/uploadImage';
}

export function deleteImage() {
  return request({
    url: '/profile/removeImage',
    method: 'delete'
  });
}
