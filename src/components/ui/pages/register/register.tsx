import { FC, useState } from 'react';
import {
  Input,
  Button,
  PasswordInput
} from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';
import { Link } from 'react-router-dom';
import { RegisterUIProps } from './type';

export const RegisterUI: FC<RegisterUIProps> = ({ errorText, onSubmit }) => {
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false
  });
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const validate = () => {
    let nameError = '';
    let emailError = '';
    let passwordError = '';
    if (!formData.name) nameError = 'Имя обязательно';
    if (!formData.email) emailError = 'Email обязателен';
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(formData.email))
      emailError = 'Некорректный email';
    if (!formData.password) passwordError = 'Пароль обязателен';
    else if (formData.password.length < 6)
      passwordError = 'Пароль слишком короткий';
    setErrors({ name: nameError, email: emailError, password: passwordError });
    return !nameError && !emailError && !passwordError;
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
    setTouched({ name: true, email: true, password: true });
    if (validate()) {
      onSubmit(e);
    }
  };

  return (
    <main className={styles.container}>
      <div className={`pt-6 ${styles.wrapCenter}`}>
        <h3 className='pb-6 text text_type_main-medium'>Регистрация</h3>
        <form
          className={`pb-15 ${styles.form}`}
          name='register'
          onSubmit={handleSubmit}
          data-testid='register-form'
        >
          <>
            <div className='pb-6'>
              <Input
                type='text'
                placeholder='Имя'
                name='name'
                value={formData.name}
                onChange={handleChange}
                error={!!(touched.name && errors.name)}
                errorText={touched.name ? errors.name : ''}
                size='default'
                data-testid='name-input'
                onBlur={onBlur}
              />
              {touched.name && errors.name && (
                <div
                  data-testid='name-error'
                  className='text text_type_main-default text_color_error'
                >
                  {errors.name}
                </div>
              )}
            </div>
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
                Зарегистрироваться
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
        <div className={`${styles.question} text text_type_main-default pb-6`}>
          Уже зарегистрированы?
          <Link
            to='/login'
            className={`pl-2 ${styles.link}`}
            data-testid='login-link'
          >
            Войти
          </Link>
        </div>
      </div>
    </main>
  );
};
