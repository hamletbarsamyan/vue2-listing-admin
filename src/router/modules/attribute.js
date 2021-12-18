
import Layout from '@/views/layout/Layout';

const attributesRouter = {
  path: '/attributes',
  component: Layout,
  name: 'Attributes',
  redirect: '/attributes/list',
  meta: {
    title: 'attributes',
    icon: 'component',
    permission: 'attribute.view'
  },
  children: [
    {
      path: 'create',
      component: () => import('@/views/attribute/create'),
      name: 'CreateAttribute',
      meta: { title: 'createAttribute', icon: 'edit', permission: 'attribute.manage' },
      hidden: true
    },
    {
      path: 'edit/:id(\\d+)',
      component: () => import('@/views/attribute/edit'),
      name: 'EditAttribute',
      meta: { title: 'editAttribute', noCache: true, permission: 'attribute.manage' },
      hidden: true
    },
    {
      path: 'view/:id(\\d+)',
      component: () => import('@/views/attribute/components/AttributeView'),
      name: 'ViewAttribute',
      meta: { title: 'viewAttribute', noCache: true, permission: 'attribute.view' },
      hidden: true
    },
    {
      path: 'list',
      component: () => import('@/views/attribute/list'),
      name: 'AttributeList',
      meta: { title: 'attributeList', icon: 'component', permission: 'attribute.view' }
    },
    {
      path: ':id(\\d+)/values',
      component: () => import('@/views/attribute/components/AttributeValues'),
      name: 'AttributeValuesList',
      meta: { title: 'attributeValues', icon: 'component', permission: 'attribute.view' },
      hidden: true,
      props: true
    }
  ]
};

export default attributesRouter;
