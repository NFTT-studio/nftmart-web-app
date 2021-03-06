/* eslint-disable no-empty */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable max-len */
import React, {
  useState, MouseEventHandler, useEffect,
} from 'react';
import Identicon from '@polkadot/react-identicon';
import { useTranslation } from 'react-i18next';
import {
  Link as RouterLink, RouteComponentProps, useHistory,
} from 'react-router-dom';
import {
  Flex,
  Box,
  Text,
  Image,
  Container,
  Button,
  SimpleGrid,
  Link,
  Center,
  Spinner,
  useMediaQuery,
  Avatar,
} from '@chakra-ui/react';
import { useWindowScroll } from 'react-use';
import InfiniteScroll from 'react-infinite-scroll-component';
import MainContainer from '../../layout/MainContainer';
import useCollections from '../../hooks/reactQuery/useCollections';
import { useAppSelector } from '../../hooks/redux';
import { getBlock } from '../../polkaSDK/api/getBlock';
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
  Emptyimg,
  IconDetailsCollection,
  IconDetailsCollectionN,
  Transaction,
  TransactionS,
} from '../../assets/images';
import {
  DEFAULT_PAGE_LIMIT,
  PINATA_SERVER,
} from '../../constants';
// import useCollections from '../../hooks/reactQuery/useCollections';
import useNftsPersonal from '../../hooks/reactQuery/useNftsPersonal';
import useOffer from '../../hooks/reactQuery/useOffer';
import useOffersend from '../../hooks/reactQuery/useOffersend';
import useTransaction from '../../hooks/reactQuery/useTransaction';
import CreateCard from './CreateCard';
import OfferItem from './OfferItem';
import Transactions from './Transaction';
import NftItem from './NftItem';
import NftItemH5 from './NftItemH5';
import Headers from './Header';
import Sort from '../../constants/Sort';
import useUser from '../../hooks/reactQuery/useUser';

