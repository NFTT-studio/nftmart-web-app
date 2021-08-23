import React, { useState, MouseEventHandler, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, RouteComponentProps, useLocation } from 'react-router-dom';
import {
  Tabs, TabList, TabPanels, TabPanel, Flex,
  Center,
  Spinner,
  Box,
  Text,
  Image,
  InputGroup,
  Input,
  Container,
  Button,
  SimpleGrid,
  Link,
} from '@chakra-ui/react';
import { union, without } from 'lodash';
import { parse } from 'search-params';
import InfiniteScroll from 'react-infinite-scroll-component';
import MainContainer from '../../layout/MainContainer';
import useCategories from '../../hooks/reactQuery/useCategories';
import CategorySelector from '../../components/CategorySelector';
import NftCard from '../../components/NftCard';
import useCollections from '../../hooks/reactQuery/useCollections';
import { useAppSelector } from '../../hooks/redux';
import {
  IconAllState,
  IconAllStateone,
  IconSearch,
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
  IconDetailshaSre,
  IconPen,
} from '../../assets/images';
import {
  DEFAULT_PAGE_LIMIT,
  PINATA_SERVER,
} from '../../constants';
import CollectionSelector from '../../components/CollectionSelector';
import SortBy from '../../components/SortBy';
import StatusSelector from '../../components/StatusSelector';
import { statusArr } from '../../constants/Status';
// import useCollections from '../../hooks/reactQuery/useCollections';
import useNftsPersonal from '../../hooks/reactQuery/useNftsPersonal';
import CreateCard from './CreateCard';
import OfferItem from './OfferItem';
import useAccount from '../../hooks/reactQuery/useAccount';
import Sort from '../../constants/Sort';
import useNfts from '../../hooks/reactQuery/useNfts';

