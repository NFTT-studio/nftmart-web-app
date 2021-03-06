import React, { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Flex,
  Box,
  Text,
  Image,
  Link,
} from '@chakra-ui/react';
import {
  IconPen,
} from '../../../assets/images';
import ShareAccount from '../../../components/ShareAccount';
import useIsLoginAddress from '../../../hooks/utils/useIsLoginAddress';
import { useAppSelector } from '../../../hooks/redux';

interface Props {
  userData?: [],
}
const Header: FC<Props> = (({ userData }) => {
  const formatAddress = (addr: string) => (addr ? `${addr?.slice(0, 4)}...${addr?.slice(-4)}` : '');
  const isPerson = useIsLoginAddress(userData?.address);
  const chainState = useAppSelector((state) => state.chain);
  const { account } = chainState;

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
          w="70%"
          fontSize="28px"
          fontFamily="TTHoves-Bold, TTHoves"
          fontWeight="bold"
          color="#191A24"
          lineHeight="33px"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {isPerson
            ? <>{userData?.name || account?.meta.name || formatAddress(userData?.address)}</>
            : <>{userData?.name || formatAddress(userData?.address)}</>}
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
          {userData?.address}
        </Text>
      </Flex>
      <Flex
        position="absolute"
        right="0px"
        top="0px"
        background="#FFFFFF"
      >
        {isPerson ? (
          <Link
            as={RouterLink}
            to="/account/profile/settings"
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
