import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeaderUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { getUserSelector, logout } from '../../services/slices/user-slice';

export const AppHeader: FC = () => {
  const user = useSelector(getUserSelector);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return <AppHeaderUI userName={user ? `${user?.name}` : ''} handleLogout={handleLogout} />;
};
