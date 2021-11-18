import React, { FC, Fragment } from 'react';
import { useLocation } from 'react-router-dom';

import {
  Box,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from 'react-use';
import NLink from '../Link';
import { statusArr } from '../../constants/Status';
import { useAppSelector } from '../../hooks/redux';
import useAccount from '../../hooks/reactQuery/useAccount';

export interface NavLinkProps {
  address: string;
}

const NavLink: FC<NavLinkProps> = ({ address }) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const [userAddress] = useLocalStorage<string>('LOGIN_ADDRESS');
  const chainState = useAppSelector((state) => state.chain);
  const { account, whiteList } = chainState;

  const { data } = useAccount(address || userAddress);

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
    {
      title: 'common.nav.buynmt',
      path: i18n.language === 'zh' ? 'https://www.gate.io/cn/trade/NMT_USDT' : 'https://www.gate.io/en/trade/NMT_USDT',
      requiredLogin: false,
      requiredWhitelist: false,
    },
    {
      title: 'common.nav.navCreate',
      path: data?.createdClassCount ? '/account/collections'
        : '/account/collections/create',
      requiredLogin: true,
      requiredWhitelist: true,
    },
  ];
  let filteredNav = NAV_MAP;

  if (account && whiteList?.indexOf(account?.address) < 0) {
    filteredNav = NAV_MAP.filter((nav) => nav.requiredLogin === false);
  }

  return (
    <>
      {filteredNav.map((nav, index) => {
        const routePath = location.pathname + location.search;
        const active = routePath === nav.path;
        return (
          <Fragment key={nav.title}>
            <NLink
              border="0"
              outline="none"
              title={nav.title}
              path={nav.path}
              active={active}
              bgSize="cover"
              fontWeight="bold"
              marginRight="8px"
              marginLeft="28px"
              bordered
            />
            <Box
              w="16px"
              h="17px"
              borderTop="1px solid #999"
              transform="rotate(114deg)"
              display={index === filteredNav.length - 1 ? 'none' : ''}
            />
          </Fragment>
        );
      })}
    </>
  );
};

export default NavLink;
