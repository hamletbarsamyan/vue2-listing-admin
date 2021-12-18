import Layout from '@/views/layout/Layout';

const itemsRouter = {
  path: '/items',
  component: Layout,
  name: 'Items',
  redirect: '/items/list',
  meta: {
    title: 'items',
    icon: 'list',
    permission: 'item.view'
  },
  children: [
    {
      path: 'create',
      component: () => import('@/views/item/create'),
      name: 'CreateItem',
      meta: { title: 'createItem', icon: 'edit', permission: 'item.view' },
      hidden: true
    },
    {
      path: 'edit/:id(\\d+)',
      component: () => import('@/views/item/edit'),
      name: 'EditItem',
      meta: { title: 'editItem', noCache: true, permission: 'item.manage' },
      hidden: true
    },
    {
      path: 'view/:id(\\d+)',
      component: () => import('@/views/item/components/ItemView'),
      name: 'ViewItem',
      meta: { title: 'viewItem', noCache: true, permission: 'item.view' },
      hidden: true
    },
    {
      path: 'list',
      component: () => import('@/views/item/list'),
      name: 'ItemList',
      meta: { title: 'itemList', icon: 'list', permission: 'item.view' }
    },
    {
      path: ':id(\\d+)/attributes',
      component: () => import('@/views/item/components/ItemAttributes'),
      name: 'ItemAttributes',
      meta: { title: 'itemAttributes', icon: 'list', permission: 'item.view' },
      hidden: true,
      props: true
    }
  ]
};

export default itemsRouter;
