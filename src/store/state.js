import { getToken } from '@/utils/auth';

export const state = {
  isAuthenticated: getToken(),
  user: null,
  error: null,
  loading: false
};
