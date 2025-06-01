import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { getUserSelector, logout } from '../../services/slices/user-slice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
