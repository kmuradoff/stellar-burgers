import { SyntheticEvent } from 'react';

export type RegisterUIProps = {
  errorText?: string;
  onSubmit: (e: SyntheticEvent) => void;
};
