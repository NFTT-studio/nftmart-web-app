import React, { useEffect, useState } from 'react';
import { Center, Spinner } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { web3Enable, web3Accounts, web3FromSource } from '@polkadot/extension-dapp';
import { encodeAddress } from '@polkadot/util-crypto';
import { useLocalStorage } from 'react-use';
import { isEmpty } from 'lodash';
import ReactGA from 'react-ga';
import PolkaSDK from '.';
import {
  LOGIN_LOCAL_STORAGE_KEY,
  REACT_APP_GA,
} from '../constants';
import {
  setAccount, setAccounts, setInjector, setWhiteList,
} from '../redux/chainSlice';
import { useAppDispatch } from '../hooks/redux';
import useWhiteList from '../hooks/reactQuery/useWhiteList';

interface Props {
  children: React.ReactNode;
}

const PolkaProvider = ({ children }: Props) => {
  const location = useLocation();
  const { data } = useWhiteList();
  const [isInitialized, setIsInitialized] = useState(false);
  const [value, setValue] = useLocalStorage<string>(LOGIN_LOCAL_STORAGE_KEY);
  const dispatch = useAppDispatch();

  ReactGA.initialize(REACT_APP_GA);
  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search);
  }, [location.pathname, location.search]);
  useEffect(() => {
    const init = async () => {
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
      localStorage.setItem('whiteList', JSON.stringify(data));
      const whiteList = JSON.parse(localStorage.getItem('whiteList'));
      dispatch(setWhiteList(whiteList));
    }
  }, [data, dispatch]);
  useEffect(() => {
    const whiteList = JSON.parse(localStorage.getItem('whiteList'));
    dispatch(setWhiteList(whiteList));
  }, [localStorage.getItem('whiteList')]);

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
