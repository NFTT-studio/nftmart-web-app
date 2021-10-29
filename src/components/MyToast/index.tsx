import React, { FC, useEffect } from 'react';
import { ToastContainer, Slide } from 'react-toastify';
import {
  Image,
  Text,
  Box,
  useToast,
  Flex,
} from '@chakra-ui/react';
import 'react-toastify/dist/ReactToastify.css';

import { IconMap } from '../../constants';

type ToastBody = {
  title: string,
  message: string,
  type: 'success' | 'error' | 'processing' | 'warning' | 'prompt'
}

export const ToastBody: FC<ToastBody> = ({ message, title, type }) => {
  const toast = useToast();
  function closeAll() {
    toast.closeAll();
  }
  useEffect(() => () => {
    closeAll();
  }, []);
  return (
    <Flex
      minWidth="400px"
      minHeight="90px"
      background="#FFFFFF"
      borderRadius="4px"
      border="1px solid #E5E5E5"
      p="20px"
      position="relative"
    >
      <Image display="inline-block" src={IconMap[type]} w="20px" h="20px" />
      <Flex
        flexDirection="column"
        ml="10px"

      >
        <Text
          display="inline-block"
          fontSize="16px"
          fontFamily="TTHoves-Regular, TTHoves"
          fontWeight="400"
          color="#191A24"
          lineHeight="18px"
        >
          {title}
        </Text>
        <Text
          display="inline-block"
          maxW="320px"
          mt="12px"
          fontSize="14px"
          fontFamily="TTHoves-Regular, TTHoves"
          fontWeight="400"
          color="#999999"
          lineHeight="16px"
        >
          {message}
        </Text>
      </Flex>
      <Image
        cursor="pointer"
        display="inline-block"
        onClick={closeAll}
        position="absolute"
        right="20px"
        src={IconMap.close}
        w="12px"
        h="12px"
      />
    </Flex>
  );
};

const MyToast: FC<{ isCloseable: boolean }> = ({
  isCloseable,
}) => (
  <ToastContainer
    position="top-center"
    autoClose={false}
    hideProgressBar
    closeOnClick={isCloseable}
    closeButton={isCloseable}
    limit={1}
    transition={Slide}
    style={{
      width: '400px',
      height: '90px',
    }}
  />
);

export default MyToast;
