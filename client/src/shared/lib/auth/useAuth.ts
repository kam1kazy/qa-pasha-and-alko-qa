'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
  useRegisterMutation,
} from '@/entities/user/api/userApi';
import {
  logout,
  selectAccessToken,
  selectIsAuthenticated,
  selectRefreshing,
  setAccessToken,
  setRefreshing,
} from '@/entities/user/models/auth.slice';

export type userLoginType = { email: string; password: string };

export function useAuth() {
  const dispatch = useDispatch();
  const [refresh, { isLoading: isLoadingRefresh }] = useRefreshMutation();
  const [logoutApi, { isLoading: isLoadingLogout }] = useLogoutMutation();
  const [login, { isLoading: isLoadingLogin }] = useLoginMutation();
  const [register, { isLoading: isLoadingRegister }] = useRegisterMutation();
  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isRefreshing = useSelector(selectRefreshing);

  const isLoading =
    isLoadingRefresh || isLoadingLogin || isLoadingLogout || isLoadingRegister;
  const didRequestRefresh = useRef(false);

  const refreshToken = useCallback(async () => {
    try {
      dispatch(setRefreshing(true));
      const result = await refresh().unwrap();
      dispatch(setAccessToken(result.accessToken));
      dispatch(setRefreshing(false));
      return true;
    } catch (error) {
      dispatch(logout());
      console.error('🚧 Refresh token error:', error);
      return false;
    }
  }, [dispatch, refresh]);

  const handleLogin = async ({ email, password }: userLoginType) => {
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setAccessToken(result.accessToken));
      localStorage.setItem('wasAuthenticated', 'true');
      return result;
    } catch (error) {
      localStorage.removeItem('wasAuthenticated');
      console.error(error);
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      const result = await logoutApi().unwrap();
      localStorage.removeItem('wasAuthenticated');
      dispatch(logout());
      return result;
    } catch (error) {
      console.error('🚧 Logout error:', error);
    } finally {
    }
  };

  const handleRegister = async ({ email, password }: userLoginType) => {
    try {
      const result = await register({ email, password }).unwrap();
      handleLogin({ email, password });
      return result;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  useEffect(() => {
    if (didRequestRefresh.current) {
      return;
    }
    didRequestRefresh.current = true;

    const wasAuthenticated =
      localStorage.getItem('wasAuthenticated') === 'true';

    if (!accessToken && wasAuthenticated) {
      refreshToken();
    }
  }, [accessToken, refreshToken]);

  return {
    accessToken,
    isAuthenticated,
    logout: handleLogout,
    login: handleLogin,
    register: handleRegister,
    refreshToken,
    isLoading,
    isRefreshing,
  };
}
