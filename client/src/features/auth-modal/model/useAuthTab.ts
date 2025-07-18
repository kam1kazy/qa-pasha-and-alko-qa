import { useState } from 'react';

export type AuthTab = 'login' | 'register';

export function useAuthTab(initialTab: AuthTab = 'login') {
  const [tab, setTab] = useState<AuthTab>(initialTab);

  const switchToLogin = () => setTab('login');
  const switchToRegister = () => setTab('register');

  return {
    tab,
    setTab,
    switchToLogin,
    switchToRegister,
  };
}
