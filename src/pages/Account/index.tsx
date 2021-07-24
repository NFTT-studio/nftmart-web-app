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
import MainContainer from '../../layout/MainContainer';
import useNfts from '../../hooks/reactQuery/useNfts';
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
  IconPen,
  IconDetailshaSre,
  // IconOffers,
  IconWallet,
  IconDetailsocllections,
  // IconOffersS,
  IconWalletS,
  IconDetailsocllectionsS,
  HeadPortrait,
} from '../../assets/images';
import {
  PINATA_SERVER,
} from '../../constants';
import CollectionSelector from '../../components/CollectionSelector';
import SortBy from '../../components/SortBy';
import StatusSelector from '../../components/StatusSelector';
import { statusArr } from '../../constants/Status';
// import useCollections from '../../hooks/reactQuery/useCollections';
import useNftsPersonal from '../../hooks/reactQuery/useNftsPersonal';
import CreateCard from './CreateCard';
import useAccount from '../../hooks/reactQuery/useAccount';
import useIsLoginAddress from '../../hooks/utils/useIsLoginAddress';
import Sort from '../../constants/Sort';

const Account = ({ match }: RouteComponentProps<{ address: string }>) => {
  const { t } = useTranslation();
  const { address } = match.params;

  const isLoginAddress = useIsLoginAddress(address);

  const TABS = [
    {
      id: '0', icon: IconWallet.default, iconS: IconWalletS.default, title: t('Account.Mywallet'),
    },
    // {
    //   id: '1', icon: IconOffers.default, iconS: IconOffersS.default, title: t('Account.Offers'),
    // },
    {
      id: '1',
      icon: IconDetailsocllections.default,
      iconS: IconDetailsocllectionsS.default,
      title: t('Account.collections'),
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

  const [selectTabId, setSelectTabId] = useState(Number(search.id) || 0);
  const handletabSelect: MouseEventHandler<HTMLButtonElement> = (event) => {
    setSelectTabId(Number(event.currentTarget.id));
  };

  const [offersMadeButtonId, setoffersMadeButtonId] = useState(0);
  const handleButtonSelect: MouseEventHandler<HTMLButtonElement> = (event) => {
    setoffersMadeButtonId(Number(event.currentTarget.id));
  };

  const { data: categoriesData, isLoading: categoriesIsLoading } = useCategories();
  const { data: collectionsData, isLoading: collectionsIsLoading } = useCollections({ address });

  const { data: nftsData, isLoading: nftsIsLoading } = useNftsPersonal(
    {
      ownerId: address,
      categoryId: selectedCategoryId,
      collectionId: selectedCollection,
      status: selectedStatusArr,
      sortBy: selectedSort,
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
    setSelectTabId(Number(search.id) || 0);
  }, [search.id]);

  const [collections, setCollections] = useState([]);

  useEffect(() => {
    setCollections(collectionsData?.collections);
  }, [collectionsData?.collections]);
  useEffect(() => {
    if (address === account?.address) {
      setIsPerson(true);
    }
  }, [dataPerson]);
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
            width="120px"
            height="120px"
            border="3px solid #FFFFFF"
            borderRadius="50%"
            src={HeadPortrait.default}
            alt=""
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
        {/* <Flex position="absolute" right="20px" top="240px">
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
        </Flex> */}
      </Flex>
      <Tabs w="100%">
        <TabList
          w="100%"
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="center"
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
              <Container mt="40px" display="flex">
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
                    <Text>{t('Browsing.Status')}</Text>
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
                    <Text>{t('Browsing.Collections')}</Text>
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
                    m="12px 0 20px 0px"
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
                      {nftsData?.pageInfo.totalNum}
                      {' '}
                      results
                    </Text>
                    <SortBy selectedSort={selectedSort} setSelectedSort={setSelectedSort} />
                  </Flex>
                  <Flex width="1088px" flexFlow="row wrap" justifyContent="space-between">
                    <SimpleGrid
                      w="100%"
                      columns={4}
                      spacing={4}
                    >
                      {nftsData?.nfts.map((nft) => <Flex mb="16px"><NftCard nft={nft} /></Flex>)}
                    </SimpleGrid>
                  </Flex>
                </Flex>
              </Container>
            </TabPanel>
          ) : ''}

          {/* {selectTabId === 1 ? (
            <TabPanel>
              <Container mt="40px" display="flex">
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
                    <Text>{t('Browsing.Status')}</Text>
                  </Flex>

                  <Flex width="100%" flexFlow="wrap" justifyContent="space-between">
                    <StatusSelector statusArr={statusArr} selectedArr={selectedStatusArr} handleSelect={handleSelectStatus} />
                  </Flex>
                  <Flex h="21px" width="100%" flexDirection="row" alignItems="center" m="22px 0 12px 0">
                    <Box as="img" src={IconAllStateone.default} alt="" w="22px" h="22px" mr="8px" />
                    <Text>{t('Browsing.Collections')}</Text>
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
                    m="12px 0 20px 0px"
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
                    collectionArr={collectionsData!.list}
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
                        {t('Account.UnitPrice')}
                      </Text>
                      <Text
                        width="60px"
                        fontSize="12px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#000000"
                        lineHeight="20px"
                      >
                        {t('Account.Quantity')}
                      </Text>
                      <Text
                        width="60px"
                        fontSize="12px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#000000"
                        lineHeight="20px"
                      >
                        {t('Account.From')}
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
                        {t('Account.Expiration')}
                      </Text>
                    </Flex>
                    {offersMadeArr.map((item, index) => (
                      <Flex
                        key={item}
                        p="0 20px"
                        width="100%"
                        height="81px"
                        flexFlow="row"
                        justifyContent="space-between"
                        alignItems="center"
                        borderBottom="1px solid #E5E5E5"
                      >
                        <Flex
                          flexDirection="row"
                          justifyContent="flex-start"
                          width="224px"
                          textAlign="left"
                          fontSize="12px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#000000"
                          lineHeight="20px"
                        >
                          <Image
                            mr="10px"
                            width="54px"
                            height="40px"
                            borderRadius="4px"
                            src={AccountBanner.default}
                            alt=""
                          />
                          <Flex
                            flexDirection="column"
                            textAlign="left"
                            fontSize="12px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#999999"
                            lineHeight="14px"
                          >
                            <Text
                              mb="5px"
                              width="60px"
                              fontSize="14px"
                              fontFamily="TTHoves-Regular, TTHoves"
                              fontWeight="400"
                              color="#000000"
                              lineHeight="20px"
                            >
                              BeSide
                            </Text>
                            <Text>
                              Parity Asia hackathon
                            </Text>
                          </Flex>
                        </Flex>
                        <Text
                          display="flex"
                          flexDirection="row"
                          justifyContent="center"
                          fontSize="12px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#000000"
                          lineHeight="20px"
                        >
                          29084
                          <Text
                            ml="3px"
                            fontSize="14px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#999999"
                            lineHeight="20px"
                          >
                            NMT
                          </Text>
                        </Text>
                        <Text
                          width="60px"
                          fontSize="14px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#000000"
                          lineHeight="20px"
                        >
                          6
                        </Text>
                        <Text
                          width="60px"
                          fontSize="14px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#000000"
                          lineHeight="20px"
                        >
                          4tf...fp
                        </Text>
                        <Text
                          width="120px"
                          textAlign="right"
                          fontSize="14px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#000000"
                          lineHeight="20px"
                          textStroke="1px #979797"
                        >
                          in 2 hours
                        </Text>
                      </Flex>
                    ))}
                  </Flex>
                </Flex>
              </Container>
            </TabPanel>
          ) : ''} */}
          {selectTabId === 1 ? (
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
                      key={item}
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
