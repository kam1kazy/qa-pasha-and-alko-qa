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
    checkAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(checkAuth, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return { isAuth };
}
