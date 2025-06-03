import { FC, SyntheticEvent } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  registerUser,
  getErrorSelector
} from '../../services/slices/user-slice';
import { RegisterUI } from '@ui-pages';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const error = useSelector(getErrorSelector);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
      email: { value: string };
      password: { value: string };
    };
    const name = target.name.value;
    const email = target.email.value;
    const password = target.password.value;
    dispatch(registerUser({ name, email, password }));
  };

  return <RegisterUI errorText={error} onSubmit={handleSubmit} />;
};
