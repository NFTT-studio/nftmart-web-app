/* eslint-disable no-nested-ternary */
import React, { FC, useEffect } from 'react';
import {
  Container, Flex, Button, Image,
} from '@chakra-ui/react';

import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

import { useWindowScroll } from 'react-use';
import NavLink from '../Navlink';
import AccountPopover from '../AccountPopover';
import ChangeLanguage from '../ChangeLanguage';
import Network from '../Network';

import {
  LogoSrc,
  LogoWhite,
} from '../../assets/images';
import { Z_INDEXES } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import useWhiteList from '../../hooks/reactQuery/useWhiteList';
import { setWhiteList } from '../../redux/chainSlice';

export interface HeaderProps {
  sticky?: boolean;
}

const Header: FC<HeaderProps> = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { y } = useWindowScroll();

  const chainState = useAppSelector((state) => state.chain);
  const { t } = useTranslation();
  const { account } = chainState;

  const { data } = useWhiteList();

  useEffect(() => {
    if (data) {
      dispatch(setWhiteList(data));
    }
  }, [data, dispatch]);

  return (
    <Flex
      as="header"
      justify="space-between"
      backgroundColor={location.pathname === '/' ? y > 820 ? 'white' : 'black' : 'white'}
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={Z_INDEXES.header}
      borderBottom="1px solid #999999"
      transition="background-color 1s"
    >
      <Container
        py={2}
        maxW={1364}
        height="80px"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Flex
          justify="center"
          mr="10px"
          onClick={() => {
            history.push('/');
          }}
        >
          <Image
            display="block"
            width="158px"
            height="auto"
            src={location.pathname === '/' ? y > 820 ? LogoSrc.default : LogoWhite.default : LogoSrc.default}
          />
        </Flex>
        <Network />
        <Flex ml="32px" flex="1 1 auto">
          <NavLink />
        </Flex>
        <ChangeLanguage />
        <Flex>
          {account ? (
            <Flex
              flex="1 1 auto"
              justifyContent="flex-end"
              alignItems="center"
              height="55px"
              mr={4}
            >
              <AccountPopover
                address={account.address}
                avatar={account.meta.name}
              />
            </Flex>
          ) : (
            <Flex>
              <Button
                as="a"
                variant="ghost"
                ml="20px"
                width="107px"
                height="40px"
                fontFamily="PingFangSC-Semibold, PingFang SC"
                fontWeight="600"
                borderRadius="20px"
                color="#999999"
                fontSize="16px"
                border="1px solid #999999"
                onClick={() => {
                  history.push('/connect');
                }}
              >
                {t('common.login')}
              </Button>
            </Flex>
          )}
        </Flex>
      </Container>
    </Flex>
  );
};

export default Header;
