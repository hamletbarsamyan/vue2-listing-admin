import request from '@/utils/request';

export function getItems(listQuery) {
  let params = '?page=' + listQuery.page + '&size=' + listQuery.size;
  params += '&categoryId=' + listQuery.categoryId + '&name=' + listQuery.name;
  params += '&upc=' + listQuery.upc + '&status=' + listQuery.status;
  params += '&sortBy=' + listQuery.sortBy + '&asc=' + listQuery.asc;

  return request({
    url: '/items' + params,
    method: 'get'
  });
}

export function getListingTypes() {
  return request({
    url: '/items/listingTypes',
    method: 'get'
  });
}

export function getItem(id) {
  return request({
    url: '/items/' + id,
    method: 'get'
  });
}

export function getItemManageData(id) {
  return request({
    url: '/items/manage/' + id,
    method: 'get'
  });
}

export function saveItem(item) {
  return request({
    url: '/items',
    method: 'post',
    data: item
  });
}

export function deleteItem(id) {
  return request({
    url: '/items/' + id,
    method: 'delete'
  });
}

export function getAttributes(itemId) {
  return request({
    url: '/items/' + itemId + '/attributes',
    method: 'get'
  });
}

export function saveAllAttributes(itemId, attributes) {
  return request({
    url: '/items/' + itemId + '/attributes',
    method: 'post',
    data: attributes
  });
}

export function getImages(itemId) {
  return request({
    url: '/items/' + itemId + '/images',
    method: 'get'
  });
}

export function getImageUploadPath(id) {
  return process.env.BASE_API + '/items/' + id + '/uploadImage';
}

export function deleteImage(itemId, id) {
  return request({
    url: '/items/' + itemId + '/images/' + id,
    method: 'delete'
  });
}
