'use client';

import Link from 'next/link';

import { AuthModal, useAuthModal } from '@/features/auth-modal';
import { useAuth } from '@/shared/lib/auth/useAuth';

export default function Home() {
  const { isAuthenticated, logout } = useAuth();
  const { isOpen, openModal, closeModal } = useAuthModal();

  return (
    <>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-center">
          {isAuthenticated ? (
            <div className="w-full text-center text-green-400 bg-green-900/20 border border-green-800 rounded-lg px-4 py-2">
              Авторизован
            </div>
          ) : (
            <div
              onClick={openModal}
              className="w-full cursor-pointer transition-colors text-center text-yellow-400 hover:bg-yellow-900/40 bg-yellow-900/20 border border-yellow-800 rounded-lg px-4 py-2"
            >
              Не авторизован
            </div>
          )}

          {isAuthenticated && (
            <div className="flex gap-4 items-center flex-col sm:flex-row">
              <Link
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
                href="/study"
              >
                Tasks
              </Link>
              <button
                onClick={logout}
                className="rounded-full cursor-pointer border border-solid border-red-500/[.145] transition-colors flex items-center justify-center hover:bg-red-500 hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px] text-red-400"
              >
                Выйти
              </button>
            </div>
          )}
        </main>
      </div>

      <AuthModal isOpen={isOpen} onClose={closeModal} />
    </>
  );
}
