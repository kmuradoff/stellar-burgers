import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { loginUser } from '../../services/slices/user-slice';
import { useForm } from '../../hooks/useForm';
import { TLoginData } from '@api';

export const Login: FC = () => {
  const { values, handleChange } = useForm<TLoginData>({
    email: '',
    password: ''
  });
  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser(values));
  };

  return (
    <LoginUI
      errorText=''
      email={values.email}
      setValue={handleChange}
      password={values.password}
      handleSubmit={handleSubmit}
    />
  );
};
