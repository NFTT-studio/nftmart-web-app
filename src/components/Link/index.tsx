import { Link as RouterLink } from 'react-router-dom';
import {
  Text, Link, HTMLChakraProps, LinkProps,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

export interface NLinkProps extends HTMLChakraProps<'p'> {
  path: string;
  title: string;
  active?: boolean;
  bordered?: boolean;
  linkProps?: LinkProps;
}

const NLink: FC<NLinkProps> = (props) => {
  const { t } = useTranslation();
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
      <Text
        fontSize={16}
        position="relative"
        {...restStyles}
      >
        <Link
          outline="none"
          as={RouterLink}
          key={title}
          to={path}
          color={active ? '#000000' : '#999'}
          _after={active && bordered ? borderBottom : {}}
          _hover={{
            textDecoration: 'none',
            color: '#000000',
          }}
          _focus={{
            border: 'none',
            textDecoration: 'none',
          }}
          {...linkProps}
        >
          {t(title)}
        </Link>
      </Text>

    </>
  );
};

export default NLink;
