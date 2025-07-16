'use client';

import Link from 'next/link';
import { useState } from 'react';

import { useLoginMutation } from '@/entities/user/api/userApi';
import { getToken, setToken } from '@/shared/lib/auth/token';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setTokenState] = useState(false);

  const [login, { isLoading, error }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      setToken(res.token);
      setTokenState(getToken()?.length ? true : false);
      // dispatch(setUser(user));
    } catch (error) {
      console.error(error);
    }
    // Получить user info (например, через /me) и сохранить:
    // dispatch(setUser(user));
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-80 max-w-full p-6 rounded shadow"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            className="hover:bg-[#1a1a1a] hover:border-transparent border-solid border-black/[.08] dark:border-white/[.145] transition-colors text-white rounded px-4 py-2 font-medium disabled:opacity-50 cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? 'Входим...' : 'Войти'}
          </button>
          {error && (
            <div className="text-red-600 text-sm text-center">faild</div>
          )}
        </form>
        {token ? (
          <div className="w-full text-center text-emerald-500">авторизован</div>
        ) : (
          <div className="w-full text-center text-amber-600">
            не авторизован
          </div>
        )}

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="/tasks"
          >
            Tasks
          </Link>
        </div>
      </main>
    </div>
  );
}
