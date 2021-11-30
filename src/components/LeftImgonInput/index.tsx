/* eslint-disable react/no-children-prop */
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
    height="43px"
    background="#FFFFFF"
    // eslint-disable-next-line no-nested-ternary
    borderRadius={position === 'top' ? '4px 4px 0px 4px'
      : position === 'bottom' ? '0px 0px 4px 4px' : 0}
    borderBottom="1px solid #E5E5E5"
    borderTop={position === 'top' ? '1px solid #E5E5E5' : ''}
    borderLeft="1px solid #E5E5E5"
    borderRight="1px solid #E5E5E5"
    fontSize="12px"
    fontFamily="TTHoves-Regular, TTHoves"
    fontWeight="400"
    color="#999999"
    boxSizing="border-box"
  >
    <InputLeftAddon
      boxSizing="border-box"
      border="none"
      borderRadius="0"
      h="100%"
      background="#F4F4F4"
      fontSize="12px"
      fontFamily="TTHoves-Regular, TTHoves"
      fontWeight="400"
    >
      {url}
    </InputLeftAddon>
    <InputLeftAddon
      boxSizing="border-box"
      h="100%"
      m="0"
      p="0 0 0 10px"
      fontSize="12px"
      fontFamily="TTHoves-Regular, TTHoves"
      fontWeight="400"
      color="#000000"
      background="none"
      border="0"
      children={position === 'top' ? null : placeholder}
    />

    <Input
      p="0"
      border="none"
      fontSize="12px"
      fontFamily="TTHoves-Regular, TTHoves"
      fontWeight="400"
      placeholder={position === 'top' ? placeholder : ''}
      color="#000000"
      onChange={onChange}
      borderRadius="0px"
      value={value}
      _placeholder={{
        color: '#999999',
      }}
      id={id}
      name={id}
      _focus={{
        border: 'none',
      }}
    />
  </InputGroup>
);

export default LeftAddonInput;
