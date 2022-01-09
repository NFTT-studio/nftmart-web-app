/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-nested-ternary */
import React, {
  useState, useEffect, MouseEventHandler, ChangeEventHandler,
} from 'react';
import {
  Spinner,
  Flex,
  Container,
  Box,
  Text,
  InputGroup,
  Input,
  Image,
  Center,
  SimpleGrid,
} from '@chakra-ui/react';
import { union, without } from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useTranslation } from 'react-i18next';
import MainContainer from '../../layout/MainContainer';
import CategorySelector from '../../components/CategorySelector';
import useCategories from '../../hooks/reactQuery/useCategories';
import StatusSelector from '../../components/StatusSelector';
import CollectionSelector from '../../components/CollectionSelector';
import useCollections from '../../hooks/reactQuery/useCollectionsRecommend';
import useNftsAll from '../../hooks/reactQuery/useNftsAll';
import OrderCard from '../../components/OrderCard';
import SortBy from '../../components/SortBy';

import {
  IconSearch,
  IconAllState,
  IconAllStateone,
  Emptyimg,
  Historyempty,
} from '../../assets/images';
import { statusArr } from '../../constants/Status';
import Sort from '../../constants/Sort';
import { DEFAULT_PAGE_LIMIT } from '../../constants';
import { getBlock } from '../../polkaSDK/api/getBlock';

