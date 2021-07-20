import React, { FC } from 'react';

import { Box, Button, Text } from '@chakra-ui/react';

import { Colors } from '../constants';

import {
  walletLogo,
} from '../assets/images';

const Manager: FC = ({ children }) => {
  const status = false;
  return (
    <Box>
      {status === false ? (
        <Box pt="60px">
          <Text textAlign="center" color="#191A24" fontSize="20px">
            登录到您的钱包
          </Text>
          <Box alt="waleet_logo" as="img" src={walletLogo} width="160px" margin="30px auto" />
          <Box textAlign="center">
            <Button
              backgroundColor={Colors.primary}
              fontSize="14px"
              color="#fff"
              height="48px"
              width="152px"
              _hover={{ backgroundColor: Colors.primary }}
              _focus={{ backgroundColor: Colors.primary }}
            >
              登录
            </Button>
          </Box>
        </Box>
      ) : (
        <>{children}</>
      )}
    </Box>
  );
};

export default Manager;
