import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { ordersSelector, getOrders } from '../../services/slices/order-slice';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(ordersSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
