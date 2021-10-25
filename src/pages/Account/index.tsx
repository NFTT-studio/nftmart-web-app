/* eslint-disable max-len */
import React, {
  useState, MouseEventHandler, useEffect, ChangeEventHandler,
} from 'react';
import Identicon from 'react-identicons';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, RouteComponentProps, useLocation } from 'react-router-dom';
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
} from '@chakra-ui/react';
import { union, without } from 'lodash';
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
} from '../../assets/images';
import {
  DEFAULT_PAGE_LIMIT,
  PINATA_SERVER,
} from '../../constants';
import { statusArr } from '../../constants/Status';
// import useCollections from '../../hooks/reactQuery/useCollections';
import useNftsPersonal from '../../hooks/reactQuery/useNftsPersonal';
import useNftsCollect from '../../hooks/reactQuery/useNftsCollect';
import useOffer from '../../hooks/reactQuery/useOffer';
import useOffersend from '../../hooks/reactQuery/useOffersend';
import CreateCard from './CreateCard';
import OfferItem from './OfferItem';
import NftItem from './NftItem';
import Headers from './Header';
import useAccount from '../../hooks/reactQuery/useAccount';
import Sort from '../../constants/Sort';
import useNfts from '../../hooks/reactQuery/useNfts';
import useUser from '../../hooks/reactQuery/useUser';

