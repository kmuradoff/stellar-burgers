import React from 'react';
import { useSelector } from '../../services/store';
import {
  getIsAuthCheckedSelector,
  getUserSelector
} from '../../services/slices/user-slice';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(getIsAuthCheckedSelector);
  const user = useSelector(getUserSelector);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!user && !onlyUnAuth) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (user && onlyUnAuth) {
    const from = location.state?.from || { pathname: '/' };

    return <Navigate replace to={from} />;
  }

  return children;
};