const Account = ({ match }: RouteComponentProps<{ address: string, username: string }>) => {
  const formatAddress = (addr: string) => (addr ? `${addr?.slice(0, 4)}...${addr?.slice(-4)}` : '');
  const [isLargerThan700] = useMediaQuery('(min-width: 700px)');
  const history = useHistory();
  const { t } = useTranslation();
  const { y } = useWindowScroll();
  const offersMadeButton = [
    {
      id: '0',
      title: t('Account.offersMade'),
    },
    {
      id: '1',
      title: t('Account.offersReceived'),
    },
  ];
  function historyUrl(idTab: string, str: string) {
    if (idTab === '0') {
      const url = window.location.pathname.replace(str, '/owned');
      history.push(encodeURI(url));
      return;
    }
    if (idTab === '1') {
      const url = window.location.pathname.replace(str, '/created');
      history.push(encodeURI(url));
      return;
    }
    if (idTab === '2') {
      const url = window.location.pathname.replace(str, '/stars');
      history.push(encodeURI(url));
      return;
    }
    if (idTab === '3') {
      const url = window.location.pathname.replace(str, '/offers');
      history.push(encodeURI(url));
      return;
    }
    if (idTab === '4') {
      const url = window.location.pathname.replace(str, '/collections');
      history.push(encodeURI(url));
    }
    if (idTab === '5') {
      const url = window.location.pathname.replace(str, '/profile');
      history.push(encodeURI(url));
    }
    if (idTab === '6') {
      const url = window.location.pathname.replace(str, '/transaction');
      history.push(encodeURI(url));
    }
  }

  function historyTabUrl(idTab: string) {
    if (window.location.href.indexOf('owned') > -1) {
      historyUrl(idTab, '/owned');
      return;
    }
    if (window.location.href.indexOf('created') > -1) {
      historyUrl(idTab, '/created');
      return;
    }
    if (window.location.href.indexOf('stars') > -1) {
      historyUrl(idTab, '/stars');
      return;
    }
    if (window.location.href.indexOf('offers') > -1) {
      historyUrl(idTab, '/offers');
      return;
    }
    if (window.location.href.indexOf('collections') > -1) {
      historyUrl(idTab, '/collections');
    }
    if (window.location.href.indexOf('profile') > -1) {
      historyUrl(idTab, '/profile');
    }
    if (window.location.href.indexOf('transaction') > -1) {
      historyUrl(idTab, '/transaction');
    }
  }
  const chainState = useAppSelector((state) => state.chain);
  const { account, whiteList } = chainState;
  const address = match.params.address || account?.address;
  const [isPerson, setIsPerson] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedStatusArr, setSelectedStatusArr] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollectionArr] = useState();
  const [selectedSort, setSelectedSort] = useState(Sort[1].key);
  const [remainingTime, setRemainingTime] = useState(0);
  const [eventArr, setEventArr] = useState();

  const { data: userData, isLoading: userDataLoading, refetch: fetchUserData } = useUser(address);
  const {
    data: transactionDate, fetchNextPage: fetchNextPageTransaction, refetch: fetchTransaction,
  } = useTransaction(
    {
      address,
    },
  );

  useEffect(() => {
    getBlock().then((res) => {
      setRemainingTime(res);
    });
  }, []);

  const [selectTabId, setSelectTabId] = useState(0);
  const [urlName, setUrlName] = useState('');
  const handletabSelect: MouseEventHandler<HTMLButtonElement> = (event) => {
    historyTabUrl(event.currentTarget.id);
  };

  const [offersMadeButtonId, setOffersMadeButtonId] = useState(1);
  const handleButtonSelect: MouseEventHandler<HTMLButtonElement> = (event) => {
    setOffersMadeButtonId(Number(event.currentTarget.id));
  };

  const { data: collectionsData, isLoading: collectionsIsLoading, refetch: fetchCollections } = useCollections({ address });

  const {
    data: nftsData, isLoading: nftsIsLoading, fetchNextPage: fetchNextPageNftsData, refetch: fetchNftsData,
  } = useNftsPersonal(
    {
      ownerId: address,
      categoryId: selectedCategoryId,
      classId: selectedCollection,
      status: selectedStatusArr,
    },
  );
  const { data: nftsDataCreate, fetchNextPage: fetchNextPageNftsDataCreate, refetch: fetchNftsDataCreate } = useNftsPersonal(
    {
      creatorId: address,
      categoryId: selectedCategoryId,
      collectionId: selectedCollection,
      status: selectedStatusArr,
    },
  );
  const { data: nftsDataCollecte, fetchNextPage: fetchNextPageNftsDataCollecte, refetch: fetchNftsDataCollecte } = useNftsPersonal(
    {
      collecterId: address,
      categoryId: selectedCategoryId,
      collectionId: selectedCollection,
      status: selectedStatusArr,
    },
  );

  const {
    data: Offerreceive, fetchNextPage: fetchNextPageOfferreceive, refetch: fetchOfferreceive,
  } = useOffer(
    {
      addressId: address,
      type: 'receive',
    },
  );
  const {
    data: Offersend, fetchNextPage: fetchNextPageOffersend, refetch: fetchOffersend,
  } = useOffersend(
    {
      addressId: address,
      type: 'send',
    },
  );

  // const handleSelectStatus: MouseEventHandler<HTMLButtonElement> = (event) => {
  //   const clickedStatus = event.currentTarget.id;
  //   setSelectedStatusArr([event.currentTarget.id]);
  //   // setSelectedStatusArr(
  //   //   selectedStatusArr.indexOf(clickedStatus) > -1
  //   //     ? without(selectedStatusArr, event.currentTarget.id)
  //   //     : union(selectedStatusArr, [event.currentTarget.id]),
  //   // );
  // };
  useEffect(() => {
    const arr = [];
    try {
      for (const i in JSON.parse(userData?.events)) {
        arr.push(JSON.parse(userData?.events)[i]);
      }
      if (arr.length > 0) {
        arr.sort((a, b) => a.Date - b.Date);
        setEventArr(arr);
      }
    } catch (e) {
    }
  }, [userData?.events]);
  useEffect(() => {
    if (address) {
      if (window.location.href.indexOf('owned') > -1) {
        fetchNftsData();
      }
      if (window.location.href.indexOf('created') > -1) {
        fetchNftsDataCreate();
      }
      if (window.location.href.indexOf('stars') > -1) {
        fetchNftsDataCollecte();
      }
      if (window.location.href.indexOf('offers') > -1) {
        fetchOffersend();
        fetchOfferreceive();
      }
      if (window.location.href.indexOf('collections') > -1) {
        fetchCollections();
      }
      if (window.location.href.indexOf('transaction') > -1) {
        fetchTransaction();
      }
    }
    if (window.location.href.indexOf('owned') > -1) {
      setSelectTabId(0);
      setUrlName('myWallet');
    }
    if (window.location.href.indexOf('created') > -1) {
      setSelectTabId(1);
      setUrlName('Created');
    }
    if (window.location.href.indexOf('stars') > -1) {
      setSelectTabId(2);
      setUrlName('Stars');
    }
    if (window.location.href.indexOf('offers') > -1) {
      setSelectTabId(3);
      setUrlName('offers');
    }
    if (window.location.href.indexOf('collections') > -1) {
      setSelectTabId(4);
      setUrlName('collections');
    }
    if (window.location.href.indexOf('profile') > -1) {
      setSelectTabId(5);
      setUrlName('ArtistProfile');
    }
    if (window.location.href.indexOf('transaction') > -1) {
      setSelectTabId(6);
      setUrlName('Transactions');
    }
  }, [window.location.href]);

  useEffect(() => {
    if (address === account?.address) {
      setIsPerson(true);
    } else {
      setIsPerson(false);
    }
    if (address) {
      fetchUserData();
      fetchOfferreceive();
      fetchNftsDataCollecte();
      if (window.location.href.indexOf('owned') > -1) {
        fetchNftsData();
      }
      if (window.location.href.indexOf('created') > -1) {
        fetchNftsDataCreate();
      }
      if (window.location.href.indexOf('stars') > -1) {
        fetchNftsDataCollecte();
      }
      if (window.location.href.indexOf('offers') > -1) {
        fetchOffersend();
        fetchOfferreceive();
      }
      if (window.location.href.indexOf('collections') > -1) {
        fetchCollections();
      }
      if (window.location.href.indexOf('transaction') > -1) {
        fetchTransaction();
      }
    }
  }, [address]);
  useEffect(() => {
    if (address) {
      if (window.location.href.indexOf('owned') > -1) {
        fetchNftsData();
      }
      if (window.location.href.indexOf('created') > -1) {
        fetchNftsDataCreate();
      }
      if (window.location.href.indexOf('stars') > -1) {
        fetchNftsDataCollecte();
      }
      if (window.location.href.indexOf('offers') > -1) {
        fetchOffersend();
        fetchOfferreceive();
      }
      if (window.location.href.indexOf('collections') > -1) {
        fetchCollections();
      }
    }
  }, [selectedStatusArr, selectedSort]);
  useEffect(() => {
    if (address && isPerson && whiteList.length > 0 && (whiteList?.indexOf(address) < 0)) {
      if (window.location.href.indexOf('profile') > -1) {
        history.push('/account/owned');
      }
      if (window.location.href.indexOf('created') > -1) {
        history.push('/account/owned');
      }
      if (window.location.href.indexOf('collections') > -1) {
        history.push('/account/owned');
      }
    }
  }, [isPerson, address, whiteList]);
  const add0 = (m) => (m < 10 ? `0${m}` : m);
  const format = (time: string) => {
    const times = new Date(time);
    const year = times.getFullYear();
    const m = times.getMonth() + 1;
    const d = times.getDate();
    const h = times.getHours();
    const mm = times.getMinutes();
    const s = times.getSeconds();
    return `${year}/${add0(m)}/${add0(d)}`;
  };

  const TABS = [
    {
      id: '5',
      icon: IconWallet.default,
      iconS: IconWalletS.default,
      title: t('Account.ArtistProfile'),
      num: '',
      requiredWhitelist: true,
      show: !!userData?.summary,
    },
    {
      id: '0',
      icon: IconWallet.default,
      iconS: IconWalletS.default,
      title: t('Account.myWallet'),
      num: userData?.ownerNftscount,
      requiredWhitelist: false,
      show: true,
    },
    {
      id: '1',
      icon: IconCreate.default,
      iconS: IconCreateS.default,
      title: t('Account.Created'),
      num: userData?.createdNftCount,
      requiredWhitelist: true,
      show: true,
    },
    {
      id: '6',
      icon: Transaction.default,
      iconS: TransactionS.default,
      title: t('Account.Transactions'),
      num: '',
      requiredWhitelist: false,
      show: true,
    },
    {
      id: '2',
      icon: IconDetailsCollection.default,
      iconS: IconDetailsCollectionN.default,
      title: t('Account.Stars'),
      num: nftsDataCollecte?.pages[0]?.pageInfo?.totalNum,
      requiredWhitelist: false,
      show: true,
    },
    {
      id: '3',
      icon: IconOffers.default,
      iconS: IconOffersS.default,
      title: t('Account.offers'),
      num: Offerreceive?.pages[0].pageInfo.totalNum,
      requiredWhitelist: false,
      show: true,
    },
    {
      id: '4',
      icon: IconDetailsocllections.default,
      iconS: IconDetailsocllectionsS.default,
      title: t('Account.collections'),
      num: userData?.createdClassCount,
      requiredWhitelist: true,
      show: true,
    },
  ];

  let filteredTABS = TABS;
  if (account && whiteList?.indexOf(address) < 0) {
    filteredTABS = TABS.filter((nav) => nav.requiredWhitelist === false);
  } else {
    filteredTABS = TABS.filter((nav) => nav.show === true);
  }
  return (
    <>
      {isLargerThan700
        ? (
          <MainContainer title={`${t(`Account.${urlName}`)}-${userData?.name || address}|${t('Home.title')}`}>
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
                  value={address}
                  style={{
                    width: 'auto !important',
                    height: '108px !important',
                  }}
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
                      onClick={handletabSelect}
                      backgroundColor={selectTabId === Number(item.id) ? '#000000' : '#FFFFFF'}
                    >
                      <Flex h="100%" alignItems="center">
                        <Image w="22px" h="auto" mr="5px" src={selectTabId === Number(item.id) ? item.iconS : item.icon} alt="" />
                        <Text
                          fontSize="16px"
                          fontFamily="TTHoves-Medium, TTHoves"
                          fontWeight="500"
                          lineHeight="0px"
                          color={selectTabId === Number(item.id) ? '#FFFFFF' : '#999999'}
                        >
                          {item.title}
                        </Text>
                      </Flex>
                      <Text
                        fontSize="16px"
                        fontFamily="TTHoves-Medium, TTHoves"
                        fontWeight="500"
                        lineHeight="0px"
                        color={selectTabId === Number(item.id) ? '#FFFFFF' : '#999999'}
                      >
                        {item.num}
                      </Text>
                    </Button>
                  ))}
                </Flex>
              </Flex>
              <Flex maxWidth="1015px" w="100%" direction="column">
                {selectTabId === 0 ? (
                  <NftItem
                    nftsData={nftsData}
                    nftsIsLoading={nftsIsLoading}
                    fetchNextPageNftsData={fetchNextPageNftsData}
                    remainingTime={remainingTime}
                  />
                ) : ''}
                {selectTabId === 1 ? (
                  <NftItem
                    nftsData={nftsDataCreate}
                    nftsIsLoading={nftsIsLoading}
                    fetchNextPageNftsData={fetchNextPageNftsDataCreate}
                    remainingTime={remainingTime}
                  />
                ) : ''}
                {selectTabId === 2 ? (
                  <NftItem
                    nftsData={nftsDataCollecte}
                    nftsIsLoading={nftsIsLoading}
                    fetchNextPageNftsData={fetchNextPageNftsDataCollecte}
                    remainingTime={remainingTime}
                  />
                ) : ''}
                {selectTabId === 3 ? (
                  <Flex width="100%" flexDirection="column" justifyContent="flex-start">
                    <Flex h="40px">
                      {offersMadeButton.map((item, index) => (
                        <Button
                          mr="10px"
                          key={item.id}
                          id={item.id}
                          minWidth="123px"
                          height="40px"
                          borderRadius="4px 4px 0px 0px"
                          border="1px solid #000000"
                          onClick={handleButtonSelect}
                          backgroundColor={offersMadeButtonId === index ? '#000000' : '#FFFFFF'}
                        >
                          <Text
                            fontSize="14px"
                            fontFamily="TTHoves-Medium, TTHoves"
                            fontWeight="500"
                            color={offersMadeButtonId === index ? '#FFFFFF' : '#000000'}
                            lineHeight="16px"
                          >
                            {item.title}
                          </Text>
                        </Button>
                      ))}
                    </Flex>
                    <Flex width="100%" flexDirection="column" textAlign="center">
                      <Flex
                        p="0 20px"
                        width="100%"
                        height="40px"
                        flexFlow="row"
                        justifyContent="space-between"
                        alignItems="center"
                        flexDirection="row"
                        borderBottom="1px solid #E5E5E5"
                      >
                        <Text
                          width="224px"
                          textAlign="left"
                          fontSize="12px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#000000"
                          lineHeight="20px"
                        >
                          {t('Account.Item')}
                        </Text>
                        <Text
                          width="80px"
                          fontSize="12px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#000000"
                          lineHeight="20px"
                        >
                          {t('Account.unitPrice')}
                        </Text>
                        <Text
                          width="60px"
                          fontSize="12px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#000000"
                          lineHeight="20px"
                        >
                          {t('Account.quantity')}
                        </Text>
                        {offersMadeButtonId === 1 ? (
                          <Text
                            width="60px"
                            fontSize="12px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#000000"
                            lineHeight="20px"
                          >
                            {t('Account.from')}
                          </Text>
                        ) : ''}
                        <Text
                          width="120px"
                          textAlign="right"
                          fontSize="12px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#000000"
                          lineHeight="20px"
                        >
                          {t('Account.expiration')}
                        </Text>
                      </Flex>
                      {offersMadeButtonId === 0
                        ? (
                          <>
                            {Offersend?.pages[0]?.offers?.length ? (
                              <InfiniteScroll
                                dataLength={Offersend?.pages.length * DEFAULT_PAGE_LIMIT}
                                next={fetchNextPageOffersend}
                                hasMore={Offersend?.pages.length
                                  * DEFAULT_PAGE_LIMIT < Offersend?.pages[0].pageInfo.totalNum}
                                loader={<h4>Loading...</h4>}
                                initialScrollY={1}
                              >
                                {Offersend?.pages.map((page) => page?.offers?.map((item) => (
                                  <Box
                                    key={item?.nft_id}
                                    width="100%"
                                  >
                                    <OfferItem offers={item} hide={false} />
                                  </Box>
                                )))}
                              </InfiniteScroll>
                            ) : (
                              <Flex
                                width="100%"
                                height="260px"
                                background="#FFFFFF"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                              >
                                <Image
                                  w="150px"
                                  h="100px"
                                  src={Emptyimg.default}
                                />
                                <Text
                                  mt="10px"
                                  fontSize="14px"
                                  fontFamily="TTHoves-Regular, TTHoves"
                                  fontWeight="400"
                                  color="#999999"
                                  lineHeight="20px"
                                >
                                  {t('common.noDataYet')}
                                </Text>
                              </Flex>
                            )}
                          </>
                        )
                        : null}
                      {offersMadeButtonId === 1
                        ? (
                          <>
                            {Offerreceive?.pages[0]?.offers?.length ? (
                              <InfiniteScroll
                                dataLength={Offerreceive?.pages.length * DEFAULT_PAGE_LIMIT}
                                next={fetchNextPageOfferreceive}
                                hasMore={Offerreceive?.pages.length
                                  * DEFAULT_PAGE_LIMIT < Offerreceive?.pages[0].pageInfo.totalNum}
                                loader={<h4>Loading...</h4>}
                                initialScrollY={1}
                              >
                                {Offerreceive?.pages.map((page) => page?.offers?.map((item) => (
                                  <Box
                                    key={item?.nft_id}
                                    width="100%"
                                  >
                                    <OfferItem offers={item} hide />
                                  </Box>
                                )))}
                              </InfiniteScroll>
                            ) : (
                              <Flex
                                width="100%"
                                height="260px"
                                background="#FFFFFF"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                              >
                                <Image
                                  w="150px"
                                  h="100px"
                                  src={Emptyimg.default}
                                />
                                <Text
                                  mt="10px"
                                  fontSize="14px"
                                  fontFamily="TTHoves-Regular, TTHoves"
                                  fontWeight="400"
                                  color="#999999"
                                  lineHeight="20px"
                                >
                                  {t('common.noDataYet')}
                                </Text>
                              </Flex>
                            )}
                          </>
                        )
                        : null}
                      {/* {offersMadeArr ? offersMadeArr?.orders?.map((item, index) => (

                  )) : ''} */}
                    </Flex>
                  </Flex>
                ) : ''}
                {selectTabId === 4 ? (
                  <>
                    {collectionsIsLoading
                      ? (
                        <Center width="100%" height="500px">
                          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                        </Center>
                      )
                      : (
                        <Container>
                          <SimpleGrid
                            columns={[1, 2, 3, 3, 4]}
                            spacing={6}
                          >
                            {isPerson ? <CreateCard account={account} /> : ''}
                            {collectionsData ? collectionsData.collections.map((item) => (
                              <Link
                                as={RouterLink}
                                to={`/collection/${item.id}-${encodeURIComponent(item.metadata.name)}`}
                              >
                                <Flex
                                  key={item.id}
                                  width="230px"
                                  borderRadius="4px"
                                  border="1px solid #000000"
                                  flexDirection="column"
                                >
                                  <Image w="100%" h="230px" src={`${PINATA_SERVER}logo/${item.metadata?.logoUrl}`} alt="" />
                                  <Text
                                    w="100%"
                                    background="#000000"
                                    p="0 16px"
                                    lineHeight="54px"
                                    fontSize="16px"
                                    fontFamily="TTHoves-Regular, TTHoves"
                                    fontWeight="400"
                                    color="#FFFFFF"
                                    overflow="hidden"
                                    textOverflow="ellipsis"
                                    whiteSpace="nowrap"
                                  >
                                    {item.metadata?.name}
                                  </Text>
                                </Flex>
                              </Link>
                            )) : ''}
                          </SimpleGrid>
                        </Container>
                      )}
                  </>
                ) : ''}
                {selectTabId === 5 ? (
                  <>
                    {userDataLoading
                      ? (
                        <Center width="100%" height="500px">
                          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                        </Center>
                      )
                      : (
                        <Container>
                          <Text
                            w="100%"
                            fontStyle="oblique"
                            fontSize="24px"
                            fontFamily="TTHoves-MediumItalic, TTHoves"
                            fontWeight="bold"
                            color="rgba(0, 0, 0, 0.85)"
                            lineHeight="29px"
                            letterSpacing="1px"
                            textAlign="start"
                          >
                            {t('ProfileEdit.Summary')}
                          </Text>
                          <Text
                            mt="15px"
                            w="100%"
                            fontSize="16px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="rgba(0, 0, 0, 0.85)"
                            lineHeight="28px"
                            letterSpacing="1px"
                            textAlign="start"
                          >
                            {userData?.summary}
                          </Text>
                          <Text
                            mt="50px"
                            w="100%"
                            fontStyle="oblique"
                            fontSize="24px"
                            fontFamily="TTHoves-MediumItalic, TTHoves"
                            fontWeight="bold"
                            color="rgba(0, 0, 0, 0.85)"
                            lineHeight="29px"
                            letterSpacing="1px"
                            textAlign="start"
                          >
                            {t('ProfileEdit.Event')}
                          </Text>
                          {eventArr?.map((item, index) => (
                            <Flex
                              mt="15px"
                            >
                              <Text
                                minWidth="100px"
                                mr="15px"
                                fontSize="16px"
                                fontFamily="TTHoves-Italic, TTHoves"
                                fontWeight="normal"
                                color="rgba(0, 0, 0, 0.5)"
                                lineHeight="28px"
                                letterSpacing="1px"
                                textAlign="start"
                              >
                                {format(item.Date)}
                              </Text>
                              <Box
                                w="100%"
                                fontSize="16px"
                                fontFamily="TTHoves-Regular, TTHoves"
                                fontWeight="400"
                                color="rgba(0, 0, 0, 0.85)"
                                lineHeight="28px"
                                letterSpacing="1px"
                                textAlign="start"
                              >
                                {item.Subject}
                                {item.Link
                                  ? (
                                    <Link
                                      target="_blank"
                                      href={item.Link}
                                    >
                                      <Box
                                        display="inline-block"
                                        mr="15px"
                                        fontSize="16px"
                                        fontFamily=" TTHoves-Regular, TTHoves"
                                        fontWeight="400"
                                        color="#0091FF"
                                        lineHeight="18px"
                                        letterSpacing="1px"
                                        textAlign="start"
                                        ml="9px"
                                      >
                                        Link
                                      </Box>
                                    </Link>
                                  ) : ''}
                              </Box>
                            </Flex>
                          ))}
                        </Container>
                      )}
                  </>
                ) : ''}
                {selectTabId === 6 ? (
                  <Flex width="100%" flexDirection="column" justifyContent="flex-start">
                    <Flex width="100%" flexDirection="column" textAlign="center">
                      <Flex
                        p="0 20px"
                        width="100%"
                        height="40px"
                        flexFlow="row"
                        justifyContent="space-between"
                        alignItems="center"
                        flexDirection="row"
                        borderBottom="1px solid #E5E5E5"
                      >
                        <Text
                          width="224px"
                          textAlign="left"
                          fontSize="15px"
                          fontFamily="TTHoves-DemiBold, TTHoves"
                          fontWeight="600"
                          color="#000000"
                          letterSpacing="1px"
                          lineHeight="20px"
                        >
                          {t('Account.Item')}
                        </Text>
                        <Text
                          width="62px"
                          textAlign="left"
                          fontSize="15px"
                          fontFamily="TTHoves-DemiBold, TTHoves"
                          fontWeight="600"
                          color="#000000"
                          letterSpacing="1px"
                          lineHeight="20px"
                        >
                          {t('Account.Method')}
                        </Text>
                        <Text
                          width="70px"
                          fontSize="15px"
                          fontFamily="TTHoves-DemiBold, TTHoves"
                          fontWeight="600"
                          color="#000000"
                          letterSpacing="1px"
                          lineHeight="20px"
                        >
                          {t('Account.quantity')}
                        </Text>
                        <Text
                          width="120px"
                          fontSize="15px"
                          fontFamily="TTHoves-DemiBold, TTHoves"
                          fontWeight="600"
                          color="#000000"
                          letterSpacing="1px"
                          lineHeight="20px"
                        >
                          {t('Account.Price')}
                        </Text>
                        <Text
                          width="100px"
                          fontSize="15px"
                          fontFamily="TTHoves-DemiBold, TTHoves"
                          fontWeight="600"
                          color="#000000"
                          letterSpacing="1px"
                          lineHeight="20px"
                        >
                          {t('Account.With')}
                        </Text>
                        <Text
                          width="120px"
                          textAlign="right"
                          fontSize="15px"
                          fontFamily="TTHoves-DemiBold, TTHoves"
                          fontWeight="600"
                          color="#000000"
                          letterSpacing="1px"
                          lineHeight="20px"
                        >
                          {t('Account.Date')}
                        </Text>
                      </Flex>
                      <>
                        {transactionDate?.pages[0]?.transactions?.length ? (
                          <InfiniteScroll
                            dataLength={transactionDate?.pages?.length * DEFAULT_PAGE_LIMIT}
                            next={fetchNextPageTransaction}
                            hasMore={transactionDate?.pages[Number(transactionDate?.pages?.length) - 1]?.transactions?.length === 20}
                            loader={<h4>Loading...</h4>}
                            initialScrollY={1}
                          >
                            {transactionDate?.pages.map((page) => page?.transactions?.map((item) => (
                              <Box
                                key={item?.id}
                                width="100%"
                              >
                                <Transactions offers={item} />
                              </Box>
                            )))}
                          </InfiniteScroll>
                        ) : (
                          <Flex
                            width="100%"
                            height="260px"
                            background="#FFFFFF"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Image
                              w="150px"
                              h="100px"
                              src={Emptyimg.default}
                            />
                            <Text
                              mt="10px"
                              fontSize="14px"
                              fontFamily="TTHoves-Regular, TTHoves"
                              fontWeight="400"
                              color="#999999"
                              lineHeight="20px"
                            >
                              {t('common.noDataYet')}
                            </Text>
                          </Flex>
                        )}
                      </>
                    </Flex>
                  </Flex>
                ) : ''}
              </Flex>
            </Flex>
          </MainContainer>
        )
        : (
          <MainContainer title={`${t(`Account.${urlName}`)}-${userData?.name || address}|${t('Home.title')}`}>
            <Flex w="100%" position="relative">
              <Box
                w="100vw"
              >
                <Image
                  width="100%"
                  height="129px"
                  objectFit="cover"
                  src={userData?.featured_image ? `${PINATA_SERVER}user/${userData?.featured_image}` : AccountBanner.default}
                  alt="banner"
                  fallback={(
                    <Center width="100%" height="129px">
                      <Spinner />
                    </Center>
                  )}
                />
              </Box>
              {userData?.avatar
                ? (
                  <Avatar
                    position="absolute"
                    left="calc(50% - 50px)"
                    bottom="-50px"
                    border="3px solid #FFFFFF"
                    src={`${PINATA_SERVER}user/${userData?.avatar}`}
                    w="100px"
                    h="100px"
                    boxShadow="0px 6px 20px 0px #D3D5DC"
                    fallback={(
                      <Center width="100px" height="100px">
                        <Spinner />
                      </Center>
                    )}
                  />
                ) : (
                  <Identicon
                    className="identiconH5"
                    value={address}
                  />
                )}

            </Flex>
            <Text
              mt="60px"
              fontSize="23px"
              fontFamily="TTHoves-DemiBold, TTHoves"
              fontWeight="bold"
              color="#000000"
              lineHeight="28px"
              letterSpacing="1px"
            >
              {userData?.name || formatAddress(userData?.address)}
            </Text>
            <Text
              width="100%"
              textAlign="center"
              mt="10px"
              fontSize="12px"
              fontFamily="TTHoves-Regular, TTHoves"
              fontWeight="400"
              color="#999999"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {userData?.address}
            </Text>
            {account && whiteList?.indexOf(address) < 0
              ? (
                <Flex
                  mt={y < 270 ? '25px' : '0'}
                  w="100%"
                  display="flex"
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  position={y > 270 ? 'fixed' : 'relative'}
                  zIndex="5"
                  background="#FFFFFF"
                >
                  {filteredTABS.map((item) => (
                    <>
                      {
                        item.id === '3'
                          || item.id === '5'
                          ? null : (
                            <Button
                              w="50%"
                              h="52px"
                              key={item.id}
                              id={item.id}
                              borderRadius="none"
                              border="none"
                              display="flex"
                              flexDirection="column"
                              justifyContent="center"
                              alignItems="center"
                              backgroundColor={selectTabId === Number(item.id) ? '#000000' : '#FFFFFF'}
                              onClick={handletabSelect}
                              _hover={{
                                backgroundColor: '#000000',
                              }}
                            >
                              <Text
                                fontSize="16px"
                                fontFamily="TTHoves-Medium, TTHoves"
                                fontWeight="500"
                                lineHeight="16px"
                                color={selectTabId === Number(item.id) ? '#FFFFFF' : '#999999'}
                              >
                                {item.num}
                              </Text>
                              <Text
                                fontSize="12px"
                                fontFamily="TTHoves-Medium, TTHoves"
                                fontWeight="500"
                                lineHeight="12px"
                                color={selectTabId === Number(item.id) ? '#FFFFFF' : '#999999'}
                              >
                                {item.title}
                              </Text>
                            </Button>
                          )
                      }
                    </>
                  ))}
                </Flex>
              )
              : (
                <Flex
                  mt={y < 270 ? '25px' : '0'}
                  w="100%"
                  display="flex"
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  position={y > 270 ? 'fixed' : 'relative'}
                  zIndex="5"
                  background="#FFFFFF"
                >
                  {filteredTABS.map((item) => (
                    <>
                      {
                        item.id === '3'
                          || item.id === '5'
                          || item.id === '6'
                          ? null : (
                            <Button
                              w="25%"
                              h="52px"
                              key={item.id}
                              id={item.id}
                              borderRadius="none"
                              border="none"
                              display="flex"
                              flexDirection="column"
                              justifyContent="center"
                              alignItems="center"
                              backgroundColor={selectTabId === Number(item.id) ? '#000000' : '#FFFFFF'}
                              onClick={handletabSelect}
                              _hover={{
                                backgroundColor: '#000000',
                              }}
                            >
                              <Text
                                fontSize="16px"
                                fontFamily="TTHoves-Medium, TTHoves"
                                fontWeight="500"
                                lineHeight="16px"
                                color={selectTabId === Number(item.id) ? '#FFFFFF' : '#999999'}
                              >
                                {item.num}
                              </Text>
                              <Text
                                fontSize="12px"
                                fontFamily="TTHoves-Medium, TTHoves"
                                fontWeight="500"
                                lineHeight="12px"
                                color={selectTabId === Number(item.id) ? '#FFFFFF' : '#999999'}
                              >
                                {item.title}
                              </Text>
                            </Button>
                          )
                      }
                    </>
                  ))}
                </Flex>
              )}
            {selectTabId === 0 ? (
              <NftItemH5
                nftsData={nftsData}
                nftsIsLoading={nftsIsLoading}
                fetchNextPageNftsData={fetchNextPageNftsData}
                remainingTime={remainingTime}
              />
            ) : ''}
            {selectTabId === 1 ? (
              <NftItemH5
                nftsData={nftsDataCreate}
                nftsIsLoading={nftsIsLoading}
                fetchNextPageNftsData={fetchNextPageNftsDataCreate}
                remainingTime={remainingTime}
              />
            ) : ''}
            {selectTabId === 2 ? (
              <NftItemH5
                nftsData={nftsDataCollecte}
                nftsIsLoading={nftsIsLoading}
                fetchNextPageNftsData={fetchNextPageNftsDataCollecte}
                remainingTime={remainingTime}
              />
            ) : ''}
            {selectTabId === 4 ? (
              <>
                {collectionsIsLoading
                  ? (
                    <Center width="100%" height="500px">
                      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                    </Center>
                  )
                  : (
                    <Container width="100%">
                      <Flex
                        width="100%"
                        flexDirection="column"
                        alignItems="center"
                      >
                        {collectionsData ? collectionsData.collections.map((item) => (
                          <Link
                            mt="25px"
                            as={RouterLink}
                            to={`/collection/${item.id}-${encodeURIComponent(item.metadata.name)}`}
                          >
                            <Flex
                              key={item.id}
                              width="230px"
                              borderRadius="4px"
                              border="1px solid #000000"
                              flexDirection="column"
                            >
                              <Image w="100%" h="230px" src={`${PINATA_SERVER}logo/${item.metadata?.logoUrl}`} alt="" />
                              <Text
                                w="100%"
                                background="#000000"
                                p="0 16px"
                                lineHeight="54px"
                                fontSize="16px"
                                fontFamily="TTHoves-Regular, TTHoves"
                                fontWeight="400"
                                color="#FFFFFF"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                              >
                                {item.metadata?.name}
                              </Text>
                            </Flex>
                          </Link>
                        )) : ''}
                      </Flex>
                    </Container>
                  )}
              </>
            ) : ''}
          </MainContainer>
        )}
    </>
  );
};

export default Account;