const Account = ({ match }: RouteComponentProps<{ address: string }>) => {
  const { t } = useTranslation();
  const { address } = match.params;

  const { data: userData, isLoading: userDataLoading, refetch: fetchUserData } = useUser(address);

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

  const chainState = useAppSelector((state) => state.chain);
  const { account, whiteList } = chainState;
  const dataPerson = useAccount(address);
  const [isPerson, setIsPerson] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedStatusArr, setSelectedStatusArr] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollectionArr] = useState();
  const [selectedSort, setSelectedSort] = useState(Sort[1].key);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    getBlock().then((res) => {
      setRemainingTime(res);
    });
  }, []);

  const [selectTabId, setSelectTabId] = useState(Number(localStorage.getItem('ButtonSelect')) || 0);
  const handletabSelect: MouseEventHandler<HTMLButtonElement> = (event) => {
    localStorage.setItem('ButtonSelect', event.currentTarget.id);
    setSelectTabId(Number(event.currentTarget.id));
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
      sortBy: selectedSort,
    },
  );
  const { data: nftsDataCreate, fetchNextPage: fetchNextPageNftsDataCreate, refetch: fetchNftsDataCreate } = useNftsPersonal(
    {
      creatorId: address,
      categoryId: selectedCategoryId,
      collectionId: selectedCollection,
      status: selectedStatusArr,
      sortBy: selectedSort,
    },
  );
  const { data: nftsDataCollecte, fetchNextPage: fetchNextPageNftsDataCollecte, refetch: fetchNftsDataCollecte } = useNftsPersonal(
    {
      collecterId: address,
      categoryId: selectedCategoryId,
      collectionId: selectedCollection,
      status: selectedStatusArr,
      sortBy: selectedSort,
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

  const handleSelectStatus: MouseEventHandler<HTMLButtonElement> = (event) => {
    const clickedStatus = event.currentTarget.id;
    setSelectedStatusArr(
      selectedStatusArr.indexOf(clickedStatus) > -1
        ? without(selectedStatusArr, event.currentTarget.id)
        : union(selectedStatusArr, [event.currentTarget.id]),
    );
  };
  useEffect(() => {
    setSelectTabId(Number(localStorage.getItem('ButtonSelect')) || 0);
  }, [Number(localStorage.getItem('ButtonSelect'))]);
  useEffect(() => {
    if (account && whiteList.indexOf(address) < 0) {
      localStorage.setItem('ButtonSelect', '0');
    }
  }, [account?.address, whiteList]);

  const [collections, setCollections] = useState([]);

  useEffect(() => {
    setCollections(collectionsData?.collections);
  }, [collectionsData?.collections]);

  useEffect(() => {
    if (address === account?.address) {
      setIsPerson(true);
    }
  }, [account?.address, address]);
  useEffect(() => {
    if (address === account?.address) {
      setIsPerson(true);
    }
    fetchUserData();
    fetchCollections();
    fetchNftsData();
    fetchNftsDataCreate();
    fetchNftsDataCollecte();
    fetchOffersend();
    fetchOfferreceive();
  }, [address]);

  const TABS = [
    {
      id: '0',
      icon: IconWallet.default,
      iconS: IconWalletS.default,
      title: t('Account.myWallet'),
      num: userData?.ownerNftscount,
      requiredWhitelist: false,
    },
    {
      id: '1',
      icon: IconCreate.default,
      iconS: IconCreateS.default,
      title: t('Account.Created'),
      num: userData?.createdNftCount,
      requiredWhitelist: true,
    },
    {
      id: '2',
      icon: IconDetailsCollection.default,
      iconS: IconDetailsCollectionN.default,
      title: t('Account.Stars'),
      num: nftsDataCollecte?.pages[0]?.pageInfo?.totalNum,
      requiredWhitelist: false,
    },
    {
      id: '3',
      icon: IconOffers.default,
      iconS: IconOffersS.default,
      title: t('Account.offers'),
      num: Offerreceive?.pages[0].pageInfo.totalNum,
      requiredWhitelist: false,
    },
    {
      id: '4',
      icon: IconDetailsocllections.default,
      iconS: IconDetailsocllectionsS.default,
      title: t('Account.collections'),
      num: userData?.createdClassCount,
      requiredWhitelist: true,
    },
  ];

  let filteredTABS = TABS;
  if (account && whiteList.indexOf(address) < 0) {
    filteredTABS = TABS.filter((nav) => nav.requiredWhitelist === false);
  }

  return (
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
            string={address}
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
            <Headers userData={userData} dataPerson={dataPerson} />
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
                  <Image w="22px" h="22px" mr="5px" src={selectTabId === Number(item.id) ? item.iconS : item.icon} alt="" />
                  <Text
                    fontSize="16px"
                    fontFamily="TTHoves-Medium, TTHoves"
                    fontWeight="500"
                    color={selectTabId === Number(item.id) ? '#FFFFFF' : '#999999'}
                    lineHeight="18px"
                  >
                    {item.title}
                  </Text>
                </Flex>
                <Text
                  fontSize="16px"
                  fontFamily="TTHoves-Medium, TTHoves"
                  fontWeight="500"
                  color={selectTabId === Number(item.id) ? '#FFFFFF' : '#999999'}
                  lineHeight="18px"
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
              statusArr={statusArr}
              selectedStatusArr={selectedStatusArr}
              handleSelectStatus={handleSelectStatus}
              nftsIsLoading={nftsIsLoading}
              fetchNextPageNftsData={fetchNextPageNftsData}
              selectedSort={selectedSort}
              setSelectedSort={setSelectedSort}
              remainingTime={remainingTime}
            />
          ) : ''}
          {selectTabId === 1 ? (
            <NftItem
              nftsData={nftsDataCreate}
              statusArr={statusArr}
              selectedStatusArr={selectedStatusArr}
              handleSelectStatus={handleSelectStatus}
              nftsIsLoading={nftsIsLoading}
              fetchNextPageNftsData={fetchNextPageNftsDataCreate}
              selectedSort={selectedSort}
              setSelectedSort={setSelectedSort}
              remainingTime={remainingTime}
            />
          ) : ''}
          {selectTabId === 2 ? (
            <NftItem
              nftsData={nftsDataCollecte}
              statusArr={statusArr}
              selectedStatusArr={selectedStatusArr}
              handleSelectStatus={handleSelectStatus}
              nftsIsLoading={nftsIsLoading}
              fetchNextPageNftsData={fetchNextPageNftsDataCollecte}
              selectedSort={selectedSort}
              setSelectedSort={setSelectedSort}
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
                      {Offersend?.pages.length ? (
                        <InfiniteScroll
                          dataLength={Offersend?.pages.length * DEFAULT_PAGE_LIMIT}
                          next={fetchNextPageOffersend}
                          hasMore={Offersend?.pages.length
                                * DEFAULT_PAGE_LIMIT < Offersend?.pages[0].pageInfo.totalNum}
                          loader={<h4>Loading...</h4>}
                          initialScrollY={1}
                        >
                          {Offersend?.pages.map((page) => page?.orders?.map((item) => (
                            <OfferItem offers={item} />
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
                            border="1px solid #999999"
                            borderStyle="dashed"
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
                      {Offerreceive?.pages.length ? (
                        <InfiniteScroll
                          dataLength={Offerreceive?.pages.length * DEFAULT_PAGE_LIMIT}
                          next={fetchNextPageOfferreceive}
                          hasMore={Offerreceive?.pages.length
                                * DEFAULT_PAGE_LIMIT < Offerreceive?.pages[0].pageInfo.totalNum}
                          loader={<h4>Loading...</h4>}
                          initialScrollY={1}
                        >
                          {Offerreceive?.pages.map((page) => page?.offers?.map((item) => (
                            <OfferItem offers={item} />
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
                            border="1px solid #999999"
                            borderStyle="dashed"
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
                          to={`/collection/${address}?collectionId=${item.id}`}
                        >
                          <Flex
                            key={item.id}
                            width="230px"
                            borderRadius="4px"
                            border="1px solid #000000"
                            flexDirection="column"
                          >
                            <Image w="100%" h="230px" src={`${PINATA_SERVER}${item.metadata?.logoUrl}`} alt="" />
                            <Text
                              w="100%"
                              background="#000000"
                              pl="16px"
                              lineHeight="54px"
                              fontSize="16px"
                              fontFamily="TTHoves-Regular, TTHoves"
                              fontWeight="400"
                              color="#FFFFFF"
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
        </Flex>
      </Flex>
    </MainContainer>
  );
};

export default Account;