const Browsing = () => {
  function GetQueryString(name) {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
    const r = decodeURI(window.location.search.substr(1)).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }
  const status = GetQueryString('status');
  const { t } = useTranslation();

  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedStatusArr, setSelectedStatusArr] = useState<string[]>();
  const [selectedCollection, setSelectedCollectionIdArr] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState(Sort[1].key);
  const [remainingTime, setRemainingTime] = useState(0);

  const { data: categoriesData, isLoading: categoriesIsLoading } = useCategories();
  const { data: collectionsData, isLoading: collectionsIsLoading, refetch: fetchCollections } = useCollections({
    limit: 1000,
  });
  const {
    data: nftsData, isLoading: nftsIsLoading, fetchNextPage, refetch: refetchnftsData,
  } = useNftsAll(
    {
      categoryId: selectedCategoryId,
      collectionId: selectedCollection,
      status: selectedStatusArr,
      sortBy: selectedSort,
    },
  );
  useEffect(() => {
    getBlock().then((res) => {
      setRemainingTime(res);
    });
    fetchCollections();
  }, []);

  const [collectionsArr, setCollectionsArr] = useState<Collection[]>([]);

  const handleSelectCategory: MouseEventHandler<HTMLButtonElement> = (event) => {
    setSelectedCategoryId(event.currentTarget.id);
    setSelectedCollectionIdArr([]);
  };

  const handleSelectStatus: MouseEventHandler<HTMLButtonElement> = (event) => {
    const clickedStatus = event.currentTarget.id;
    // setSelectedStatusArr([clickedStatus]);
    setSelectedStatusArr(
      selectedStatusArr?.indexOf(clickedStatus) > -1
        ? without(selectedStatusArr, event.currentTarget.id)
        : [clickedStatus],
    );
    // setSelectedStatusArr(
    //   selectedStatusArr.indexOf(clickedStatus) > -1
    //     ? without(selectedStatusArr, event.currentTarget.id)
    //     : union(selectedStatusArr, [event.currentTarget.id]),
    // );
  };

  const handleSelectCollection: MouseEventHandler<HTMLButtonElement> = (event) => {
    const selected = event.currentTarget.id;
    setSelectedCollectionIdArr(
      selectedCollection.indexOf(selected) > -1
        ? without(selectedCollection, event.currentTarget.id)
        : union(selectedCollection, [event.currentTarget.id]),
    );
    setSelectedCategoryId('');
  };

  const handleSearch: ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
    function check(collection: Collection) {
      return collection.metadata.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
    }
    if (collectionsData) {
      setCollectionsArr(collectionsData?.pages[0]?.collections.filter(check));
    }
  };

  useEffect(() => {
    if (status) {
      setSelectedStatusArr([status]);
    } else {
      setSelectedStatusArr([]);
    }
  }, [status]);

  useEffect(() => {
    if (selectedStatusArr) {
      refetchnftsData();
    }
  }, [selectedStatusArr, selectedSort, selectedCategoryId, selectedCollection]);
  useEffect(() => {
    if (collectionsData?.pages[0]?.collections) {
      setCollectionsArr(collectionsData?.pages[0]?.collections);
    }
  }, [collectionsData]);

  return (
    <MainContainer title={`${t('Browsing.title')}|${t('Home.title')}`}>
      <Container className="container" w="100%" mt="40px" display="flex" justifyContent="space-between" p="0 50px">
        <Flex
          w="260px"
          h="790px"
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
            <Text
              fontSize="16px"
              fontFamily="TTHoves-Medium, TTHoves"
              fontWeight="500"
              color="#000000"
              lineHeight="18px"
            >
              {t('Browsing.status')}
            </Text>
          </Flex>

          <Flex width="100%" flexFlow="wrap" justifyContent="space-between">
            <StatusSelector statusArr={statusArr} selectedArr={selectedStatusArr} handleSelect={handleSelectStatus} />
          </Flex>
          <Flex h="21px" width="100%" flexDirection="row" alignItems="center" m="22px 0 20px 0">
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
          {collectionsIsLoading
            ? (
              <Center height="100%">
                <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
              </Center>
            ) : (collectionsArr?.length
              ? (
                <CollectionSelector
                  collectionArr={collectionsArr}
                  selectedArr={selectedCollection}
                  handleSelect={handleSelectCollection}
                />
              ) : <Image w="100%" h="auto" mr="" src={Emptyimg.default} alt="" />)}

        </Flex>

        <Flex w="100%" flexDirection="column" justifyContent="flex-start">

          <Flex minH="36px" w="100%">
            {categoriesData
              ? (
                <CategorySelector
                  list={categoriesData.categories}
                  selectId={selectedCategoryId}
                  handleSelect={handleSelectCategory}
                />
              ) : null}
          </Flex>
          <Flex
            m="29px 0 20px 0"
            h="36px"
            flexFlow="row"
            justifyContent="space-between"
            alignItems="flex-end"
          >
            <Text
              ml="4px"
              fontSize="14px"
              fontFamily="TTHoves-Regular, TTHoves"
              fontWeight="400"
              color="#999999"
            >
              {/* {nftsData?.pages[0].pageInfo.totalNum || 0}
              {' '}
              {t('results')} */}
            </Text>
            <SortBy selectedSort={selectedSort} setSelectedSort={setSelectedSort} />
          </Flex>
          <Flex w="100%">
            {nftsIsLoading
              ? (
                <Center width="100%" height="353px">
                  <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                </Center>
              ) : nftsData?.pages[0].pageInfo.totalNum
                ? (
                  <InfiniteScroll
                    className="browsingScroll"
                    dataLength={nftsData?.pages.length * DEFAULT_PAGE_LIMIT}
                    next={fetchNextPage}
                    hasMore={nftsData?.pages.length * DEFAULT_PAGE_LIMIT < nftsData?.pages[0].pageInfo.totalNum}
                    loader={<h4>Loading...</h4>}
                    initialScrollY={1}
                  >
                    <SimpleGrid
                      display={nftsData?.pages[0].pageInfo.totalNum < 5 ? 'flex' : 'grid'}
                      width="100%"
                      p="5px 5px 0 5px"
                      m="0px 0px 20px 0px"
                      minChildWidth="280px"
                      // gridTemplateColumns="repeat(auto-fit, minmax(280px,320px))"
                      spacing="20px"
                    >
                      {nftsData?.pages.map((page) => page.nfts.map(
                        (nft) => (
                          <Flex
                            key={nft?.id}
                          >
                            <OrderCard nft={nft} remainingTime={remainingTime} />
                          </Flex>
                        ),
                      ))}
                    </SimpleGrid>
                  </InfiniteScroll>
                ) : (
                  <Flex
                    width="100%"
                    height="353px"
                    background="#FFFFFF"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Image
                      w="150px"
                      h="100px"
                      borderStyle="dashed"
                      src={Historyempty.default}
                    />
                    <Text
                      mt="10px"
                      fontSize="14px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#999999"
                      lineHeight="20px"
                    >
                      {t('Detail.noDataYet')}
                    </Text>
                  </Flex>
                )}
          </Flex>
        </Flex>
      </Container>
    </MainContainer>
  );
};

export default Browsing;
