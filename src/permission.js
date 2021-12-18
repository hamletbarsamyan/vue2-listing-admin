import router from './router';
import store from './store';
import { Message } from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';// progress bar style
import { getToken } from '@/utils/auth'; // getToken from cookie

NProgress.configure({ showSpinner: false });// NProgress Configuration

// permission judge function
function hasPermission(permissions, permission) {
  if (!permissions) return true;
  return permissions.indexOf(permission) >= 0;
}

const whiteList = ['/login', '/auth-redirect', '/forgot-password', '/reset-mail-sent', '/reset-password', '/register', '/register-mail-sent', '/confirm-registration'];

router.beforeEach((to, from, next) => {
  NProgress.start();
  const requiresAuth = to.matched.some(record => record.meta.auth);
  const isLoginPage = to.matched.some(record => record.meta.loginPage);
  const hasToken = getToken();

  if (hasToken) { // has token
    if (isLoginPage) {
      router.push('/dashboard');
    } else if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      if (store.getters.permissions.length === 0) {
        store.dispatch('GetUserInfo').then(res => {
          const appResp = res.data;
          const permissions = appResp.data.permissions;

          store.dispatch('GenerateRoutes', { permissions }).then(() => {
            router.addRoutes(store.getters.addRouters);
            next({ ...to, replace: true });
          });
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again');
            next({ path: '/' });
          });
        });
      } else {
        if (hasPermission(store.getters.permissions, to.meta.permission)) {
          next();
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }});
        }
      }
    }
  } else { // has no token
    if (requiresAuth) {
      next('/login');
    } else if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
