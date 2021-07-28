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

import { useTranslation } from 'react-i18next';
import MainContainer from '../../layout/MainContainer';
import CategorySelector from '../../components/CategorySelector';
import useCategories from '../../hooks/reactQuery/useCategories';
import StatusSelector from '../../components/StatusSelector';
import CollectionSelector from '../../components/CollectionSelector';
import useCollections from '../../hooks/reactQuery/useCollections';
import useNfts from '../../hooks/reactQuery/useNfts';
import OrderCard from '../../components/OrderCard ';
import SortBy from '../../components/SortBy';

import {
  IconSearch,
  IconAllState,
  IconAllStateone,
  Emptyimg,
} from '../../assets/images';
import useParams from '../../hooks/url/useParams';
import { statusArr } from '../../constants/Status';
import Sort from '../../constants/Sort';

const Browsing = () => {
  const { t } = useTranslation();

  const params = useParams();
  const status = params.get('status');

  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedStatusArr, setSelectedStatusArr] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollectionIdArr] = useState();
  const [selectedSort, setSelectedSort] = useState(Sort[1].key);

  const { data: categoriesData, isLoading: categoriesIsLoading } = useCategories();
  const { data: collectionsData, isLoading: collectionsIsLoading } = useCollections({});
  const { data: nftsData, isLoading: nftsIsLoading } = useNfts(
    {
      categoryId: selectedCategoryId,
      collectionId: selectedCollection,
      status: selectedStatusArr,
      sortBy: selectedSort,
    },
  );

  const [collectionsArr, setCollectionsArr] = useState<Collection[]>([]);

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
    setSelectedCollectionIdArr(event.currentTarget.id);
  };

  const handleSearch: ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
    function check(collection: Collection) {
      return collection.metadata.name.indexOf(value) > -1;
    }
    if (collectionsData) {
      setCollectionsArr(collectionsData.collections.filter(check));
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
    if (collectionsData) {
      setCollectionsArr(collectionsData.collections);
    }
  }, [collectionsData]);

  return (
    <MainContainer title={t('Browsing.title')}>
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
          {collectionsArr?.length

            ? (
              <CollectionSelector
                collectionArr={collectionsArr}
                selectedArr={selectedCollection}
                handleSelect={handleSelectCollection}
              />
            ) : <Image w="100%" h="auto" mr="" src={Emptyimg.default} alt="" />}

        </Flex>

        <Flex width="1088px" flexDirection="column" justifyContent="flex-start">
          {categoriesIsLoading || collectionsIsLoading || nftsIsLoading
            ? (
              <Center height="100%">
                <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
              </Center>
            ) : null}
          <Flex h="36px">
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
          <Flex width="1088px">
            {nftsData?.orders.length
              ? (
                <SimpleGrid
                  w="100%"
                  columns={4}
                >
                  {nftsData?.orders.map((nft) => <Flex mb="11px"><OrderCard nft={nft} /></Flex>)}
                </SimpleGrid>
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
    </MainContainer>
  );
};

export default Browsing;
