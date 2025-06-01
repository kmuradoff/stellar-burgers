import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { registerUser } from '../../services/slices/user-slice';
import { useForm } from '../../hooks/useForm';

export const Register: FC = () => {
  const { values, handleChange } = useForm({
    userName: '',
    email: '',
    password: ''
  });
  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      registerUser({
        email: values.email,
        name: values.userName,
        password: values.password
      })
    );
  };

  return (
    <RegisterUI
      errorText=''
      userName={values.userName}
      email={values.email}
      password={values.password}
      setValue={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
