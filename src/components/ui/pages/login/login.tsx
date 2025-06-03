import { FC, useState } from 'react';
import {
  Input,
  Button,
  PasswordInput
} from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';
import { Link } from 'react-router-dom';
import { LoginUIProps } from './type';

export const LoginUI: FC<LoginUIProps> = ({ errorText, onSubmit }) => {
  const [touched, setTouched] = useState({ email: false, password: false });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [formData, setFormData] = useState({ email: '', password: '' });

  const validate = () => {
    let emailError = '';
    let passwordError = '';
    if (!formData.email) emailError = 'Email обязателен';
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(formData.email))
      emailError = 'Некорректный email';
    if (!formData.password) passwordError = 'Пароль обязателен';
    else if (formData.password.length < 6)
      passwordError = 'Пароль слишком короткий';
    setErrors({ email: emailError, password: passwordError });
    return !emailError && !passwordError;
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched({ ...touched, [e.target.name]: true });
    validate();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (validate()) {
      onSubmit(e);
    }
  };

  return (
    <main className={styles.container}>
      <div className={`pt-6 ${styles.wrapCenter}`}>
        <h3 className='pb-6 text text_type_main-medium'>Вход</h3>
        <form
          className={`pb-15 ${styles.form}`}
          name='login'
          onSubmit={handleSubmit}
          data-testid='login-form'
        >
          <>
            <div className='pb-6'>
              <Input
                type='email'
                placeholder='E-mail'
                name='email'
                value={formData.email}
                onChange={handleChange}
                error={!!(touched.email && errors.email)}
                errorText={touched.email ? errors.email : ''}
                size='default'
                data-testid='email-input'
                onBlur={onBlur}
              />
              {touched.email && errors.email && (
                <div
                  data-testid='email-error'
                  className='text text_type_main-default text_color_error'
                >
                  {errors.email}
                </div>
              )}
            </div>
            <div className='pb-6'>
              <PasswordInput
                name='password'
                value={formData.password}
                onChange={handleChange}
                data-testid='password-input'
                onBlur={onBlur}
              />
              {touched.password && errors.password && (
                <div
                  data-testid='password-error'
                  className='text text_type_main-default text_color_error'
                >
                  {errors.password}
                </div>
              )}
            </div>
            <div className={`pb-6 ${styles.button}`}>
              <Button
                type='primary'
                size='medium'
                htmlType='submit'
                data-testid='submit-button'
              >
                Войти
              </Button>
            </div>
            {errorText && (
              <p
                className={`${styles.error} text text_type_main-default pb-6`}
                data-testid='error-message'
              >
                {errorText}
              </p>
            )}
          </>
        </form>
        <div className={`pb-4 ${styles.question} text text_type_main-default`}>
          Вы - новый пользователь?
          <Link
            to='/register'
            className={`pl-2 ${styles.link}`}
            data-testid='register-link'
          >
            Зарегистрироваться
          </Link>
        </div>
        <div className={`${styles.question} text text_type_main-default pb-6`}>
          Забыли пароль?
          <Link
            to={'/forgot-password'}
            className={`pl-2 ${styles.link}`}
            data-testid='forgot-password-link'
          >
            Восстановить пароль
          </Link>
        </div>
      </div>
    </main>
  );
};
