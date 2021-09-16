import React, { FC, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Flex,
  Box,
  Text,
  Image,
  Link,
} from '@chakra-ui/react';
import {
  IconDetailshaSre,
  IconPen,
} from '../../../assets/images';

interface Props {
  userData?: [],
  dataPerson?: []
}
const Header: FC<Props> = (({ userData, dataPerson }) => (
  <Flex
    w="100%"
    flexDirection="column"
    justifyContent="flex-start"
    alignItems="flex-start"
    position="relative"
    top="0px"
  >
    <Flex
      w="100%"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      <Text
        w="100%"
        fontSize="28px"
        fontFamily="TTHoves-Bold, TTHoves"
        fontWeight="bold"
        color="#191A24"
        lineHeight="33px"
      >
        {userData?.name}
      </Text>
      <Text
        w="100%"
        mt="10px"
        fontSize="16px"
        fontFamily="TTHoves-Thin, TTHoves"
        fontWeight="100"
        color="#000000"
        lineHeight="18px"
        wordBreak="break-all"
      >
        {dataPerson.data?.address}
      </Text>
    </Flex>
    <Flex position="absolute" right="0px" top="0px">
      <Link
        as={RouterLink}
        to="/profile"
      >
        <Box
          key="index"
          width="40px"
          height="40px"
          borderRadius="4px 0px 0px 4px"
          border="1px solid #E5E5E5"
          display="flex"
          justifyContent="center"
          alignItems="center"
          _hover={{
            boxShadow: '0px 2px 8px 0px #E1E1E1',
          }}
        >
          <Image
            w="22px"
            h="22px"
            src={IconPen.default}
          />
        </Box>
      </Link>
      <Box
        key="index"
        width="40px"
        height="40px"
        borderRadius="0px 4px 4px 0px"
        border="1px solid #E5E5E5"
        display="flex"
        justifyContent="center"
        alignItems="center"
        _hover={{
          boxShadow: '0px 2px 8px 0px #E1E1E1',
        }}
      >
        <Image
          w="22px"
          h="22px"
          src={IconDetailshaSre.default}
        />
      </Box>
    </Flex>
  </Flex>
));

export default Header;
