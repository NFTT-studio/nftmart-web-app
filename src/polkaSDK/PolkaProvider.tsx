import React, { useEffect, useState } from 'react';
import { Center, Spinner } from '@chakra-ui/react';
import { web3Enable, web3Accounts, web3FromSource } from '@polkadot/extension-dapp';
import { encodeAddress } from '@polkadot/util-crypto';

import { useLocalStorage } from 'react-use';
import { isEmpty } from 'lodash';
import PolkaSDK from '.';
import { LOGIN_LOCAL_STORAGE_KEY, SS58_FORMAT } from '../constants';
import {
  setAccount, setAccounts, setInjector, setWhiteList,
} from '../redux/chainSlice';
import { useAppDispatch } from '../hooks/redux';
import useWhiteList from '../hooks/reactQuery/useWhiteList';

interface Props {
  children: React.ReactNode;
}

const PolkaProvider = ({ children }: Props) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [value, setValue] = useLocalStorage<string>(LOGIN_LOCAL_STORAGE_KEY);
  const dispatch = useAppDispatch();
  const { data } = useWhiteList();

  useEffect(() => {
    const init = async () => {
      await PolkaSDK.init({
        ss58Format: SS58_FORMAT,
      });
      setIsInitialized(true);
      const allInjected = await web3Enable('NFTMart');
      if (allInjected.length > 0) {
        const web3InjectedAccounts = await web3Accounts();
        const InjectedAddressesIndex = web3InjectedAccounts.findIndex(
          (account) => encodeAddress(account.address, 12191) === value,
        );
        if (!isEmpty(value) && value && InjectedAddressesIndex > -1) {
          const loginAccount = web3InjectedAccounts[InjectedAddressesIndex];
          const injector = await web3FromSource(loginAccount.meta.source);
          // eslint-disable-next-line no-multi-assign
          loginAccount.address = encodeAddress(loginAccount.address, 12191);

          dispatch(setAccount(loginAccount));
          dispatch(setInjector(injector));
          dispatch(setAccounts(web3InjectedAccounts));
          setValue(loginAccount.address);
        }
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (data) {
      dispatch(setWhiteList(data));
    }
  }, [data, dispatch]);

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
