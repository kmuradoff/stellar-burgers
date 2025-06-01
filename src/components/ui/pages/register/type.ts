import { Dispatch, SetStateAction } from 'react';
import { PageUIProps } from '../common-type';

export type RegisterUIProps = PageUIProps & {
  password: string;
  userName: string;
  setValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorText?: string;
  onSubmit: (e: React.FormEvent) => void;
};
