'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '@/shared/lib/auth/useAuth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      router.replace('/'); // редирект на главную
    }
  }, [isAuth, router]);

  if (!isAuth) {
    return null;
  } // или лоадер

  return <>{children}</>;
}
