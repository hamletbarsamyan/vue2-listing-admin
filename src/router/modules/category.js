
import Layout from '@/views/layout/Layout';

const categoriesRouter = {
  path: '/categories',
  component: Layout,
  name: 'Categories',
  redirect: '/categories/list',
  meta: {
    title: 'categories',
    icon: 'nested',
    permission: 'category.view'
  },
  children: [
    {
      path: 'create',
      component: () => import('@/views/category/create'),
      name: 'CreateCategory',
      meta: { title: 'createCategory', icon: 'edit', permission: 'category.manage' },
      hidden: true
    },
    {
      path: 'edit/:id(\\d+)',
      component: () => import('@/views/category/edit'),
      name: 'EditCategory',
      meta: { title: 'editCategory', noCache: true, permission: 'category.manage' },
      hidden: true
    },
    {
      path: 'view/:id(\\d+)',
      component: () => import('@/views/category/components/CategoryView'),
      name: 'ViewCategory',
      meta: { title: 'viewCategory', noCache: true, permission: 'category.view' },
      hidden: true
    },
    {
      path: 'list',
      component: () => import('@/views/category/list'),
      name: 'CategoryList',
      meta: { title: 'categoryList', icon: 'nested', permission: 'category.view' }
    },
    {
      path: ':id(\\d+)/attributes',
      component: () => import('@/views/category/components/CategoryAttributes'),
      name: 'CategoryAttributes',
      meta: { title: 'categoryAttributes', icon: 'nested', permission: 'category.view' },
      hidden: true,
      props: true
    }
  ]
};

export default categoriesRouter;
