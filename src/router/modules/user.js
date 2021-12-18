
import Layout from '@/views/layout/Layout';

const usersRouter = {
  path: '/users',
  component: Layout,
  name: 'Users',
  redirect: '/users/list',
  meta: {
    title: 'users',
    icon: 'user',
    permission: 'user.view'
  },
  children: [
    {
      path: 'create',
      component: () => import('@/views/user/create'),
      name: 'CreateUser',
      meta: { title: 'createUser', icon: 'edit', permission: 'user.manage' },
      hidden: true
    },
    {
      path: 'edit/:id(\\d+)',
      component: () => import('@/views/user/edit'),
      name: 'EditUser',
      meta: { title: 'editUser', noCache: true, permission: 'user.manage' },
      hidden: true
    },
    {
      path: 'view/:id(\\d+)',
      component: () => import('@/views/user/components/UserView'),
      name: 'ViewUser',
      meta: { title: 'viewUser', noCache: true, permission: 'user.view' },
      hidden: true
    },
    {
      path: 'list',
      component: () => import('@/views/user/list'),
      name: 'UserList',
      meta: { title: 'userList', icon: 'user', permission: 'user.view' }
    },
    {
      path: '/profile',
      component: () => import('@/views/user/components/Profile'),
      name: 'ViewProfile',
      meta: { title: 'viewProfile', noCache: true, permission: 'login' },
      hidden: true
    },
    {
      path: '/changePassword',
      component: () => import('@/views/user/components/ChangePassword'),
      name: 'ChangePassword',
      meta: { title: 'changePassword', noCache: true, permission: 'login' },
      hidden: true
    }
  ]
};

export default usersRouter;
