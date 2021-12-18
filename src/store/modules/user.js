import { loginByUsername, logout, sendPasswordResetMail, resetPassword, register, confirmRegistration } from '@/api/auth';
import { getUserInfo } from '@/api/profile';
import { getToken, setToken, removeToken } from '@/utils/auth';

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    permissions: []
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_STATUS: (state, status) => {
      state.status = status;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions;
    }
  },

  actions: {
    SendPasswordResetMail({ commit }, email) {
      return new Promise((resolve, reject) => {
        sendPasswordResetMail(email).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const appResp = response.data;

          if (appResp.error === true) {
            reject(appResp.data);
          } else {
            commit('SET_TOKEN', appResp.data);
            setToken(appResp.data);
            resolve(response);
          }
        }).catch(error => {
          reject(error);
        });
      });
    },
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          const appResp = response.data;

          if (!appResp) {
            reject('error loading user info');
          }
          const data = appResp.data;

          if (data.permissions && data.permissions.length > 0) {
            commit('SET_PERMISSIONS', data.permissions);
          } else {
            reject('getInfo: permissions must be a non-null array !');
          }

          commit('SET_NAME', data.login);
          commit('SET_AVATAR', data.iconPath);
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_PERMISSIONS', []);
          removeToken();
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        removeToken();
        resolve();
      });
    },
    ResetPassword({ commit }, postData) {
      return new Promise((resolve, reject) => {
        resetPassword(postData).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role);
        setToken(role);
        getUserInfo(role).then(response => {
          const data = response.data;
          commit('SET_PERMISSIONS', data.permissions);
          commit('SET_NAME', data.name);
          commit('SET_AVATAR', data.icon);
          dispatch('GenerateRoutes', data);
          resolve();
        });
      });
    },
    Register({ commit }, data) {
      return new Promise((resolve, reject) => {
        register(data).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },
    ConfirmRegistration({ commit }, data) {
      return new Promise((resolve, reject) => {
        confirmRegistration(data).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    }
  }
};

export default user;
