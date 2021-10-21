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
import ShareAccount from '../../../components/ShareAccount';
import useIsLoginAddress from '../../../hooks/utils/useIsLoginAddress';

interface Props {
  userData?: [],
  dataPerson?: []
}
const Header: FC<Props> = (({ userData, dataPerson }) => {
  const formatAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  const isPerson = useIsLoginAddress(userData?.address);

  return (
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
          {userData?.name || formatAddress(dataPerson.data?.address)}
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
        {isPerson ? (
          <Link
            as={RouterLink}
            to="/profile"
          >
            <Box
              key="index"
              width="40px"
              height="40px"
              borderRadius="4px 0px 0px 4px"
              border={isPerson ? '1px solid #E5E5E5' : ''}
              borderRight={!isPerson ? '1px solid #E5E5E5' : ''}
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
        ) : (
          <Box
            height="40px"
            borderRadius="4px 0px 0px 4px"
            borderRight={!isPerson ? '1px solid #E5E5E5' : ''}
          />
        )}
        <ShareAccount />
      </Flex>
    </Flex>
  );
});

export default Header;
