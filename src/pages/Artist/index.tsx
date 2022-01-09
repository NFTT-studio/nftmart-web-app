/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-nested-ternary */
import React, {
  useState, useEffect, MouseEventHandler, ChangeEventHandler,
} from 'react';
import {
  Spinner,
  Flex,
  Container,
  Box,
  Text,
  InputGroup,
  Input,
  Image,
  Center,
  SimpleGrid,
} from '@chakra-ui/react';

import { useTranslation } from 'react-i18next';
import MainContainer from '../../layout/MainContainer';

import {
  IconSearch,
  IconAllState,
  IconAllStateone,
  Emptyimg,
  Historyempty,
} from '../../assets/images';

const Browsing = () => {
  const { t } = useTranslation();

  return (
    <MainContainer title={`${t('Browsing.title')}|${t('Home.title')}`}>
      <Box
        w="100%"
        h="100%"
        display="flex"
        justifyContent="center"
        background="#e5e5e5"
        p="0 50px"
      >
        <Container
          className="container"
          w="100%"
          mt="40px"
          display="flex"
          justifyContent="space-between"
          maxWidth="1440px"
        >
          <Flex
            width="320px"
            height="420px"
            background="#FFFFFF"
            border-radius="10px"
            border="1px solid #979797"
          >
            11
          </Flex>
        </Container>
      </Box>
    </MainContainer>
  );
};

export default Browsing;
