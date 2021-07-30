import React, { FC, useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Stack,
  Portal,
  Text,
  Flex,
  useToast,
  Link,
  Image,
  useClipboard,
} from '@chakra-ui/react';

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
import { EXPLORER_URL } from '../../constants';
import useAccount from '../../hooks/reactQuery/useAccount';
import { renderBalanceText } from '../Balance';

export interface LoginProps {
  avatar?: string;
  address?: string;
}
const ICONS = {
  quickAreaOwned: Owned,
  quickAreaCreated: Collections,
  quickAreaCollections: Created,
};
const AccountPopover: FC<LoginProps> = ({ avatar, address = 'no name' }) => {
  const { data } = useAccount(address);
  const history = useHistory();
  const { t } = useTranslation();
  const [opening, setOpening] = useState(false);
  const { onCopy } = useClipboard(address);
  // const [hideMenu, setHideMenu] = useState(false);
  const toast = useToast();
  const handleCopy = () => {
    toast({
      title: 'success',
      status: 'success',
      position: 'top',
      duration: 3000,
      description: t('copy.success'),
    });
    onCopy();
  };

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
          <Image
            ml="40px"
            display="block"
            width="32px"
            height="32px"
            mr="8px"
            src={HeadPortrait.default}
          />
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
            {avatar}
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
      <Portal>
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
                    height="14px"
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
                <Text
                  fontSize="14px"
                  fontFamily="PingFangSC-Regular, PingFang SC"
                  fontWeight="400"
                  color="#191A24"
                >
                  {data && renderBalanceText(`${data?.balance?.balance} NMT`)}
                </Text>
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
            {Number(data?.balance?.reserved)
            || Number(data?.balance?.bonded)
            || Number(data?.balance?.locked)
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
                    <Text
                      fontSize="14px"
                      fontFamily="PingFangSC-Regular, PingFang SC"
                      fontWeight="400"
                      color="#999999"
                    >
                      {data && renderBalanceText(`${data?.balance?.transferrable} NMT`) }
                    </Text>
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
            {Number(data?.balance?.reserved)
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
                    <Text
                      fontSize="14px"
                      fontFamily="PingFangSC-Regular, PingFang SC"
                      fontWeight="400"
                      color="#999999"
                    >
                      {data && renderBalanceText(`${data?.balance.reserved} NMT`)}
                    </Text>
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
            {Number(data?.balance?.locked)
              ? (
                <Flex
                  m="10px 0"
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
                        {t('Account.loched')}
                      </Text>
                    </Flex>
                    <Text
                      fontSize="14px"
                      fontFamily="PingFangSC-Regular, PingFang SC"
                      fontWeight="400"
                      color="#999999"
                    >
                      {data && renderBalanceText(`${data?.balance.locked} NMT`)}
                    </Text>
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
            {Number(data?.balance?.bonded)
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
                    <Text
                      fontSize="14px"
                      fontFamily="PingFangSC-Regular, PingFang SC"
                      fontWeight="400"
                      color="#999999"
                    >
                      {data && renderBalanceText(`${data?.balance.bonded} NMT`)}
                    </Text>
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
                onClick={() => { history.push(`/account/${address}/wallet?id=0`); setOpening(false); }}
              >
                <Flex width="100%" justifyContent="flex-start" alignItems="center">
                  <Image
                    width="14px"
                    height="14px"
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
                  {data?.ownerNftscount}
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
                onClick={() => { history.push(`/account/${address}/wallet?id=1`); setOpening(false); }}
              >
                <Flex width="100%" justifyContent="flex-start" alignItems="center">
                  <Image
                    width="14px"
                    height="14px"
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
                  {data?.createdNftCount}
                </Text>
              </Flex>
              <Link
                as={RouterLink}
                to={`/account/${address}/wallet?id=1`}
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
                onClick={() => { history.push(`/account/${address}/wallet?id=2`); setOpening(false); }}
              >
                <Flex width="100%" justifyContent="flex-start" alignItems="center">
                  <Image
                    width="14px"
                    height="14px"
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
                  {data?.createdClassCount}
                </Text>
              </Flex>
              <Link
                as={RouterLink}
                to={`/account/${data?.address}/wallet?id=2`}
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
                  href={`${EXPLORER_URL}`}
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
              to="/connect"
              onClick={() => setOpening(false)}
            >
              {t('header.switchAccounts')}
            </Link>

          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default AccountPopover;
