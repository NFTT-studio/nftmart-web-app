import React, { useEffect } from 'react';
import { Center } from '@chakra-ui/react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { scrollTo } from '../../utils/ui';

interface Props {
  children: React.ReactNode;
  title: string;
}

const MainContainer = ({ children, title }: Props) => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    scrollTo(0);
    return () => {
      // cleanup
    };
  }, [location?.pathname, location?.search]);
  return (
    <>
      <Helmet>{title && <title>{title}</title>}</Helmet>
      <Center
        as="main"
        maxWidth="1360px"
        width="100%"
        minHeight="100%"
        pt="80px"
        boxSizing="border-box"
        flexDirection="column"
      >
        {children}
      </Center>
    </>
  );
};

export default MainContainer;
