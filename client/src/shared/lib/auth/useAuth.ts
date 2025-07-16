'use client';

import { useEffect, useState } from 'react';

import { getToken } from './token';

export function useAuth() {
  const [isAuth, setIsAuth] = useState(false);

  const checkAuth = () => {
    const token = getToken();
    setIsAuth(token ? true : false);
  };

  useEffect(() => {
    // Проверяем токен при монтировании
    checkAuth();

    // Слушаем изменения в localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        checkAuth();
      }
    };

    // Слушаем события изменения localStorage (для других вкладок)
    window.addEventListener('storage', handleStorageChange);

    // Периодически проверяем токен (каждые 5 секунд)
    const interval = setInterval(checkAuth, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return { isAuth };
}
