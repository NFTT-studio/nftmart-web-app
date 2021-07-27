import React, { useEffect } from 'react';
import { Center } from '@chakra-ui/react';
import Helmet from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { scrollTo } from '../../utils/ui';

interface Props {
  children: React.ReactNode;
  title: string;
}

const MainContainer = ({ children, title }: Props) => {
  const location = useLocation();

  useEffect(() => {
    scrollTo(0);
    return () => {
      // cleanup
    };
  }, [location?.pathname, location?.search]);
  return (
    <>
      <Helmet>
        {title && <title>{title}</title>}
        <link rel="canonical" href="../" />
      </Helmet>
      <Center
        as="main"
        width="1364px"
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
