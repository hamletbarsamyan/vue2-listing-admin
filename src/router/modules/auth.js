const authRouter = [
  {
    path: '/forgot-password',
    component: () => import('@/views/auth/reset-password/ForgotPassword'),
    hidden: true
  },
  {
    path: '/reset-mail-sent',
    component: () => import('@/views/auth/reset-password/PasswordResetMailSent'),
    hidden: true
  },
  {
    path: '/reset-password',
    component: () => import('@/views/auth/reset-password/ResetPassword'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/auth/register/Register'),
    hidden: true
  },
  {
    path: '/register-mail-sent',
    component: () => import('@/views/auth/register/RegisterMailSent'),
    hidden: true
  },
  {
    path: '/confirm-registration',
    component: () => import('@/views/auth/register/ConfirmRegistration'),
    hidden: true
  }
];

export default authRouter;
