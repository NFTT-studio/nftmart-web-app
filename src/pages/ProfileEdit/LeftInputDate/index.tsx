/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
import React, { FC, useState, useEffect } from 'react';
import {
  InputGroup,
  Input,
  InputLeftAddon,
  Text,
  Flex,
} from '@chakra-ui/react';
import DatePicker from 'react-date-picker';

interface Props {
  defaultValue: string
  id: string
  position: string
  url: string
  urlOptional: string
  onChange?: (a: any, b: string,) => any
}

const LeftAddonInput: FC<Props> = ({
  defaultValue, onChange, position, url, urlOptional, id,
}) => {
  // console.log(defaultValue, new Date(defaultValue));
  const time = defaultValue ? new Date(defaultValue) : '';
  const [value, onSeChange] = useState(time);

  useEffect(() => {
    if (onChange) onChange(new Date(value).getTime(), id);
  }, [value]);
  useEffect(() => {
    // setTimeout(() => {
    //   onReady(true);
    // }, 3000);
    onSeChange(time);
  }, [defaultValue]);

  return (
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
        height="100%"
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
      <DatePicker
        name={id}
        onChange={onSeChange}
        value={value}
        calendarIcon={null}
        clearIcon={null}
      />
      {/* <Input
      id={id}
      height="100%"
      borderRadius="none"
      defaultValue={value}
      border="none"
      onChange={onChange}
      fontSize="14px"
      color="#000000"
      fontFamily="TTHoves-Regular, TTHoves"
      fontWeight="400"
      placeholder=""
    /> */}
    </InputGroup>
  );
};

export default LeftAddonInput;
