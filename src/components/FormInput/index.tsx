import React, { FC } from 'react';
import {
  Input,
} from '@chakra-ui/react';

interface Props {
  id: string
  value: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
}

const FormInput: FC<Props> = ({ id, value, onChange }) => (
  <Input
    id={id}
    name={id}
    type="text"
    height="40px"
    background="#FFFFFF"
    borderRadius="4px"
    border="1px solid #E5E5E5"
    fontSize="12px"
    fontFamily="TTHoves-Regular, TTHoves"
    fontWeight="400"
    color="#999999"
    onChange={onChange}
    value={value}
  />
);

export default FormInput;
