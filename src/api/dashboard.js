import request from '@/utils/request';

export function getUsersCount() {
  return request({
    url: '/dashboard/usersCount',
    method: 'get'
  });
}

export function getCategoriesCount() {
  return request({
    url: '/dashboard/categoriesCount',
    method: 'get'
  });
}

export function getItemsCount() {
  return request({
    url: '/dashboard/itemsCount',
    method: 'get'
  });
}

export function getCategoryItemsCount() {
  return request({
    url: '/dashboard/categoryItemsCount',
    method: 'get'
  });
}
