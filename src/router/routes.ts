import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/quote/:id',
    name: 'ViewQuote',
    component: () => import('pages/OneQuoteOnPage.vue')
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'MainPage', path: '', component: () => import('pages/IndexPage.vue') },
      { name: 'Create', path: 'create', component: () => import('pages/EditQuotePage.vue') },
      { name: 'EditOneQuote', path: 'edit/:id?', component: () => import('pages/EditQuotePage.vue'),},
      { name: 'ManageQuotes', path: 'manage/quotes', component: () => import('pages/manage/ManageQuote.vue'),},
      { name: 'ManageSource', path: 'manage/sources', component: () => import('pages/manage/ManageSource.vue'),},
      { name: 'ManageSourceType', path: 'manage/source-types', component: () => import('pages/manage/ManageSourceType.vue'),},
      { name: 'ManageUser', path: 'manage/users', component: () => import('pages/manage/ManageUser.vue'),},
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
