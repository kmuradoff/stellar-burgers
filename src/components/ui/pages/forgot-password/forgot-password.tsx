import { FC, useState } from 'react';

import { Input, Button } from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';
import { Link } from 'react-router-dom';
import { PageUIProps } from '../common-type';

export const ForgotPasswordUI: FC<PageUIProps> = ({
  errorText,
  email,
  setValue,
  handleSubmit
}) => {
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validate = () => {
    if (!email) {
      setError('Email обязателен');
      return false;
    }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      setError('Некорректный email');
      return false;
    }
    setError('');
    return true;
  };

  const onBlur = () => {
    setTouched(true);
    validate();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setError('');
    setSuccess('');

    if (validate()) {
      try {
        await handleSubmit(e);
        setSuccess(
          'Инструкции по восстановлению пароля отправлены на ваш email'
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Произошла ошибка при восстановлении пароля'
        );
      }
    }
  };

  return (
    <main className={styles.container}>
      <div className={`pt-6 ${styles.wrapCenter}`}>
        <h3 className='pb-6 text text_type_main-medium'>
          Восстановление пароля
        </h3>
        <form
          className={`pb-15 ${styles.form}`}
          name='login'
          onSubmit={onSubmit}
          data-testid='reset-form'
        >
          <div className='pb-6'>
            <Input
              type='email'
              placeholder='Укажите e-mail'
              onChange={setValue}
              value={email}
              name='email'
              error={!!(touched && error)}
              errorText={touched ? error : ''}
              size='default'
              data-testid='email-input'
              onBlur={onBlur}
            />
          </div>
          <div className={`pb-6 ${styles.button}`}>
            <Button
              type='primary'
              size='medium'
              htmlType='submit'
              data-testid='reset-button'
            >
              Восстановить
            </Button>
          </div>
          {(errorText || error) && (
            <p
              className={`${styles.error} text text_type_main-default pb-6`}
              data-testid='error-message'
            >
              {error || errorText}
            </p>
          )}
          {success && (
            <p
              className={`${styles.success} text text_type_main-default pb-6`}
              data-testid='success-message'
            >
              {success}
            </p>
          )}
        </form>
        <div className={`${styles.question} text text_type_main-default pb-6`}>
          Вспомнили пароль?
          <Link
            to={'/login'}
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
