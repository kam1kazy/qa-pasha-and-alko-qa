import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '@/shared/lib/auth/useAuth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const wasAuthenticated = localStorage.getItem('wasAuthenticated') === 'true';

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !wasAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router, wasAuthenticated]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
