'use client';

import { useSelector } from 'react-redux';

import { selectRefreshing } from '@/entities/user/models/auth.slice';

export function AuthOverlay() {
  const isRefreshing = useSelector(selectRefreshing);
  if (!isRefreshing) {
    return null;
  }
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ color: 'white', fontSize: 24 }}>
        Обновляем авторизацию...
      </div>
    </div>
  );
}
