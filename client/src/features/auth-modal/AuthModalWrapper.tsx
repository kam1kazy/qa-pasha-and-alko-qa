'use client';

import Link from 'next/link';

import { useAuth } from '@/shared/lib/auth/useAuth';

import { AuthModal } from './AuthModal';
import { useAuthModal } from './model/useAuthModal';

export function AuthModalWrapper() {
  const { isAuth } = useAuth();
  const { isOpen, openModal, closeModal } = useAuthModal();

  return (
    <>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-center">
          {!isAuth && (
            <div className="flex flex-col gap-4 w-80 max-w-full p-6 rounded shadow">
              <h2 className="text-2xl font-bold text-white text-center mb-4">
                Вход в систему
              </h2>
              <button
                onClick={openModal}
                className="bg-indigo-700/70 hover:bg-indigo-900 text-white rounded-lg px-4 py-3 font-medium cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Войти
              </button>
            </div>
          )}

          {isAuth ? (
            <div className="w-full text-center text-green-400 bg-green-900/20 border border-green-800 rounded-lg px-4 py-2">
              Авторизован
            </div>
          ) : (
            <div className="w-full text-center text-yellow-400 bg-yellow-900/20 border border-yellow-800 rounded-lg px-4 py-2">
              Не авторизован
            </div>
          )}

          {isAuth && (
            <div className="flex gap-4 items-center flex-col sm:flex-row">
              <Link
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
                href="/tasks"
              >
                Tasks
              </Link>
            </div>
          )}
        </main>
      </div>

      <AuthModal isOpen={isOpen} onClose={closeModal} />
    </>
  );
}
