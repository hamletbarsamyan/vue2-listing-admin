import store from '@/store';

export function hasPermission(permission) {
  const permissions = store.getters && store.getters.permissions;
  return permissions.indexOf(permission) >= 0;
}
