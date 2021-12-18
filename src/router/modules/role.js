import Layout from '@/views/layout/Layout';

const rolesRouter = {
  path: '/roles',
  component: Layout,
  name: 'Roles',
  redirect: '/roles/list',
  meta: {
    title: 'roles',
    icon: 'lock',
    permission: 'role.view'
  },
  children: [
    {
      path: 'create',
      component: () => import('@/views/role/create'),
      name: 'CreateRole',
      meta: { title: 'createRole', icon: 'edit', permission: 'role.manage' },
      hidden: true
    },
    {
      path: 'edit/:id(\\d+)',
      component: () => import('@/views/role/edit'),
      name: 'EditRole',
      meta: { title: 'editRole', noCache: true, permission: 'role.manage' },
      hidden: true
    },
    {
      path: 'view/:id(\\d+)',
      component: () => import('@/views/role/components/RoleView'),
      name: 'ViewRole',
      meta: { title: 'viewRole', noCache: true, permission: 'role.view' },
      hidden: true
    },
    {
      path: 'list',
      component: () => import('@/views/role/list'),
      name: 'RoleList',
      meta: { title: 'roleList', icon: 'lock', permission: 'role.view' }
    }
  ]
};

export default rolesRouter;
