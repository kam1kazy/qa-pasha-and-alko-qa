'use client';

import { useSelector } from 'react-redux';

import { selectRefreshing } from '@/entities/user/models/auth.slice';

import styles from './AuthOverlay.module.scss';

export function AuthOverlay() {
  const isRefreshing = useSelector(selectRefreshing);
  if (!isRefreshing) {
    return null;
  }
  return (
    <div className={styles.overlay}>
      <div style={{ color: 'white', fontSize: 24 }}>
        Обновляем авторизацию...
      </div>
    </div>
  );
}
