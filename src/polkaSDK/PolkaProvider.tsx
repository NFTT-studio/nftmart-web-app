import React, { useEffect, useState } from 'react';
import { Center, Spinner } from '@chakra-ui/react';

import PolkaSDK from '.';
import { SS58_FORMAT } from '../constants';

interface Props {
  children: React.ReactNode;
}

const PolkaProvider = ({ children }: Props) => {
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    const init = async () => {
      await PolkaSDK.init({
        ss58Format: SS58_FORMAT,
      });
      setIsInitialized(true);
    };
    init();
  }, []);

  return (
    <>
      {isInitialized ? (
        children
      ) : (
        <Center height="100vh">
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        </Center>
      )}
    </>
  );
};

export default PolkaProvider;