const Account = ({ match }: RouteComponentProps<{ address: string }>) => {
  const { t } = useTranslation();
  const { address } = match.params;
  const formatAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  const TABS = [
    {
      id: '0', icon: IconWallet.default, iconS: IconWalletS.default, title: t('Account.myWallet'),
    },
    {
      id: '1',
      icon: IconCreate.default,
      iconS: IconCreateS.default,
      title: t('Account.Created'),
    },
    {
      id: '2', icon: IconOffers.default, iconS: IconOffersS.default, title: t('Account.offers'),
    },
    {
      id: '3',
      icon: IconDetailsocllections.default,
      iconS: IconDetailsocllectionsS.default,
      title: t('Account.collections'),
    },
  ];
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
  const { account } = chainState;
  const dataPerson = useAccount(address);
  const [isPerson, setIsPerson] = useState(false);

  const location = useLocation();
  const search = parse(location.search.replace('?', ''));

  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedStatusArr, setSelectedStatusArr] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollectionArr] = useState();
  const [selectedSort, setSelectedSort] = useState(Sort[1].key);

  const [selectTabId, setSelectTabId] = useState(Number(localStorage.getItem('ButtonSelect')) || 0);
  const handletabSelect: MouseEventHandler<HTMLButtonElement> = (event) => {
    setSelectTabId(Number(event.currentTarget.id));
    localStorage.setItem('ButtonSelect', event.currentTarget.id);
  };

  const [offersMadeButtonId, setOffersMadeButtonId] = useState(0);
  const handleButtonSelect: MouseEventHandler<HTMLButtonElement> = (event) => {
    setOffersMadeButtonId(Number(event.currentTarget.id));
  };

  const { data: categoriesData, isLoading: categoriesIsLoading } = useCategories();
  const { data: collectionsData } = useCollections({ address });

  const { data: nftsData, isLoading: nftsIsLoading, fetchNextPage: fetchNextPageNftsData } = useNftsPersonal(
    {
      ownerId: address,
      categoryId: selectedCategoryId,
      classId: selectedCollection,
      status: selectedStatusArr,
      sortBy: selectedSort,
    },
  );
  const { data: nftsDataCreate, fetchNextPage: fetchNextPageNftsDataCreate } = useNftsPersonal(
    {
      creatorId: address,
      categoryId: selectedCategoryId,
      collectionId: selectedCollection,
      status: selectedStatusArr,
      sortBy: selectedSort,
    },
  );
  const { data: offersBuyerIdArr, fetchNextPage: fetchNextPagesBuyer } = useNfts(
    {
      buyerId: address,
      collectionId: selectedCollection,
      status: selectedStatusArr,
    },
  );
  const { data: offersSellerArr, fetchNextPage: fetchNextPagesSeller } = useNfts(
    {
      sellerId: address,
      collectionId: selectedCollection,
      status: selectedStatusArr,
    },
  );

  const handleSelectCategory: MouseEventHandler<HTMLButtonElement> = (event) => {
    setSelectedCategoryId(event.currentTarget.id);
  };

  const handleSelectStatus: MouseEventHandler<HTMLButtonElement> = (event) => {
    const clickedStatus = event.currentTarget.id;
    setSelectedStatusArr(
      selectedStatusArr.indexOf(clickedStatus) > -1
        ? without(selectedStatusArr, event.currentTarget.id)
        : union(selectedStatusArr, [event.currentTarget.id]),
    );
  };

  const handleSelectCollection: MouseEventHandler<HTMLButtonElement> = (event) => {
    setSelectedCollectionArr(
      event.currentTarget.id,
    );
  };

  useEffect(() => {
    setSelectTabId(Number(localStorage.getItem('ButtonSelect')) || 0);
  }, [Number(localStorage.getItem('ButtonSelect'))]);

  const [collections, setCollections] = useState([]);

  useEffect(() => {
    setCollections(collectionsData?.collections);
  }, [collectionsData?.collections]);

  useEffect(() => {
    if (address === account?.address) {
      setIsPerson(true);
    }
  }, [account?.address, address, dataPerson]);

  const handleSearch: ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
    function checkAdult(o: any) {
      return o.metadata.name.indexOf(value) > -1;
    }
    setCollections(collectionsData.collections.filter(checkAdult));
  };

  return (
    <MainContainer title={t('Home.title')}>
      <Flex
        w="100%"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="center"
        position="relative"
        top="20px"
      >
        <Image w="100%" h="180px" src={AccountBanner.default} alt="" />
        <Flex
          w="100%"
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="center"
          position="relative"
          top="-60px"
        >
          <Image
            background="#FFFFFF"
            width="120px"
            borderRadius="50%"
            border="3px solid #FFFFFF"
            height="auto"
            objectFit="cover"
            src={HeadPortrait.default}
          />

          <Text
            mt="20px"
            fontSize="28px"
            fontFamily="TTHoves-Bold, TTHoves"
            fontWeight="bold"
            color="#191A24"
            lineHeight="33px"
          />
          <Text
            mt="12px"
            fontSize="14px"
            fontFamily="TTHoves-Regular, TTHoves"
            fontWeight="400"
            color="#999999"
            lineHeight="16px"
          >
            {dataPerson.data?.address}
          </Text>
        </Flex>
        <Flex position="absolute" right="20px" top="240px">
          <Link
            as={RouterLink}
            to="/profile"
          >
            <Box
              key="index"
              width="40px"
              height="40px"
              borderRadius="4px 0px 0px 4px"
              border="1px solid #E5E5E5"
              display="flex"
              justifyContent="center"
              alignItems="center"
              _hover={{
                boxShadow: '0px 2px 8px 0px #E1E1E1',
              }}
            >
              <Image
                w="22px"
                h="22px"
                src={IconPen.default}
              />
            </Box>
          </Link>
          <Box
            key="index"
            width="40px"
            height="40px"
            borderRadius="0px 4px 4px 0px"
            border="1px solid #E5E5E5"
            display="flex"
            justifyContent="center"
            alignItems="center"
            _hover={{
              boxShadow: '0px 2px 8px 0px #E1E1E1',
            }}
          >
            <Image
              w="22px"
              h="22px"
              src={IconDetailshaSre.default}
            />
          </Box>
        </Flex>
      </Flex>
      <Tabs w="100%">
        <TabList
          w="100%"
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="center"
          borderBottom="1px solid #000000"
        >
          {TABS.map((item, index) => (
            <Button
              key={item.id}
              id={item.id}
              mr="40px"
              mb="23px"
              height="36px"
              borderRadius="2px"
              display="flex"
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="center"
              onClick={handletabSelect}
              backgroundColor={selectTabId === index ? '#000000' : '#FFFFFF'}
            >
              <Image w="22px" h="22px" mr="5px" src={selectTabId === index ? item.iconS : item.icon} alt="" />
              <Text
                fontSize="16px"
                fontFamily="TTHoves-Medium, TTHoves"
                fontWeight="500"
                color={selectTabId === index ? '#FFFFFF' : '#191A24'}
                lineHeight="18px"
              >
                {item.title}
              </Text>
            </Button>
          ))}
        </TabList>

        <TabPanels>
          {selectTabId === 0 ? (
            <TabPanel>
              <Container mt="20px" display="flex">
                <Flex
                  w="260px"
                  h="492px"
                  flexDirection="column"
                  justifyContent="flex-start"
                  alignItems="center"
                  background="#F9F9F9"
                  borderRadius="4px"
                  p="20px"
                  border="1px solid #F9F9F9"
                  mr="16px"
                >
                  <Flex h="21px" width="100%" flexDirection="row" alignItems="center" mb="2px">
                    <Box as="img" src={IconAllState.default} alt="" w="22px" h="22px" mr="8px" />
                    <Text>{t('Browsing.status')}</Text>
                  </Flex>

                  <Flex width="100%" flexFlow="wrap" justifyContent="space-between">
                    <StatusSelector
                      statusArr={statusArr}
                      selectedArr={selectedStatusArr}
                      handleSelect={handleSelectStatus}
                    />
                  </Flex>
                  <Flex h="21px" width="100%" flexDirection="row" alignItems="center" m="22px 0 12px 0">
                    <Box as="img" src={IconAllStateone.default} alt="" w="22px" h="22px" mr="8px" />
                    <Text>{t('Browsing.collections')}</Text>
                  </Flex>
                  <InputGroup
                    variant="unstyled"
                    width="220px"
                    height="40px"
                    background="#FFFFFF"
                    borderRadius="4px"
                    border="1px solid #E5E5E5"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    p="0px 0 0px 12px"
                    m="0px 0 12px 0px"
                  >
                    <Image w="16px" h="16px" mr="6px" src={IconSearch.default} alt="" />
                    <Input
                      fontSize="14px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#999999"
                      placeholder={t('Browsing.collectionPlaceholder')}
                      onChange={handleSearch}
                    />
                  </InputGroup>

                  <CollectionSelector
                    collectionArr={collections}
                    selectedArr={selectedCollection}
                    handleSelect={handleSelectCollection}
                  />
                </Flex>

                <Flex width="1088px" flexDirection="column" justifyContent="flex-start">
                  {categoriesIsLoading || nftsIsLoading
                    ? (
                      <Center height="15vh">
                        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                      </Center>
                    ) : null}
                  <Flex h="36px">
                    {categoriesData ? (
                      <CategorySelector
                        list={categoriesData!.categories}
                        selectId={selectedCategoryId}
                        handleSelect={handleSelectCategory}
                      />
                    ) : ''}
                  </Flex>
                  <Flex
                    m="29px 0 20px 0"
                    width="1088px"
                    h="36px"
                    flexFlow="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text
                      fontSize="14px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#999999"
                    >
                      {nftsData?.pages[0].pageInfo.totalNum}
                      {' '}
                      results
                    </Text>
                    <SortBy selectedSort={selectedSort} setSelectedSort={setSelectedSort} />
                  </Flex>
                  <Flex width="1088px" flexFlow="row wrap" justifyContent="space-between">
                    {nftsData?.pages.length ? (
                      <InfiniteScroll
                        dataLength={nftsData?.pages.length * DEFAULT_PAGE_LIMIT}
                        next={fetchNextPageNftsData}
                        hasMore={nftsData?.pages.length * DEFAULT_PAGE_LIMIT < nftsData?.pages[0].pageInfo.totalNum}
                        loader={<h4>Loading...</h4>}
                        initialScrollY={1}
                      >
                        <SimpleGrid
                          w="100%"
                          columns={4}
                          spacing={4}
                        >
                          {nftsData?.pages.map((page) => page.nfts.map(
                            (nft) => <Flex m="11px"><NftCard nft={nft} /></Flex>,
                          ))}
                        </SimpleGrid>
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
                          No data yet
                        </Text>
                      </Flex>
                    )}
                  </Flex>
                </Flex>
              </Container>
            </TabPanel>
          ) : ''}
          {selectTabId === 1 ? (
            <TabPanel>
              <Container mt="20px" display="flex">
                <Flex
                  w="260px"
                  h="492px"
                  flexDirection="column"
                  justifyContent="flex-start"
                  alignItems="center"
                  background="#F9F9F9"
                  borderRadius="4px"
                  p="20px"
                  border="1px solid #F9F9F9"
                  mr="16px"
                >
                  <Flex h="21px" width="100%" flexDirection="row" alignItems="center" mb="2px">
                    <Box as="img" src={IconAllState.default} alt="" w="22px" h="22px" mr="8px" />
                    <Text>{t('Browsing.status')}</Text>
                  </Flex>

                  <Flex width="100%" flexFlow="wrap" justifyContent="space-between">
                    <StatusSelector
                      statusArr={statusArr}
                      selectedArr={selectedStatusArr}
                      handleSelect={handleSelectStatus}
                    />
                  </Flex>
                  <Flex h="21px" width="100%" flexDirection="row" alignItems="center" m="22px 0 12px 0">
                    <Box as="img" src={IconAllStateone.default} alt="" w="22px" h="22px" mr="8px" />
                    <Text>{t('Browsing.collections')}</Text>
                  </Flex>
                  <InputGroup
                    variant="unstyled"
                    width="220px"
                    height="40px"
                    background="#FFFFFF"
                    borderRadius="4px"
                    border="1px solid #E5E5E5"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    p="0px 0 0px 12px"
                    m="0px 0 12px 0px"
                  >
                    <Image w="16px" h="16px" mr="6px" src={IconSearch.default} alt="" />
                    <Input
                      fontSize="14px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#999999"
                      placeholder={t('Browsing.collectionPlaceholder')}
                      onChange={handleSearch}
                    />
                  </InputGroup>

                  <CollectionSelector
                    collectionArr={collections}
                    selectedArr={selectedCollection}
                    handleSelect={handleSelectCollection}
                  />
                </Flex>

                <Flex width="1088px" flexDirection="column" justifyContent="flex-start">
                  {categoriesIsLoading || nftsIsLoading
                    ? (
                      <Center height="15vh">
                        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                      </Center>
                    ) : null}
                  <Flex h="36px">
                    {categoriesData ? (
                      <CategorySelector
                        list={categoriesData!.categories}
                        selectId={selectedCategoryId}
                        handleSelect={handleSelectCategory}
                      />
                    ) : ''}
                  </Flex>
                  <Flex
                    m="29px 0 20px 0"
                    width="1088px"
                    h="36px"
                    flexFlow="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text
                      fontSize="14px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#999999"
                    >
                      {nftsDataCreate?.pages[0].pageInfo.totalNum}
                      {' '}
                      results
                    </Text>
                    <SortBy selectedSort={selectedSort} setSelectedSort={setSelectedSort} />
                  </Flex>
                  <Flex width="1088px" flexFlow="row wrap" justifyContent="space-between">
                    {nftsDataCreate?.pages.length ? (
                      <InfiniteScroll
                        dataLength={nftsDataCreate?.pages.length * DEFAULT_PAGE_LIMIT}
                        next={fetchNextPageNftsData}
                        hasMore={
                          nftsDataCreate?.pages.length * DEFAULT_PAGE_LIMIT < nftsDataCreate?.pages[0].pageInfo.totalNum
                        }
                        loader={<h4>Loading...</h4>}
                        initialScrollY={1}
                      >
                        <SimpleGrid
                          w="100%"
                          columns={4}
                          spacing={4}
                        >
                          {nftsDataCreate?.pages.map((page) => page.nfts.map(
                            (nft) => <Flex m="11px"><NftCard nft={nft} /></Flex>,
                          ))}
                        </SimpleGrid>
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
                          No data yet
                        </Text>
                      </Flex>
                    )}
                  </Flex>
                </Flex>
              </Container>
            </TabPanel>
          ) : ''}
          {selectTabId === 2 ? (
            <TabPanel>
              <Container mt="20px" display="flex">
                <Flex
                  w="260px"
                  h="492px"
                  flexDirection="column"
                  justifyContent="flex-start"
                  alignItems="center"
                  background="#F9F9F9"
                  borderRadius="4px"
                  p="20px"
                  border="1px solid #F9F9F9"
                  mr="16px"
                >
                  <Flex h="21px" width="100%" flexDirection="row" alignItems="center" mb="2px">
                    <Box as="img" src={IconAllState.default} alt="" w="22px" h="22px" mr="8px" />
                    <Text>{t('Browsing.status')}</Text>
                  </Flex>

                  <Flex width="100%" flexFlow="wrap" justifyContent="space-between">
                    <StatusSelector
                      statusArr={statusArr}
                      selectedArr={selectedStatusArr}
                      handleSelect={handleSelectStatus}
                    />
                  </Flex>
                  <Flex h="21px" width="100%" flexDirection="row" alignItems="center" m="22px 0 12px 0">
                    <Box as="img" src={IconAllStateone.default} alt="" w="22px" h="22px" mr="8px" />
                    <Text>{t('Browsing.collections')}</Text>
                  </Flex>
                  <InputGroup
                    variant="unstyled"
                    width="220px"
                    height="40px"
                    background="#FFFFFF"
                    borderRadius="4px"
                    border="1px solid #E5E5E5"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    p="0px 0 0px 12px"
                    m="0px 0 12px 0px"
                  >
                    <Image w="16px" h="16px" mr="6px" src={IconSearch.default} alt="" />
                    <Input
                      fontSize="14px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#999999"
                      placeholder={t('Browsing.collectionPlaceholder')}
                    />
                  </InputGroup>

                  <CollectionSelector
                    collectionArr={collections}
                    selectedArr={selectedCollection}
                    handleSelect={handleSelectCollection}
                  />
                </Flex>

                <Flex width="1088px" flexDirection="column" justifyContent="flex-start">
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
                  <Flex width="1088px" flexDirection="column" textAlign="center">
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
                          {offersBuyerIdArr?.pages.length ? (
                            <InfiniteScroll
                              dataLength={offersBuyerIdArr?.pages.length * DEFAULT_PAGE_LIMIT}
                              next={fetchNextPagesBuyer}
                              hasMore={offersBuyerIdArr?.pages.length
                                * DEFAULT_PAGE_LIMIT < offersBuyerIdArr?.pages[0].pageInfo.totalNum}
                              loader={<h4>Loading...</h4>}
                              initialScrollY={1}
                            >
                              {offersBuyerIdArr?.pages.map((page) => page?.orders?.map((item) => (
                                <OfferItem offer={item} />
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
                                No data yet
                              </Text>
                            </Flex>
                          )}
                        </>
                      )
                      : null}
                    {offersMadeButtonId === 1
                      ? (
                        <>
                          {offersSellerArr?.pages.length ? (
                            <InfiniteScroll
                              dataLength={offersSellerArr?.pages.length * DEFAULT_PAGE_LIMIT}
                              next={fetchNextPagesSeller}
                              hasMore={offersSellerArr?.pages.length
                                * DEFAULT_PAGE_LIMIT < offersSellerArr?.pages[0].pageInfo.totalNum}
                              loader={<h4>Loading...</h4>}
                              initialScrollY={1}
                            >
                              {offersSellerArr?.pages.map((page) => page?.orders?.map((item) => (
                                <OfferItem offer={item} />
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
                                No data yet
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
              </Container>
            </TabPanel>
          ) : ''}
          {selectTabId === 3 ? (
            <Container mt="40px">
              <SimpleGrid
                columns={5}
                spacing={4}
              >
                {isPerson ? <CreateCard /> : ''}
                {collectionsData ? collectionsData.collections.map((item) => (
                  <Link
                    as={RouterLink}
                    to={`/collection/${address}?collectionId=${item.id}`}
                  >
                    <Flex
                      key={item.id}
                      width="260px"
                      borderRadius="4px"
                      border="1px solid #000000"
                      flexDirection="column"
                    >
                      <Image w="100%" h="260px" src={`${PINATA_SERVER}${item.metadata.logoUrl}`} alt="" />
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
                        {item.metadata.name}
                      </Text>
                    </Flex>
                  </Link>
                )) : ''}
              </SimpleGrid>
            </Container>
          ) : ''}
        </TabPanels>
      </Tabs>
    </MainContainer>
  );
};

export default Account;
