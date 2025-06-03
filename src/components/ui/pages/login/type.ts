import { PageUIProps } from '../common-type';

export type LoginUIProps = {
  errorText?: string;
  onSubmit: (e: React.FormEvent) => void;
};
