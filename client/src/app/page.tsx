'use client';

import Link from 'next/link';

import { AuthModal, useAuthModal } from '@/features/auth-modal';
import { useAuth } from '@/shared/lib/auth/useAuth';

import styles from './page.module.scss';

export default function Home() {
  const { isAuthenticated, logout, isLoading, login, register } = useAuth();
  const { isOpen, openModal, closeModal } = useAuthModal();

  return (
    <>
      <div className={styles.container}>
        <main className={styles.main}>
          {isAuthenticated ? (
            <div className={styles.status}>Авторизован</div>
          ) : (
            <div onClick={openModal} className={styles.statusNotAuth}>
              Не авторизован
            </div>
          )}

          {isAuthenticated && (
            <div className={styles.actions}>
              <Link className={styles.link} href="/study">
                Tasks
              </Link>
              <button onClick={logout} className={styles.logout}>
                Выйти
              </button>
            </div>
          )}
        </main>
      </div>

      <AuthModal
        isOpen={isOpen && !isAuthenticated}
        login={login}
        register={register}
        isLoading={isLoading}
        onClose={closeModal}
      />
    </>
  );
}
