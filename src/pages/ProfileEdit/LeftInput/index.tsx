/* eslint-disable no-nested-ternary */
import React, { FC } from 'react';
import {
  InputGroup,
  Input,
  InputLeftAddon,
  Text,
} from '@chakra-ui/react';

interface Props {
  position: string
  value: string
  url: string
  urlOptional: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
}

const LeftAddonInput: FC<Props> = ({
  position, value, onChange, url, urlOptional,
}) => (
  <InputGroup
    width="600px"
    height="42px"
    background="#FFFFFF"
    borderRadius={position === 'top' ? '4px 4px 0px 0px'
      : position === 'bottom' ? '0px 0px 4px 4px' : 0}
    borderBottom="1px solid #E5E5E5"
    borderLeft="1px solid #E5E5E5"
    borderRight="1px solid #E5E5E5"
    borderTop={position === 'top' ? '1px solid #E5E5E5' : ''}
    fontSize="12px"
    fontFamily="TTHoves-Regular, TTHoves"
    fontWeight="400"
    color="#999999"
    boxSizing="border-box"
  >
    <InputLeftAddon
      borderRadius="none"
      width="127px"
      height="40px"
      background="#F4F4F4"
      border="none"
      fontSize="14px"
      fontFamily="TTHoves-DemiBold, TTHoves"
      fontWeight="600"
      color="rgba(0, 0, 0, 0.85)"
    >
      {url}
      <Text
        fontSize="12px"
        fontFamily="TTHoves-Regular, TTHoves"
        fontWeight="400"
        color="rgba(0, 0, 0, 0.5)"
      >
        {urlOptional}
      </Text>
    </InputLeftAddon>
    <Input
      borderRadius="none"
      value={value}
      id="date"
      name="date"
      border="none"
      onChange={onChange}
      fontSize="14px"
      color="#000000"
      fontFamily="TTHoves-Regular, TTHoves"
      fontWeight="400"
      placeholder=""
    />
  </InputGroup>
);

export default LeftAddonInput;
