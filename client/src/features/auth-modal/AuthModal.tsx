'use client';

import { useState } from 'react';

import { type userLoginType } from '@/shared/lib/auth/useAuth';

import styles from './AuthModal.module.scss';
import { useAuthTab } from './model/useAuthTab';

type loginType = ({
  email,
  password,
}: userLoginType) => Promise<false | { accessToken: string }>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  login: loginType;
  register: loginType;
}

export function AuthModal({
  isOpen,
  onClose,
  isLoading,
  login,
  register,
}: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const { tab, switchToLogin, switchToRegister } = useAuthTab();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    try {
      if (tab === 'login') {
        await login({ email, password });
      } else {
        await register({ email, password });
      }
      onClose();
    } catch (error) {
      setError(true);
      console.error('Ошибка входа', error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {tab === 'login' ? 'Вход в систему' : 'Регистрация'}
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        {/* Табы */}
        <div className={styles.tabs}>
          <button
            className={
              tab === 'login' ? `${styles.tab} ${styles.tabActive}` : styles.tab
            }
            onClick={switchToLogin}
            type="button"
          >
            Вход
          </button>
          <button
            className={
              tab === 'register'
                ? `${styles.tab} ${styles.tabActive}`
                : styles.tab
            }
            onClick={switchToRegister}
            type="button"
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading
              ? tab === 'login'
                ? 'Входим...'
                : 'Регистрируем...'
              : tab === 'login'
                ? 'Войти'
                : 'Зарегистрироваться'}
          </button>
        </form>

        {error && (
          <div className={styles.error}>
            {tab === 'login' ? 'Ошибка входа' : 'Ошибка регистрации'}
          </div>
        )}
      </div>
    </div>
  );
}
