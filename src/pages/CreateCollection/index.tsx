/* eslint-disable max-len */
import React, {
  useEffect,
} from 'react';
import Identicon from '@polkadot/react-identicon';
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
import { useLocalStorage } from 'react-use';
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
import useCollectionsSinger from '../../hooks/reactQuery/useCollectionsSinger';

import {
  PINATA_SERVER,
} from '../../constants';

const Account = () => {
  function GetQueryString(name) {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
    const r = decodeURI(window.location.search.substr(1)).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }
  const status = GetQueryString('collectionId');
  const { data: collectionsData } = useCollectionsSinger(status);
  const { t } = useTranslation();
  const chainState = useAppSelector((state) => state.chain);
  const { account, whiteList } = chainState;
  const [addressLoc] = useLocalStorage<string>('LOGIN_ADDRESS');
  const address = account?.address || addressLoc;
  const history = useHistory();
  const {
    data: Offerreceive, refetch: fetchOfferReceive,
  } = useOffer(
    {
      addressId: address,
      type: 'receive',
    },
  );
  const { data: userData, isLoading: userDataLoading, refetch: fetchUserData } = useUser(address);
  const { data: nftsDataCollecte, refetch: fetchCollecte } = useNftsCollect(
    {
      collecterId: address,
    },
  );

  useEffect(() => {
    if (address) {
      fetchUserData();
      fetchCollecte();
      fetchOfferReceive();
    }
  }, [address]);

  const TABS = [
    {
      id: '0',
      icon: IconWallet.default,
      iconS: IconWalletS.default,
      title: t('Account.myWallet'),
      num: userData?.ownerNftscount,
      requiredWhitelist: false,
      url: '/account/owned',
    },
    {
      id: '1',
      icon: IconCreate.default,
      iconS: IconCreateS.default,
      title: t('Account.Created'),
      num: userData?.createdNftCount,
      requiredWhitelist: true,
      url: '/account/created',
    },
    {
      id: '2',
      icon: IconDetailsCollection.default,
      iconS: IconDetailsCollectionN.default,
      title: t('Account.Stars'),
      num: nftsDataCollecte?.pages[0]?.pageInfo?.totalNum,
      requiredWhitelist: false,
      url: '/account/stars',
    },
    {
      id: '3',
      icon: IconOffers.default,
      iconS: IconOffersS.default,
      title: t('Account.offers'),
      num: Offerreceive?.pages[0].pageInfo.totalNum,
      requiredWhitelist: false,
      url: '/account/offers',
    },
    {
      id: '4',
      icon: IconDetailsocllections.default,
      iconS: IconDetailsocllectionsS.default,
      title: t('Account.collections'),
      num: userData?.createdClassCount,
      requiredWhitelist: true,
      url: '/account/collections',
    },
  ];

  const filteredTABS = TABS;

  return (
    <>
      {!account?.address || whiteList.length === 0 || userDataLoading ? (
        <Center width="100%" height="100vh">
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        </Center>
      ) : (
        <MainContainer title={`${status ? t('Update.modifyCollection') : t('Collection.title')}|${t('Home.title')}`}>
          <Flex maxWidth="1400px" flexDirection="column" position="relative">
            <Box
              maxWidth="1400px"
              w="100vw"
              minHeight="200px"
            >
              <Image
                w="100%"
                maxWidth="1400px"
                h="auto"
                src={userData?.featured_image ? `${PINATA_SERVER}user/${userData?.featured_image}` : AccountBanner.default}
                fallback={(
                  <Center width="100%" height="300px">
                    <Spinner />
                  </Center>
                )}
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
                src={`${PINATA_SERVER}user/${userData?.avatar}` || HeadPortrait.default}
                fallback={(
                  <Center width="108px" height="108px">
                    <Spinner />
                  </Center>
                )}
              />
            ) : (
              <Identicon
                className="identicon"
                value={account?.address}
              />
            )}
          </Flex>
          <Flex
            maxWidth="1400px"
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
            <Flex
              maxWidth="1015px"
              w="100%"
              height="auto"
              direction="column"
              boxSizing="border-box"
            >
              {!account && !whiteList
                ? (
                  <Center width="100%" height="500px">
                    <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                  </Center>
                )
                : <CollectionCom account={account} whiteList={whiteList} collectionsData={status ? collectionsData : {}} />}
            </Flex>
          </Flex>
        </MainContainer>
      )}
    </>
  );
};

export default Account;
