'use client';

import { useState } from 'react';

type loginType = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => Promise<false | { accessToken: string }>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  login: loginType;
}

export function AuthModal({
  isOpen,
  onClose,
  isLoading,
  login,
}: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async () => {
    setError(false);
    try {
      await login({ email, password });
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Вход в систему</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-600 rounded-lg px-4 py-3 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-600 rounded-lg px-4 py-3 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
          <button
            type="submit"
            className="bg-indigo-700/70 hover:bg-indigo-900 text-white rounded-lg px-4 py-3 font-medium disabled:opacity-50 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 focus:ring-offset-gray-800"
            disabled={isLoading}
          >
            {isLoading ? 'Входим...' : 'Войти'}
          </button>
        </form>

        {error && (
          <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-800 rounded-lg px-3 py-2 mt-4">
            Ошибка входа
          </div>
        )}
      </div>
    </div>
  );
}
