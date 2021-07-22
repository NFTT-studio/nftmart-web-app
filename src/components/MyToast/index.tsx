import React, { FC } from 'react';
import { ToastContainer, Slide } from 'react-toastify';
import {
  Image,
  Text,
} from '@chakra-ui/react';
import 'react-toastify/dist/ReactToastify.css';

import { IconMap } from '../../constants';

type ToastBody = {
  title: string,
  message: string,
  type: 'success' | 'error' | 'processing' | 'warning' | 'prompt'
}

export const ToastBody: FC<ToastBody> = ({ message, title, type }) => (
  <>
    <Image display="inline-block" src={IconMap[type]} w="20px" h="20px" />
    <Text ml="10px" display="inline-block" fontSize="16">{title}</Text>
    <Text ml="30px" fontSize="14">
      {' '}
      {message}
    </Text>
  </>
);

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
