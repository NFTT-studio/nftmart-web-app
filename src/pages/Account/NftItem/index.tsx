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
import StatusSelectorRow from '../../../components/StatusSelectorRow';
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
    <Flex width="100%" flexDirection="column" justifyContent="flex-start">
      {categoriesIsLoading || nftsIsLoading
        ? (
          <Center height="15vh">
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
          </Center>
        ) : null}
      <Flex
        width="100%"
        h="36px"
        flexFlow="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Flex>
          <SortBy selectedSort={selectedSort} setSelectedSort={setSelectedSort} />
          <StatusSelectorRow statusArr={statusArr} selectedArr={selectedStatusArr} handleSelect={handleSelectStatus} />
        </Flex>
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
      </Flex>
      <Flex width="100%" flexFlow="row wrap">
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
              m="20px 0 20px 0"
              columns={[1, 2, 3]}
              spacing="21px"
            >
              {nftsData?.pages.map((page) => page.nfts.map(
                (nft) => <NftCard nft={nft} />,
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
  );
});
export default NftItem;
