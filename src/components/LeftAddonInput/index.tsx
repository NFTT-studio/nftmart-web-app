import React, { FC } from 'react';
import {
  InputGroup,
  Input,
  InputLeftAddon,
} from '@chakra-ui/react';

interface Props {
  id: string
  value: string
  url: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
}

const LeftAddonInput: FC<Props> = ({
  id, value, onChange, url,
}) => (
  <InputGroup
    width="600px"
    height="40px"
    background="#FFFFFF"
    borderRadius="4px"
    border="1px solid #E5E5E5"
    fontSize="12px"
    fontFamily="TTHoves-Regular, TTHoves"
    fontWeight="400"
    color="#999999"
  >
    <InputLeftAddon
      height="40px"
      background="#F4F4F4"
      borderRadius="0px 4px 4px 0px"
      border="1px solid #E5E5E5"
      fontSize="12px"
      fontFamily="TTHoves-Regular, TTHoves"
      fontWeight="400"
    >
      {url}
    </InputLeftAddon>
    <Input
      fontSize="14px"
      color="#000000"
      fontFamily="TTHoves-Regular, TTHoves"
      fontWeight="400"
      placeholder=""
      onChange={onChange}
      value={value}
      id={id}
      name={id}
    />
  </InputGroup>
);

export default LeftAddonInput;
