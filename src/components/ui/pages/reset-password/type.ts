import { Dispatch, SetStateAction } from 'react';
import { PageUIProps } from '../common-type';

export type ResetPasswordUIProps = Omit<PageUIProps, 'email' | 'setEmail'> & {
  password: string;
  token: string;
  setValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setToken: Dispatch<SetStateAction<string>>;
};
