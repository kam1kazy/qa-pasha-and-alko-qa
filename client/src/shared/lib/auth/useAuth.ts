'use client';

import { useEffect, useState } from 'react';

export function useAuth() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(!!localStorage.getItem('token'));
  }, []);

  return { isAuth };
}
