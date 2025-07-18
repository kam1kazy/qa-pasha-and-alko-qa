import { useDispatch, useSelector } from 'react-redux';

import { removeToken } from '@/shared/lib/auth/token';
import { RootState } from '@/shared/lib/redux/store';

import { clearUser } from '../models/user.slice';

export function UserInfo() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    removeToken();
    dispatch(clearUser());
    // можно добавить редирект
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      <span>{user.email}</span>
      <button onClick={handleLogout}>Выйти</button>
    </div>
  );
}
