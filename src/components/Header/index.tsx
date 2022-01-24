/* eslint-disable no-nested-ternary */
import React, { FC, useState } from 'react';
import { Link as RouterLink, useHistory, useLocation } from 'react-router-dom';
import {
  Container, Flex,
  Button, Image, useMediaQuery,
  Drawer,
  DrawerContent,
  DrawerBody,
  Text,
  Link,
} from '@chakra-ui/react';

import { useTranslation } from 'react-i18next';

import { useWindowScroll } from 'react-use';
import NavLink from '../Navlink';
import AccountPopover from '../AccountPopover';
import ChangeLanguage from '../ChangeLanguage';
// import Network from '../Network';

import {
  LogoSrc,
  LogoWhite,
} from '../../assets/images';
import {
  logoH5,
  meau,
} from '../../assets/imagesH5';
import { Z_INDEXES } from '../../constants';
import { useAppSelector } from '../../hooks/redux';
import { statusArr } from '../../constants/Status';
// import useWhiteList from '../../hooks/reactQuery/useWhiteList';
// import { setWhiteList } from '../../redux/chainSlice';

export interface HeaderProps {
  sticky?: boolean;
}

const Header: FC<HeaderProps> = () => {
  const [isLargerThan700] = useMediaQuery('(min-width: 700px)');
  const history = useHistory();
  const location = useLocation();
  const { y } = useWindowScroll();
  const [opening, setOpening] = useState(false);

  const chainState = useAppSelector((state) => state.chain);
  const { t } = useTranslation();
  const { account } = chainState;
  const { i18n } = useTranslation();
  const NAV_MAP = [
    {
      title: 'common.nav.navHome',
      path: '/',
      requiredLogin: false,
      requiredWhitelist: false,
    },
    {
      title: 'common.nav.navBrowsing',
      path: '/browsing',
      requiredLogin: false,
      requiredWhitelist: false,
    },
    {
      title: 'common.nav.navListSale',
      path: `/browsing?status=${statusArr[0]}`,
      requiredLogin: false,
      requiredWhitelist: false,
    },
    {
      title: 'common.nav.navAuction',
      path: `/browsing?status=${statusArr[1]}`,
      requiredLogin: false,
      requiredWhitelist: false,
    },
    // {
    //   title: 'common.nav.Artist',
    //   path: '/artist',
    //   requiredLogin: false,
    //   requiredWhitelist: false,
    // },
    {
      title: 'common.nav.buynmt',
      path: i18n.language === 'zh' ? 'https://www.gate.io/cn/trade/NMT_USDT' : 'https://www.gate.io/en/trade/NMT_USDT',
      requiredLogin: false,
      requiredWhitelist: false,
    },
  ];

  return (
    <>
      {isLargerThan700
        ? (
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
              p={location.pathname === '/' ? '0 0' : '0 50px'}
              w="100%"
              maxWidth={location.pathname === '/' ? '1364px' : '100%'}
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
              {/* <Network /> */}
              <Flex ml="32px" flex="1 1 auto">
                <NavLink address={account?.address} />
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
        ) : (
          <Flex
            as="header"
            flex={1}
            justify="space-between"
            backgroundColor="#000000"
            boxShadow="md"
            height="40px"
            width="100%"
            // Sticky UI
            position="fixed"
            top={0}
            left={0}
            right={0}
            zIndex={Z_INDEXES.header}
            p="0 15px"
            borderBottom="0.5px solid #4D4D4D"
            boxSizing="border-box"
          >
            <Flex
              height="40px"
              width="100%"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              boxSizing="border-box"
            >
              <Image height="30px" width="auto" src={logoH5.default} objectFit="contain" />
              <Text
                fontFamily="PingFangSC-Semibold, PingFang SC"
                fontWeight="600"
                color="#F4F4F4"
                fontSize="16px"
              >
                NFTMart
              </Text>
              <Flex justifyContent="flex-end">
                <Image
                  onClick={() => setOpening(true)}
                  height="20px"
                  width="20px"
                  src={meau.default}
                  objectFit="contain"
                />
              </Flex>
            </Flex>
            <Drawer
              isOpen={opening}
              placement="right"
              onClose={() => setOpening(false)}
              size="lg"
            >
              <DrawerContent
                marginTop="40px"
                background="#000000"
                height="151px"
              >
                <DrawerBody
                  p="0px"
                >
                  {NAV_MAP.map((item, index) => (
                    <>
                      {
                        item.title === 'common.nav.buynmt'
                          ? (
                            <Link
                              width="100%"
                              height="30px"
                              cursor="pointer"
                              target="_blank"
                              href={item.path}
                              key={item.title}
                              borderBottom={index === 5 ? '' : '0.5px solid #4D4D4D'}
                              p="0 25px"
                              display="flex"
                              flexDirection="row"
                              justifyContent="space-between"
                              alignItems="center"
                              onClick={() => setOpening(false)}
                            >
                              <Text
                                fontFamily="PingFangSC-Semibold, PingFang SC"
                                fontWeight="600"
                                color="#F4F4F4"
                                fontSize="10.5px"
                              >
                                {t(`${item.title}`)}
                              </Text>
                            </Link>
                          )
                          : (
                            <Link
                              width="100%"
                              height="30px"
                              cursor="pointer"
                              as={RouterLink}
                              to={item.path}
                              key={item.title}
                              borderBottom={index === 5 ? '' : '0.5px solid #4D4D4D'}
                              p="0 25px"
                              display="flex"
                              flexDirection="row"
                              justifyContent="space-between"
                              alignItems="center"
                              onClick={() => setOpening(false)}
                            >
                              <Text
                                fontFamily="PingFangSC-Semibold, PingFang SC"
                                fontWeight="600"
                                color="#F4F4F4"
                                fontSize="10.5px"
                              >
                                {t(`${item.title}`)}
                              </Text>
                            </Link>
                          )
                      }
                    </>
                  ))}
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </Flex>
        )}
    </>
  );
};

export default Header;
