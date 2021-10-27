/* eslint-disable max-len */
import React, {
  useEffect,
} from 'react';
import Identicon from 'react-identicons';
import { useTranslation } from 'react-i18next';
import {
  Link as RouterLink, RouteComponentProps, useLocation, useHistory,
} from 'react-router-dom';
import {
  Flex,
  Box,
  Text,
  Image,
  Button,
  Center,
  Spinner,
} from '@chakra-ui/react';
import MainContainer from '../../layout/MainContainer';
import { useAppSelector } from '../../hooks/redux';
import {
  AccountBanner,
  IconOffers,
  IconWallet,
  IconDetailsocllections,
  IconOffersS,
  IconWalletS,
  IconDetailsocllectionsS,
  HeadPortrait,
  IconCreate,
  IconCreateS,
  IconDetailsCollection,
  IconDetailsCollectionN,
} from '../../assets/images';
import useUser from '../../hooks/reactQuery/useUser';
import useNftsCollect from '../../hooks/reactQuery/useNftsCollect';
import useOffer from '../../hooks/reactQuery/useOffer';
import Headers from './Header';
import CollectionCom from '../../components/CollectionCom/index';

const Account = () => {
  const { t } = useTranslation();
  const chainState = useAppSelector((state) => state.chain);
  const { account, whiteList } = chainState;
  const history = useHistory();
  const {
    data: Offerreceive, refetch: fetchOfferReceive,
  } = useOffer(
    {
      addressId: account?.address,
      type: 'receive',
    },
  );
  const { data: userData, isLoading: userDataLoading, refetch: fetchUserData } = useUser(account?.address);
  const { data: nftsDataCollecte, refetch: fetchCollecte } = useNftsCollect(
    {
      collecterId: account?.address,
    },
  );

  useEffect(() => {
    fetchUserData();
    fetchCollecte();
    fetchOfferReceive();
  }, [account, whiteList.length]);
  useEffect(() => {
    if (!account) {
      history.push(`/connect?callbackUrl=${window.location.pathname}`);
    }
  }, [!account]);
  const TABS = [
    {
      id: '0',
      icon: IconWallet.default,
      iconS: IconWalletS.default,
      title: t('Account.myWallet'),
      num: userData?.ownerNftscount,
      requiredWhitelist: false,
      url: '/account/nmvkzZYRfirHr4S8GuJNNuvPrx62KDzJjMKPRrd9jtUBiB9hJ/wallet?id=0',
    },
    {
      id: '1',
      icon: IconCreate.default,
      iconS: IconCreateS.default,
      title: t('Account.Created'),
      num: userData?.createdNftCount,
      requiredWhitelist: true,
      url: '/account/nmvkzZYRfirHr4S8GuJNNuvPrx62KDzJjMKPRrd9jtUBiB9hJ/wallet?id=1',
    },
    {
      id: '2',
      icon: IconDetailsCollection.default,
      iconS: IconDetailsCollectionN.default,
      title: t('Account.Stars'),
      num: nftsDataCollecte?.pages[0]?.pageInfo?.totalNum,
      requiredWhitelist: false,
      url: '/account/nmvkzZYRfirHr4S8GuJNNuvPrx62KDzJjMKPRrd9jtUBiB9hJ/wallet?id=2',
    },
    {
      id: '3',
      icon: IconOffers.default,
      iconS: IconOffersS.default,
      title: t('Account.offers'),
      num: Offerreceive?.pages[0].pageInfo.totalNum,
      requiredWhitelist: false,
      url: '/account/nmvkzZYRfirHr4S8GuJNNuvPrx62KDzJjMKPRrd9jtUBiB9hJ/wallet?id=3',
    },
    {
      id: '4',
      icon: IconDetailsocllections.default,
      iconS: IconDetailsocllectionsS.default,
      title: t('Account.collections'),
      num: userData?.createdClassCount,
      requiredWhitelist: true,
      url: '/account/nmvkzZYRfirHr4S8GuJNNuvPrx62KDzJjMKPRrd9jtUBiB9hJ/wallet?id=4',
    },
  ];

  const filteredTABS = TABS;

  return (
    <>
      { !account?.address || whiteList.length === 0 || userDataLoading ? (
        <Center width="100%" height="100vh">
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        </Center>
      ) : (
        <MainContainer title={t('Home.title')}>
          <Flex maxWidth="1440px" flexDirection="column" position="relative">
            <Box
              maxWidth="1440px"
              w="100vw"
              minHeight="200px"
            >
              <Image
                w="100%"
                maxWidth="1440px"
                h="auto"
                src={userData?.featured_image || AccountBanner.default}
                alt=""
              />
            </Box>
            {userData?.avatar ? (
              <Image
                position="absolute"
                bottom="-54px"
                border="3px solid #FFFFFF"
                m="0 40px"
                boxShadow="0px 6px 20px 0px #D3D5DC"
                background="#FFFFFF"
                width="auto"
                borderRadius="50%"
                height="108px"
                objectFit="cover"
                src={userData?.avatar || HeadPortrait.default}
              />
            ) : (
              <Identicon
                className="identicon"
                string={account?.address}
              />
            )}
          </Flex>
          <Flex
            maxWidth="1440px"
            w="100%"
            flexDirection="row"
            justifyContent="space-between"
            padding="81px 40px 20px 40px"
          >
            <Flex width="21.8%" mr="20px" direction="column">
              {userDataLoading ? (
                <Center width="100%" height="100px">
                  <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                </Center>
              ) : (
                <Headers userData={userData} />
              )}
              <Flex
                mt="53px"
                w="100%"
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                {filteredTABS.map((item) => (
                  <Button
                    w="75%"
                    key={item.id}
                    id={item.id}
                    mr="40px"
                    mb="23px"
                    height="36px"
                    borderRadius="2px"
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    onClick={() => {
                      history.push(item.url);
                    }}
                    backgroundColor="#FFFFFF"
                  >
                    <Flex h="100%" alignItems="center">
                      <Image w="22px" h="22px" mr="5px" src={item.icon} alt="" />
                      <Text
                        fontSize="16px"
                        fontFamily="TTHoves-Medium, TTHoves"
                        fontWeight="500"
                        color="#999999"
                        lineHeight="18px"
                      >
                        {item.title}
                      </Text>
                    </Flex>
                    <Text
                      fontSize="16px"
                      fontFamily="TTHoves-Medium, TTHoves"
                      fontWeight="500"
                      color="#999999"
                      lineHeight="18px"
                    >
                      {item.num}
                    </Text>
                  </Button>
                ))}
              </Flex>
            </Flex>
            <Flex maxWidth="1015px" w="100%" direction="column">
              {!account && !whiteList
                ? (
                  <Center width="100%" height="500px">
                    <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                  </Center>
                )
                : <CollectionCom account={account} whiteList={whiteList} />}
            </Flex>
          </Flex>
        </MainContainer>
      )}
    </>
  );
};

export default Account;
