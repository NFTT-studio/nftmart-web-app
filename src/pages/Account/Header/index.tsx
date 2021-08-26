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
  AccountBanner,
  HeadPortrait,
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
    alignItems="center"
    position="relative"
    top="20px"
  >
    <Image w="1396px" h="auto" src={userData?.featured_image || AccountBanner.default} alt="" />
    <Flex
      w="100%"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      position="relative"
      top="-60px"
    >
      <Image
        background="#FFFFFF"
        width="120px"
        borderRadius="50%"
        border="3px solid #FFFFFF"
        height="auto"
        objectFit="cover"
        src={userData?.avatar || HeadPortrait.default}
      />

      <Text
        mt="20px"
        fontSize="28px"
        fontFamily="TTHoves-Bold, TTHoves"
        fontWeight="bold"
        color="#191A24"
        lineHeight="33px"
      >
        {userData?.name}
      </Text>
      <Text
        mt="12px"
        fontSize="14px"
        fontFamily="TTHoves-Regular, TTHoves"
        fontWeight="400"
        color="#999999"
        lineHeight="16px"
      >
        {dataPerson.data?.address}
      </Text>
    </Flex>
    <Flex position="absolute" right="20px" top="240px">
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
