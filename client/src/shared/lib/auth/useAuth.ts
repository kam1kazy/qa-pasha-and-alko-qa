'use client';

import Cookies from 'js-cookie';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  useLogoutMutation,
  useRefreshMutation,
} from '@/entities/user/api/userApi';
import { logout, setAccessToken } from '@/entities/user/models/auth.slice';
import { RootState } from '@/shared/lib/redux/store';

export function useAuth() {
  const dispatch = useDispatch();
  const { accessToken, user } = useSelector((state: RootState) => state.auth);
  const [refresh] = useRefreshMutation();
  const [logoutApi] = useLogoutMutation();

  // Новый useEffect для инициализации accessToken из куки
  // Получаем accessToken из cookie при первом монтировании
  useEffect(() => {
    if (!accessToken) {
      const tokenFromCookie = Cookies.get('accessToken');
      if (tokenFromCookie) {
        dispatch(setAccessToken(tokenFromCookie));
      }
    }
  }, [accessToken, dispatch]);

  const isAuthenticated = useMemo(() => Boolean(accessToken), [accessToken]);
  // ← теперь будет правильно, после dispatch

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch(logout());
    }
  };

  const refreshToken = async () => {
    try {
      const result = await refresh().unwrap();
      dispatch(setAccessToken(result.accessToken));
      return true;
    } catch (error) {
      console.error('Refresh token error:', error);
      dispatch(logout());
      return false;
    }
  };

  // // Автоматический refresh при инициализации приложения
  // useEffect(() => {
  //   if (!accessToken && isAuthenticated) {
  //     refreshToken();
  //   }
  // }, []);

  return {
    accessToken,
    isAuthenticated,
    user,
    logout: handleLogout,
    refreshToken,
  };
}
