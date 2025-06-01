import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';
import { useForm } from '../../hooks/useForm';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const { values, handleChange } = useForm({
    password: ''
  });
  const [token, setToken] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    resetPasswordApi({ password: values.password, token })
      .then(() => {
        localStorage.removeItem('resetPassword');
        setSuccess(true);
        setTimeout(() => navigate('/login'), 1500);
      })
      .catch((err) => setError(err));
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <>
      <ResetPasswordUI
        errorText={error?.message}
        password={values.password}
        token={token}
        setValue={handleChange}
        setToken={setToken}
        handleSubmit={handleSubmit}
      />
      {success && (
        <div
          data-testid='success-message'
          style={{ textAlign: 'center', marginTop: 16, color: 'green' }}
        >
          Пароль успешно изменён! Перенаправление на вход...
        </div>
      )}
    </>
  );
};
