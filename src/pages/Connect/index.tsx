import {
  Box, Center, Container, Heading, Button,
} from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from 'react-use';

import { encodeAddress } from '@polkadot/util-crypto';
import Card from '../../components/Card';
import MainContainer from '../../layout/MainContainer';
import { Polkadot } from '../../assets/images';
import useParams from '../../hooks/url/useParams';
import { LOGIN_LOCAL_STORAGE_KEY, POLKADOT_EXTENSION } from '../../constants';
import { useAppDispatch } from '../../hooks/redux';
import { setAccount, setAccounts, setInjector } from '../../redux/chainSlice';
import { PolkadotIcon } from '../../assets/icons';
import AccountList from '../../components/AccountList';

const TITLE = 'connect';
const Connect: FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const params = useParams();
  const callbackUrl = params.get('callbackUrl');
  const [_, setValue] = useLocalStorage(LOGIN_LOCAL_STORAGE_KEY);
  const [injected, setInjected] = useState(false);
  const [injectedAccounts, setInjectedAccounts] = useState<InjectedAccountWithMeta[]>([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const initExtension = async () => {
      const allInjected = await web3Enable('NFTMart');
      if (allInjected.length === 0) {
        setInjected(false);
      } else {
        setInjected(true);
        // get accounts info in extension
        const web3InjectedAccounts = await web3Accounts();
        if (web3InjectedAccounts.length !== 0) {
          setInjectedAccounts(web3InjectedAccounts);
        }
      }
    };

    initExtension();
  }, []);
  console.log(callbackUrl);
  const handleClick = async (index: number) => {
    // treat first account as signer

    const injector = await web3FromSource(injectedAccounts[index].meta.source);
    // eslint-disable-next-line no-multi-assign
    injectedAccounts[index].address = encodeAddress(injectedAccounts[index].address, 12191);
    const address = encodeAddress(injectedAccounts[index].address, 12191);
    dispatch(setAccount(injectedAccounts[index]));
    dispatch(setInjector(injector));
    dispatch(setAccounts(injectedAccounts));
    setValue(injectedAccounts[index].address);

    if (callbackUrl && callbackUrl.length > 0) {
      if (callbackUrl.indexOf('/connect') > -1) {
        history.push('/');
      } else {
        console.log(callbackUrl);
        history.push(callbackUrl);
      }
    } else {
      history.push('/');
    }
  };

  return (
    <MainContainer title={TITLE}>
      <Box display="flex">
        <Container width="1180px">
          {!injected ? (
            <Center h="100vh" w="100%">
              <Box display="flex" flexDirection="column" alignItems="center">
                <Heading
                  as="h4"
                  size="md"
                  width="561px"
                  fontSize="24px"
                  fontFamily="TTHoves-Medium, TTHoves"
                  fontWeight="500"
                  color="#191A24"
                  lineHeight="36px"
                  textAlign="center"
                >
                  {t('extension.download')}
                </Heading>
                <Box alt="waleet_logo" as="img" src={Polkadot.default} width="160px" margin="30px auto" />
                <Button
                  variant="primary"
                  onClick={() => window.open(POLKADOT_EXTENSION, '_blank')}
                  isFullWidth
                  width="132px"
                  height="48px"
                  background="#000000"
                  borderRadius="4px"
                  fontSize="16px"
                  fontFamily="TTHoves-Medium, TTHoves"
                  fontWeight="500"
                  color="#FFFFFF"
                  lineHeight="18px"
                >
                  {t('extension.install')}
                </Button>
              </Box>
            </Center>
          ) : (
            <>
              {injectedAccounts.length > 0 ? (
                <Container paddingTop="20px" display="flex" justifyContent="center">
                  <Card
                    title={t('extension.select')}
                    icon={PolkadotIcon.default}
                    bodyPadding={false}
                    w="790px"
                  >
                    <AccountList InjectedAccountList={injectedAccounts} handleClick={handleClick} />
                  </Card>
                </Container>
              ) : (
                <Center h="100vh" w="100vw">
                  <Center height="100%" width="100%" flexDirection="column">
                    <Heading as="h4" size="md">
                      {t('extension.account')}
                    </Heading>
                  </Center>
                </Center>
              )}
            </>
          )}
        </Container>
      </Box>
    </MainContainer>
  );
};

export default Connect;
