/* eslint-disable max-len */
import React, { FC, useState, useEffect } from 'react';
import { Link as RouterLink, useHistory, useLocation } from 'react-router-dom';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Stack,
  Text,
  Flex,
  useToast,
  Link,
  Image,
  useClipboard,
  Box,
} from '@chakra-ui/react';
import Identicon from '@polkadot/react-identicon';

import { useTranslation } from 'react-i18next';
import {
  HeadPortrait,
  Address,
  Collections,
  Owned,
  Created,
  Balance,
  IoMdArrowDropdown,
  IoMdArrowDropup,
} from '../../assets/images';
import { statusArr } from '../../constants/Status';
import {
  PINATA_SERVER,
} from '../../constants';
import { renderNmtNumberText } from '../Balance';
import useUserTop from '../../hooks/reactQuery/useUserTop';
import { useAppSelector } from '../../hooks/redux';

export interface LoginProps {
  avatar?: string;
  address?: string;
}
const ICONS = {
  quickAreaOwned: Owned,
  quickAreaCreated: Collections,
  quickAreaCollections: Created,
};
const AccountPopover: FC<LoginProps> = ({ avatar, address = '' }) => {
  const chainState = useAppSelector((state) => state.chain);
  const formatAddress = (addr: string) => (addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : null);

  const { whiteList } = chainState;
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation();
  const [opening, setOpening] = useState(false);
  const [iswhiteList, setISWhiteList] = useState(false);
  const { onCopy } = useClipboard(address);
  const { data: userData, refetch: fetchUserData } = useUserTop(address);
  // const [hideMenu, setHideMenu] = useState(false);
  const toast = useToast();
  const handleCopy = () => {
    toast({
      title: 'success',
      status: 'success',
      position: 'top',
      duration: 3000,
      description: t('header.success'),
    });
    onCopy();
  };
  useEffect(() => {
    if (address && whiteList?.indexOf(address) > -1) {
      setISWhiteList(true);
    } else {
      setISWhiteList(false);
    }
    fetchUserData();
  }, [opening]);
  useEffect(() => {
    if (address && whiteList?.indexOf(address) > -1) {
      setISWhiteList(true);
    } else {
      setISWhiteList(false);
    }
    fetchUserData();
  }, [address]);

  return (
    <Popover
      placement="bottom"
      size="sm"
      variant="menu"
      // trigger="hover"
      isOpen={opening}
      onOpen={() => setOpening(true)}
      onClose={() => setOpening(false)}
    >
      <PopoverTrigger>
        <Stack direction="row" cursor="pointer" alignItems="center" spacing={0}>
          {userData?.avatar ? (
            <Image
              ml="40px"
              mr="8px"
              display="block"
              width="32px"
              height="32px"
              borderRadius="50%"
              src={`${PINATA_SERVER}user/${userData?.avatar}` || HeadPortrait.default}
            />
          ) : (
            <Identicon
              className="headerAvatar"
              value={address}
            />
          )}

          <Text
            maxWidth="200px"
            width="100%"
            fontSize="16px"
            fontFamily="PingFangSC-Medium, PingFang SC"
            fontWeight="500"
            color="#999999"
            pr="3px"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {userData?.name || avatar || formatAddress(address)}
          </Text>
          {opening ? (
            <Image
              width="12px"
              height="12px"
              src={IoMdArrowDropup.default}
            />
          ) : (
            <Image
              width="12px"
              height="12px"
              src={IoMdArrowDropdown.default}
            />
          )}
        </Stack>
      </PopoverTrigger>
      {/* TODO: Move focus property else where to have common use */}
      <PopoverContent
        width="372px"
        mt="12px"
        _focus={{ boxShadow: 'none' }}
        outline="none"
        position="absolute"
        right="-79px"
        boxShadow="0px 0px 6px 0px rgba(0, 0, 0, 0.16)"
      >
        <PopoverArrow left="121px !important" />
        <PopoverBody display="flex" flexFlow="wrap" justifyContent="center" p="20px 0">
          <Flex
            width="100%"
            height="48px"
            justifyContent="space-between"
            alignItems="center"
            p="0 20px"
          >
            <Flex width="100%" justifyContent="space-between">
              <Flex width="100%" justifyContent="flex-start" alignItems="center">
                <Image
                  width="14px"
                  height="auto"
                  mr="9px"
                  src={Balance.default}
                />
                <Text
                  fontSize="14px"
                  fontFamily="PingFangSC-Regular, PingFang SC"
                  fontWeight="blod"
                  color="#191A24"
                >
                  {t('common.balance')}
                </Text>
              </Flex>
              <Box
                fontSize="14px"
                fontFamily="PingFangSC-Regular, PingFang SC"
                fontWeight="400"
                color="#191A24"
              >
                {userData ? renderNmtNumberText(userData?.balance?.total) : 0}
              </Box>
            </Flex>
            <Text
              width="47px"
              textAlign="right"
              ml="12px"
              fontSize="16px"
              fontFamily="PingFangSC-Medium, PingFang SC"
              fontWeight="500"
              color="#858999"
            >
              NMT
            </Text>
          </Flex>
          {Number(userData?.balance?.reserved)
            || Number(userData?.balance?.bonded)
            || Number(userData?.balance?.locked)
            ? (
              <Flex
                width="100%"
                height="16px"
                justifyContent="space-between"
                alignItems="center"
                p="0 20px"
              >
                <Flex width="100%" justifyContent="space-between">
                  <Flex width="100%" justifyContent="flex-start" alignItems="center">
                    <Text
                      ml="22px"
                      fontSize="14px"
                      fontFamily="PingFangSC-Regular, PingFang SC"
                      fontWeight="blod"
                      color="#999999"
                    >
                      {t('Account.transferrable')}
                    </Text>
                  </Flex>
                  <Box
                    fontSize="14px"
                    fontFamily="PingFangSC-Regular, PingFang SC"
                    fontWeight="400"
                    color="#999999"
                  >
                    {userData && renderNmtNumberText(userData?.balance?.transferrable)}
                  </Box>
                </Flex>
                <Text
                  width="47px"
                  textAlign="right"
                  ml="12px"
                  fontSize="16px"
                  fontFamily="PingFangSC-Medium, PingFang SC"
                  fontWeight="500"
                  color="#999999"
                >
                  NMT
                </Text>
              </Flex>
            ) : null}
          {Number(userData?.balance?.reserved)
            ? (
              <Flex
                width="100%"
                height="16px"
                justifyContent="space-between"
                alignItems="center"
                p="0 20px"
              >
                <Flex width="100%" justifyContent="space-between">
                  <Flex width="100%" justifyContent="flex-start" alignItems="center">
                    <Text
                      ml="22px"
                      fontSize="14px"
                      fontFamily="PingFangSC-Regular, PingFang SC"
                      fontWeight="blod"
                      color="#999999"
                    >
                      {t('Account.reserved')}
                    </Text>
                  </Flex>
                  <Box
                    fontSize="14px"
                    fontFamily="PingFangSC-Regular, PingFang SC"
                    fontWeight="400"
                    color="#999999"
                  >
                    {userData && renderNmtNumberText(userData?.balance?.reserved)}
                  </Box>
                </Flex>
                <Text
                  width="47px"
                  textAlign="right"
                  ml="12px"
                  fontSize="16px"
                  fontFamily="PingFangSC-Medium, PingFang SC"
                  fontWeight="500"
                  color="#999999"
                >
                  NMT
                </Text>
              </Flex>
            )
            : null}
          {Number(userData?.balance?.locked)
            ? (
              <Flex
                width="100%"
                height="16px"
                justifyContent="space-between"
                alignItems="center"
                p="0 20px"
              >
                <Flex width="100%" justifyContent="space-between">
                  <Flex width="100%" justifyContent="flex-start" alignItems="center">
                    <Text
                      ml="22px"
                      fontSize="14px"
                      fontFamily="PingFangSC-Regular, PingFang SC"
                      fontWeight="blod"
                      color="#999999"
                    >
                      {t('Account.locked')}
                    </Text>
                  </Flex>
                  <Box
                    fontSize="14px"
                    fontFamily="PingFangSC-Regular, PingFang SC"
                    fontWeight="400"
                    color="#999999"
                  >
                    {userData && renderNmtNumberText(userData?.balance?.locked)}
                  </Box>
                </Flex>
                <Text
                  width="47px"
                  textAlign="right"
                  ml="12px"
                  fontSize="16px"
                  fontFamily="PingFangSC-Medium, PingFang SC"
                  fontWeight="500"
                  color="#999999"
                >
                  NMT
                </Text>
              </Flex>
            ) : null}
          {Number(userData?.balance?.bonded)
            ? (
              <Flex
                width="100%"
                height="16px"
                justifyContent="space-between"
                alignItems="center"
                p="0 20px"
              >
                <Flex width="100%" justifyContent="space-between">
                  <Flex width="100%" justifyContent="flex-start" alignItems="center">
                    <Text
                      ml="22px"
                      fontSize="14px"
                      fontFamily="PingFangSC-Regular, PingFang SC"
                      fontWeight="blod"
                      color="#999999"
                    >
                      {t('Account.bonded')}
                    </Text>
                  </Flex>
                  <Box
                    fontSize="14px"
                    fontFamily="PingFangSC-Regular, PingFang SC"
                    fontWeight="400"
                    color="#999999"
                  >
                    {userData && renderNmtNumberText(userData?.balance?.bonded)}
                  </Box>
                </Flex>
                <Text
                  width="47px"
                  textAlign="right"
                  ml="12px"
                  fontSize="16px"
                  fontFamily="PingFangSC-Medium, PingFang SC"
                  fontWeight="500"
                  color="#999999"
                >
                  NMT
                </Text>
              </Flex>
            )
            : null}

          <Flex
            cursor="pointer"
            width="100%"
            height="48px"
            justifyContent="space-between"
            alignItems="center"
            p="0 20px"
            _hover={{
              background: '#F9F9F9',
            }}
          >
            <Flex
              width="100%"
              justifyContent="space-between"
              onClick={() => {
                history.push('/account/owned');
                setOpening(false);
              }}
            >
              <Flex width="100%" justifyContent="flex-start" alignItems="center">
                <Image
                  width="14px"
                  height="auto"
                  mr="9px"
                  src={ICONS.quickAreaOwned.default}
                />
                <Text
                  fontSize="14px"
                  fontFamily="PingFangSC-Regular, PingFang SC"
                  fontWeight="blod"
                  color="#191A24"
                >
                  {t('header.quickArea.owned')}
                </Text>
              </Flex>
              <Text
                fontSize="14px"
                fontFamily="PingFangSC-Regular, PingFang SC"
                fontWeight="400"
                color="#858999"
              >
                {userData?.ownerNftscount}
              </Text>
            </Flex>
            <Link
              as={RouterLink}
              to={`/browsing?status=${statusArr[0]}`}
              width="47px"
              textAlign="right"
              ml="12px"
              fontSize="16px"
              fontFamily="PingFangSC-Medium, PingFang SC"
              fontWeight="500"
              color="#5C74FF"
              _hover={{
                textDecoration: 'none',
              }}
              _focus={{
                border: 'none',
                textDecoration: 'none',
              }}
              onClick={() => { setOpening(false); }}
            >
              {t('common.buy')}
            </Link>
          </Flex>
          {iswhiteList ? (
            <Flex
              cursor="pointer"
              width="100%"
              height="48px"
              justifyContent="space-between"
              alignItems="center"
              p="0 20px"
              _hover={{
                background: '#F9F9F9',
              }}
            >
              <Flex
                width="100%"
                justifyContent="space-between"
                onClick={() => {
                  history.push('/account/created');
                  setOpening(false);
                }}
              >
                <Flex width="100%" justifyContent="flex-start" alignItems="center">
                  <Image
                    width="14px"
                    height="auto"
                    mr="9px"
                    src={ICONS.quickAreaCreated.default}
                  />
                  <Text
                    fontSize="14px"
                    fontFamily="PingFangSC-Regular, PingFang SC"
                    fontWeight="blod"
                    color="#191A24"
                  >
                    {t('header.quickArea.created')}
                  </Text>
                </Flex>
                <Text
                  fontSize="14px"
                  fontFamily="PingFangSC-Regular, PingFang SC"
                  fontWeight="400"
                  color="#858999"
                >
                  {userData?.createdNftCount}
                </Text>
              </Flex>
              <Link
                as={RouterLink}
                to="/account/created"
                width="47px"
                textAlign="right"
                ml="12px"
                fontSize="16px"
                fontFamily="PingFangSC-Medium, PingFang SC"
                fontWeight="500"
                color="#5C74FF"
                _hover={{
                  textDecoration: 'none',
                }}
                _focus={{
                  border: 'none',
                  textDecoration: 'none',
                }}
                onClick={() => { setOpening(false); }}
              >
                {t('common.add')}
              </Link>
            </Flex>
          )
            : null}
          {iswhiteList ? (
            <Flex
              cursor="pointer"
              width="100%"
              height="48px"
              justifyContent="space-between"
              alignItems="center"
              p="0 20px"
              _hover={{
                background: '#F9F9F9',
              }}
            >
              <Flex
                width="100%"
                justifyContent="space-between"
                onClick={() => {
                  history.push('/account/collections'); setOpening(false);
                }}
              >
                <Flex width="100%" justifyContent="flex-start" alignItems="center">
                  <Image
                    width="14px"
                    height="auto"
                    mr="9px"
                    src={ICONS.quickAreaCollections.default}
                  />
                  <Text
                    fontSize="14px"
                    fontFamily="PingFangSC-Regular, PingFang SC"
                    fontWeight="blod"
                    color="#191A24"
                  >
                    {t('header.quickArea.collections')}
                  </Text>
                </Flex>
                <Text
                  fontSize="14px"
                  fontFamily="PingFangSC-Regular, PingFang SC"
                  fontWeight="400"
                  color="#858999"
                >
                  {userData?.createdClassCount}
                </Text>
              </Flex>
              <Link
                as={RouterLink}
                to="/account/collections"
                width="47px"
                textAlign="right"
                ml="12px"
                fontSize="16px"
                fontFamily="PingFangSC-Medium, PingFang SC"
                fontWeight="500"
                color="#5C74FF"
                _hover={{
                  textDecoration: 'none',
                }}
                _focus={{
                  border: 'none',
                  textDecoration: 'none',
                }}
                onClick={() => { setOpening(false); localStorage.setItem('ButtonSelect', '4'); }}
              >
                {t('common.add')}
              </Link>
            </Flex>
          )
            : null}

          <Flex width="100%" height="48px" justifyContent="space-between" alignItems="center" p="0 20px">
            <Flex width="100%" justifyContent="space-between">
              <Flex justifyContent="flex-start" alignItems="center">
                <Image
                  width="14px"
                  height="14px"
                  mr="9px"
                  src={Address.default}
                />
                <Text
                  fontSize="14px"
                  fontFamily="PingFangSC-Regular, PingFang SC"
                  fontWeight="blod"
                  color="#191A24"
                >
                  {t('common.address')}
                </Text>

              </Flex>

              <Link
                href={`https://scan.nftmart.io/mainnet/account/${address}`}
                isExternal
                ml="40px"
                fontSize="16px"
                fontFamily="PingFangSC-Medium, PingFang SC"
                fontWeight="500"
                color="#5C74FF"
                _hover={{
                  textDecoration: 'none',
                }}
                _focus={{
                  border: 'none',
                  textDecoration: 'none',
                }}
                open
              >
                {t('header.viewInScan')}
              </Link>
            </Flex>
          </Flex>

          <Flex
            width="332px"
            flexFlow="wrap"
            justifyContent="flex-start"
            alignItems="center"
            background="#F8F8F9"
            borderRadius="2px"
            p="10px"
          >
            <Text
              width="312px"
              fontSize="12px"
              fontFamily="PingFangSC-Regular, PingFang SC"
              fontWeight="400"
              color="#858999"
            >
              {address}
            </Text>
            <Text
              mt="4px"
              fontSize="12px"
              fontFamily="PingFangSC-Regular, PingFang SC"
              fontWeight="400"
              color="#5C74FF"
              cursor="pointer"
              onClick={() => handleCopy()}
            >
              {t('header.clickToCopy')}
            </Text>
          </Flex>
          <Link
            w="100%"
            textAlign="center"
            mt="10px"
            fontSize="13px"
            fontFamily="PingFangSC-Regular, PingFang SC"
            fontWeight="400"
            color="#5C74FF"
            cursor="pointer"
            as={RouterLink}
            to={`/connect?callbackUrl=${encodeURIComponent(location.pathname + location.search)}`}
            onClick={() => setOpening(false)}
          >
            {t('header.switchAccounts')}
          </Link>

        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default AccountPopover;
