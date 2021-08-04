import React, { Fragment } from 'react';
import { useLocation } from 'react-router-dom';

import {
  Box,
} from '@chakra-ui/react';
import NLink from '../Link';
import { statusArr } from '../../constants/Status';
import { useAppSelector } from '../../hooks/redux';
import useAccount from '../../hooks/reactQuery/useAccount';

const NavLink = () => {
  const location = useLocation();
  const chainState = useAppSelector((state) => state.chain);
  const { account } = chainState;

  const { data } = useAccount(account?.address);

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
      path: `/browsing?status=${statusArr[2]}`,
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
    //   title: 'common.nav.navActive',
    //   path: '/active',
    //   requiredLogin: false,
    //   requiredWhitelist: false,
    // },
    {
      title: 'common.nav.navCreate',
      path: data?.createdClassCount ? `/account/${account?.address}/wallet?id=3` : '/profile/collection/create',
      requiredLogin: true,
      requiredWhitelist: true,
    },
  ];
  let filteredNav = NAV_MAP;

  if (!account) {
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
              onClick={() => {
                if (nav.path === `/account/${account?.address}/wallet?id=3`) {
                  localStorage.setItem('ButtonSelect', '3');
                }
              }}
            />
            <Box
              w="16px"
              h="17px"
              borderTop="1px solid #999"
              transform="rotate(114deg)"
              display={index === NAV_MAP.length - 1 ? 'none' : ''}
            />
          </Fragment>
        );
      })}
    </>
  );
};

export default NavLink;
