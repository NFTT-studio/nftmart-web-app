import React, { useEffect } from 'react';
import {
  Flex,
  useMediaQuery,
} from '@chakra-ui/react';
import Helmet from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { scrollTo } from '../../utils/ui';

interface Props {
  children: React.ReactNode;
  title: string;
}

const MainContainer = ({ children, title }: Props) => {
  const location = useLocation();
  const [isLargerThan700] = useMediaQuery('(min-width: 700px)');

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
      {isLargerThan700 ? (
        <Flex
          as="main"
          height="100%"
          maxWidth="100vw"
          minHeight="100vh"
          w="100%"
          pt="80px"
          boxSizing="border-box"
          flexDirection="column"
          alignItems="center"
        >
          {children}
        </Flex>
      ) : (
        <Flex
          as="main"
          minHeight="100vh"
          height="100%"
          w="100%"
          pt="40px"
          boxSizing="border-box"
          flexDirection="column"
          alignItems="center"
        >
          {children}
        </Flex>
      )}
    </>
  );
};

export default MainContainer;
