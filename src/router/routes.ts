import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/quote/:id',
    name: 'ViewQuote',
    component: () => import('pages/OneQuoteOnPage.vue')
  },
  {
    path: '/auth',
    name: 'AuthLayout',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {name: 'LoginPage', path: 'login', component: () => import('pages/auth/LoginPage.vue')},
      {name: 'RegisterPage', path: 'register', component: () => import('pages/auth/RegistrationPage.vue')},
    ]
  },
  {
    path: '/manage',
    name: 'ManageLayout',
    component: () => import('layouts/ManageLayout.vue'),
    children: [
      { name: 'ManageQuotes', path: 'quotes', component: () => import('pages/manage/ManageQuote.vue'),},
      { name: 'ManageSource', path: 'sources', component: () => import('pages/manage/ManageSource.vue'),},
      { name: 'ManageSourceType', path: 'source-types', component: () => import('pages/manage/ManageSourceType.vue'),},
      { name: 'ManageUser', path: 'users', component: () => import('pages/manage/ManageUser.vue'),},
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'MainPage', path: '', component: () => import('pages/IndexPage.vue') },
      { name: 'Create', path: 'create', component: () => import('pages/EditQuotePage.vue') },
      { name: 'EditOneQuote', path: 'edit/:id?', component: () => import('pages/EditQuotePage.vue'),},
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
