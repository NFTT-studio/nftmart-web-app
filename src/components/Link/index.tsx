/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Link, HTMLChakraProps, LinkProps,
  Box,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowScroll } from 'react-use';

export interface NLinkProps extends HTMLChakraProps<'p'> {
  path: string;
  title: string;
  active?: boolean;
  bordered?: boolean;
  linkProps?: LinkProps;
}

const NLink: FC<NLinkProps> = (props) => {
  const location = useLocation();
  const { t } = useTranslation();
  const { y } = useWindowScroll();
  const {
    path, title, active = false, bordered = false, linkProps, ...restStyles
  } = props;

  const borderBottom = {
    content: '" "',
    height: '2px',
    width: '80%',
    position: 'absolute',
    backgroundColor: '#999999',
    left: '50%',
    bottom: -2,
    transform: 'translate(-50%, -50%)',
  };

  return (
    <>
      <Box
        fontSize="1rem"
        position="relative"
        {...restStyles}
        minWidth={title === 'common.nav.buynmt' ? '71px' : ''}
        display="flex"
        justifyContent="center"
      >
        {title === 'common.nav.buynmt'
          ? (
            <Link
              outline="none"
              target="_blank"
              key={title}
              href={path}
              color={location.pathname === '/' ? active ? `${y > 820 ? '#000000' : 'white'}` : '#999' : active ? '#000000' : '#999'}
              _after={active && bordered ? borderBottom : {}}
              _hover={{
                textDecoration: 'none',
                color: location.pathname === '/' ? y > 0 ? '#000000' : 'white' : '#000000',
              }}
              _focus={{
                border: 'none',
                textDecoration: 'none',
              }}
              {...linkProps}
              textAlign="center"
            >
              {t(title)}
            </Link>
          )
          : (
            <Link
              textAlign="center"
              outline="none"
              as={RouterLink}
              key={title}
              to={path}
              color={location.pathname === '/' ? active ? `${y > 820 ? '#000000' : 'white'}` : '#999' : active ? '#000000' : '#999'}
              _after={active && bordered ? borderBottom : {}}
              _hover={{
                textDecoration: 'none',
                color: location.pathname === '/' ? y > 0 ? '#000000' : 'white' : '#000000',
              }}
              _focus={{
                border: 'none',
                textDecoration: 'none',
              }}
              {...linkProps}
            >
              {t(title)}
            </Link>
          )}

      </Box>

    </>
  );
};

export default NLink;
