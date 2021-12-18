import { asyncRouterMap, constantRouterMap } from '@/router';

function hasPermission(permissions, route) {
  if (route.meta && route.meta.permission) {
    return permissions.indexOf(route.meta.permission) >= 0;
  } else {
    return true;
  }
}

function filterAsyncRouter(routes, permissions) {
  const res = [];

  routes.forEach(route => {
    const tmp = { ...route };
    if (hasPermission(permissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, permissions);
      }
      res.push(tmp);
    }
  });

  return res;
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { permissions } = data;
        const accessedRouters = filterAsyncRouter(asyncRouterMap, permissions);
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      });
    }
  }
};

export default permission;
