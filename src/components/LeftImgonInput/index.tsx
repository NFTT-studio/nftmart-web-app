import React, { FC, ReactElement } from 'react';
import {
  InputGroup,
  Input,
  InputLeftAddon,
} from '@chakra-ui/react';

interface Props {
  id: string
  value: string
  url: ReactElement<any, any>
  position: string
  placeholder: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
}

// eslint-disable-next-line no-return-assign
const LeftAddonInput: FC<Props> = ({
  id, value, onChange, url, position, placeholder,
}) => (
  <InputGroup
    width="600px"
    height="40px"
    background="#FFFFFF"
    // eslint-disable-next-line no-nested-ternary
    borderRadius={position === 'top' ? '4px 4px 0px 4px'
      : position === 'bottom' ? '0px 0px 4px 4px' : 0}
    border="1px solid #E5E5E5"
    fontSize="12px"
    fontFamily="TTHoves-Regular, TTHoves"
    fontWeight="400"
    color="#999999"
  >
    <InputLeftAddon
      borderRadius="0"
      height="40px"
      background="#F4F4F4"
      fontSize="12px"
      fontFamily="TTHoves-Regular, TTHoves"
      fontWeight="400"
    >
      {url}
    </InputLeftAddon>
    <Input
      fontSize="12px"
      fontFamily="TTHoves-Regular, TTHoves"
      fontWeight="400"
      placeholder={placeholder}
      color="#000000"
      onChange={onChange}
      borderRadius="0px"
      value={value}
      _placeholder={{
        color: '#999999',
      }}
      id={id}
      name={id}
    />
  </InputGroup>
);

export default LeftAddonInput;
