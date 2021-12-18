import request from '@/utils/request';

export function lookupCategories() {
  return request({
    url: '/categories/lookup',
    method: 'get'
  });
}

export function getCategoryTree() {
  return request({
    url: '/categories/tree',
    method: 'get'
  });
}

export function getCategory(id) {
  return request({
    url: '/categories/' + id,
    method: 'get'
  });
}

export function getCategoryManageData(id) {
  return request({
    url: '/categories/manage/' + id,
    method: 'get'
  });
}

export function saveCategory(category) {
  return request({
    url: '/categories',
    method: 'post',
    data: category
  });
}

export function deleteCategory(id) {
  return request({
    url: '/categories/' + id,
    method: 'delete'
  });
}

export function getImageUploadPath(id) {
  return process.env.BASE_API + '/categories/' + id + '/uploadImage';
}

export function deleteImage(id) {
  return request({
    url: '/categories/' + id + '/removeImage',
    method: 'delete'
  });
}

export function getAttributes(categoryId) {
  return request({
    url: '/categories/' + categoryId + '/attributes',
    method: 'get'
  });
}

export function saveAllAttributes(categoryId, attributes) {
  return request({
    url: '/categories/' + categoryId + '/attributes',
    method: 'post',
    data: attributes
  });
}

export function lookupAttributes(categoryId) {
  return request({
    url: '/categories/' + categoryId + '/attributes/lookup',
    method: 'get'
  });
}

export function lookupAttributeValues(categoryId) {
  return request({
    url: '/categories/' + categoryId + '/attributevalues/lookup',
    method: 'get'
  });
}
