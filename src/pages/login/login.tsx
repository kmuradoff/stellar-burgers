import { FC, SyntheticEvent } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser, getErrorSelector } from '../../services/slices/user-slice';
import { LoginUI } from '@ui-pages';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const error = useSelector(getErrorSelector);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;
    dispatch(loginUser({ email, password }));
  };

  return <LoginUI errorText={error} onSubmit={handleSubmit} />;
};
