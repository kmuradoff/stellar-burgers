import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  burgerSelector,
  removeIngredients,
  addToBurger
} from '../../services/slices/constructor-slice';
import {
  isLoadingSelector,
  orderSelector,
  fetchOrder,
  removeBurger
} from '../../services/slices/order-slice';
import {
  getIsAuthenticatedSelector,
  getUserSelector
} from '../../services/slices/user-slice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(burgerSelector);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const user = useSelector(getUserSelector);
  const navigate = useNavigate();

  const orderRequest = useSelector(isLoadingSelector);

  const orderModalData = useSelector(orderSelector);

  const onOrderClick = () => {
    if (!user && !isAuthenticated) {
      return navigate('/login');
    }

    if (!constructorItems.bun || orderRequest) return;

    const ingredients = constructorItems.ingredients.map((item) => item._id);
    dispatch(
      fetchOrder([
        constructorItems.bun._id,
        ...ingredients,
        constructorItems.bun._id
      ])
    );
  };
  const closeOrderModal = () => {
    dispatch(removeIngredients());
    dispatch(removeBurger());
  };

  const handleDrop = (ingredient: any) => {
    dispatch(addToBurger(ingredient));
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      onDrop={handleDrop}
    />
  );
};
