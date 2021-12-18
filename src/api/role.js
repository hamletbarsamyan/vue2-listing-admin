import request from '@/utils/request';

export function getRoles() {
  return request({
    url: '/roles',
    method: 'get'
  });
}

export function getRole(id) {
  return request({
    url: '/roles/' + id,
    method: 'get'
  });
}

export function getRoleInfo(id) {
  return request({
    url: '/roles/info/' + id,
    method: 'get'
  });
}

export function getPermissions() {
  return request({
    url: '/roles/permissions',
    method: 'get'
  });
}

export function createOrUpdateRole(role, create) {
  if (create === true) {
    return createRole(role);
  } else {
    return updateRole(role);
  }
}

export function createRole(role) {
  return request({
    url: '/roles',
    method: 'post',
    data: role
  });
}

export function updateRole(role) {
  return request({
    url: '/roles/' + role.id,
    method: 'put',
    data: role
  });
}

export function deleteRole(roleId) {
  return request({
    url: '/roles/' + roleId,
    method: 'delete'
  });
}
