/* eslint-disable camelcase */
import React, {
  FC, useState, MouseEventHandler, ChangeEventHandler,
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Link,
  Flex,
  Image,
  Text,
  TabPanel,
  Container,
  Box,
  InputGroup,
  Input,
  Center,
  Spinner,
  SimpleGrid,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { InfiniteData } from 'react-query';
import { renderNmtNumberText } from '../../../components/Balance';
import { getBlock } from '../../../polkaSDK/api/getBlock';
import StatusSelector from '../../../components/StatusSelector';
import CollectionSelector from '../../../components/CollectionSelector';
import CategorySelector from '../../../components/CategorySelector';
import NftCard from '../../../components/NftCard';
import SortBy from '../../../components/SortBy';

import {
  IconAllState,
  IconAllStateone,
  IconSearch,
  Emptyimg,
} from '../../../assets/images';

import {
  DEFAULT_PAGE_LIMIT,
} from '../../../constants';

type Nfts = {
  nfts: Nft[],
  pageInfo: {
    pageNum: number
    pageSize: number
    totalNum: number
  }
}
type Categories = {
  categories: Category[],
}

interface Props {
  categoriesIsLoading:boolean,
  nftsIsLoading:boolean,
  statusArr: string[],
  selectedStatusArr: string[],
  handleSelectStatus: MouseEventHandler<HTMLButtonElement>,
  collections: Collection[],
  selectedCollection: string|undefined,
  handleSelectCollection: MouseEventHandler<HTMLButtonElement>,
  nftsData: InfiniteData<Nfts> | undefined
  handleSearch:ChangeEventHandler<HTMLInputElement>,
  categoriesData:Categories| undefined,
  selectedCategoryId:string
  handleSelectCategory:MouseEventHandler<HTMLButtonElement>,
  fetchNextPageNftsData: any,
  selectedSort: any,
  setSelectedSort: any,

}
const NftItem: FC<Props> = (({
  nftsData,
  statusArr,
  selectedStatusArr,
  handleSelectStatus,
  categoriesIsLoading,
  nftsIsLoading,
  collections,
  selectedCollection,
  handleSelectCollection,
  handleSearch,
  categoriesData,
  selectedCategoryId,
  handleSelectCategory,
  fetchNextPageNftsData,
  selectedSort,
  setSelectedSort,
}) => {
  const { t } = useTranslation();
  return (
    <Flex m="16px">
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
    </Flex>
  );
});
export default NftItem;
