import React, { FC, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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

  const { t } = useTranslation();
  const [opening, setOpening] = useState(false);
  const [copyshow, oncopyshow] = useState(true);
  const { hasCopied, onCopy } = useClipboard(address);
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
      trigger="hover"
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
            fontSize="16px"
            fontFamily="PingFangSC-Medium, PingFang SC"
            fontWeight="500"
            color="#191A24"
            pr="3px"
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
          mt="12px"
          width="372px"
          _focus={{ boxShadow: 'none' }}
          outline="none"
          position="relative"
          right="110px"
          boxShadow="0px 0px 6px 0px rgba(0, 0, 0, 0.16)"
        >
          <PopoverArrow left="121px !important" />
          <PopoverBody display="flex" flexFlow="wrap" p="20px">

            <Flex width="100%" height="48px" justifyContent="space-between" alignItems="center">
              <Flex width="100%" justifyContent="space-between" mr="31px">
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
                    {t('Balance')}
                  </Text>
                </Flex>
                <Text
                  fontSize="14px"
                  fontFamily="PingFangSC-Regular, PingFang SC"
                  fontWeight="400"
                  color="#858999"
                >
                  {data && renderBalanceText(data!.balance.free)}
                </Text>
              </Flex>
              <Text
                width="47px"
                textAlign="right"
                ml="32px"
                fontSize="16px"
                fontFamily="PingFangSC-Medium, PingFang SC"
                fontWeight="500"
                color="#858999"
              >
                {/* NMT */}
              </Text>
            </Flex>

            <Flex width="100%" height="48px" justifyContent="space-between" alignItems="center">
              <Flex width="100%" justifyContent="space-between" mr="31px">
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
                    {t('quickAreaOwned')}
                  </Text>
                </Flex>
                <Text
                  fontSize="14px"
                  fontFamily="PingFangSC-Regular, PingFang SC"
                  fontWeight="400"
                  color="#858999"
                >
                  {data!.ownerNftscount}
                </Text>
              </Flex>
              <Link
                as={RouterLink}
                to={`/browsing?status=${statusArr[0]}`}
                width="47px"
                textAlign="right"
                ml="34px"
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
              >
                {t('Buy')}
              </Link>
            </Flex>

            <Flex width="100%" height="48px" justifyContent="space-between" alignItems="center">
              <Flex width="100%" justifyContent="space-between" mr="31px">
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
                    {t('quickAreaCreated')}
                  </Text>
                </Flex>
                <Text
                  fontSize="14px"
                  fontFamily="PingFangSC-Regular, PingFang SC"
                  fontWeight="400"
                  color="#858999"
                >
                  {data!.createdNftCount}
                </Text>
              </Flex>
              <Link
                as={RouterLink}
                to={`/account/${address}/wallet`}
                width="47px"
                textAlign="right"
                ml="34px"
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
              >
                {t('Add')}
              </Link>
            </Flex>

            <Flex width="100%" height="48px" justifyContent="space-between" alignItems="center">
              <Flex width="100%" justifyContent="space-between" mr="31px">
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
                    {t('quickAreaCollections')}
                  </Text>
                </Flex>
                <Text
                  fontSize="14px"
                  fontFamily="PingFangSC-Regular, PingFang SC"
                  fontWeight="400"
                  color="#858999"
                >
                  {data!.createdClassCount}
                </Text>
              </Flex>
              <Link
                as={RouterLink}
                to={`/account/${data!.address}/wallet?id=1`}
                width="47px"
                textAlign="right"
                ml="34px"
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
              >
                {t('Add')}
              </Link>
            </Flex>

            <Flex width="100%" height="48px" justifyContent="space-between" alignItems="center">
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
                    {t('Address')}
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
                  {t('ViewInScan')}
                </Link>
              </Flex>
            </Flex>
            {copyshow ? (
              <Flex
                p="10px"
                width="332px"
                flexFlow="wrap"
                justifyContent="flex-start"
                alignItems="center"
                background="#F8F8F9"
                borderRadius="2px"
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
                  onClick={() => handleCopy()}
                >
                  {t('ClickToCopy')}
                </Text>
              </Flex>
            ) : ''}

          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default AccountPopover;
