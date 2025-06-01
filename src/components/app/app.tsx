import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect, useMemo, useState } from 'react';
import { fetchIngredients } from '../../services/slices/Ingredients-slice';

import { IngredientDetails, Modal, OrderInfo } from '@components';
import { AppHeaderUI } from '../ui/app-header';
import {
  getOrders,
  isLoadingSelector,
  orderSelector,
  removeBurger
} from '../../services/slices/order-slice';
import { getUser, getUserSelector, logout } from '../../services/slices/user-slice';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const orderNumder = useSelector(orderSelector);
  const orderIsLoading = useSelector(isLoadingSelector);
  const user = useSelector(getUserSelector);

  const backgroundLocation = location.state?.background;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(getUser());

    if (
      !backgroundLocation &&
      location.pathname !== `/feed/${orderNumder?.number}`
    ) {
      dispatch(removeBurger());
    }
  }, [dispatch, backgroundLocation, location]);

  const modalTitle = useMemo(() => {
    if (orderIsLoading) {
      return 'Детали заказа';
    }
    return orderNumder ? `#${orderNumder.number}` : 'Детали заказа';
  }, [orderIsLoading, orderNumder]);

  return (
    <>
      <div className={styles.app}>
        <AppHeaderUI userName={user?.name} handleLogout={handleLogout} />
        <Routes location={backgroundLocation || location}>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route
            path='/login'
            element={
              <ProtectedRoute onlyUnAuth>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path='/register'
            element={
              <ProtectedRoute onlyUnAuth>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path='/forgot-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path='/reset-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ResetPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile/orders'
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />
          <Route path='/feed/:number' element={<OrderInfo />} />
          <Route path='/ingredients/:id' element={<IngredientDetails />} />
          <Route path='/profile/orders/:number' element={<OrderInfo />} />
          <Route path='*' element={<NotFound404 />} />
        </Routes>

        {backgroundLocation && (
          <Routes>
            <Route
              path='/feed/:number'
              element={
                <Modal title={modalTitle} onClose={() => navigate(-1)}>
                  <OrderInfo />
                </Modal>
              }
            />
            <Route
              path='/ingredients/:id'
              element={
                <Modal
                  title={'Детали ингредиента'}
                  onClose={() => navigate(-1)}
                >
                  <IngredientDetails />
                </Modal>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <Modal title={modalTitle} onClose={() => navigate(-1)}>
                    <OrderInfo />
                  </Modal>
                </ProtectedRoute>
              }
            />
          </Routes>
        )}
      </div>
    </>
  );
};

export default App;
