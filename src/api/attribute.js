import request from '@/utils/request';

export function lookupAttributes() {
  return request({
    url: '/attributes/lookup',
    method: 'get'
  });
}

export function getAttributeTypes() {
  return request({
    url: '/attributes/types',
    method: 'get'
  });
}

export function getAttributes() {
  return request({
    url: '/attributes',
    method: 'get'
  });
}

export function getAttribute(id) {
  return request({
    url: '/attributes/' + id,
    method: 'get'
  });
}

export function getAttributeManageData(id) {
  return request({
    url: '/attributes/manage/' + id,
    method: 'get'
  });
}

export function saveAttribute(attribute) {
  return request({
    url: '/attributes',
    method: 'post',
    data: attribute
  });
}

export function deleteAttribute(id) {
  return request({
    url: '/attributes/' + id,
    method: 'delete'
  });
}

export function getAttributeValues(attributeId) {
  return request({
    url: '/attributes/' + attributeId + '/values',
    method: 'get'
  });
}

export function getAttrValuesWithTranslations(attributeId) {
  return request({
    url: '/attributes/' + attributeId + '/valuesWithTranslations',
    method: 'get'
  });
}

export function saveAllAttributes(attributeId, attributeValues) {
  return request({
    url: '/attributes/' + attributeId + '/values',
    method: 'post',
    data: attributeValues
  });
}

