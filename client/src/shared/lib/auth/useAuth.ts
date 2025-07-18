'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
} from '@/entities/user/api/userApi';
import {
  logout,
  selectAccessToken,
  selectIsAuthenticated,
  selectRefreshing,
  setAccessToken,
  setRefreshing,
} from '@/entities/user/models/auth.slice';

export function useAuth() {
  const dispatch = useDispatch();
  const [refresh, { isLoading: isLoadingRefresh }] = useRefreshMutation();
  const [logoutApi, { isLoading: isLoadingLogout }] = useLogoutMutation();
  const [login, { isLoading: isLoadingLogin }] = useLoginMutation();
  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isRefreshing = useSelector(selectRefreshing);

  const isLoading = isLoadingRefresh || isLoadingLogin || isLoadingLogout;
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

  const handleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
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
    refreshToken,
    isLoading,
    isRefreshing,
  };
}
