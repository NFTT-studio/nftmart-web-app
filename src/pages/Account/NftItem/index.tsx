/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import React, {
  FC, MouseEventHandler,
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Flex,
  Image,
  Text,
  Center,
  Spinner,
  SimpleGrid,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { InfiniteData } from 'react-query';
// import StatusSelectorRow from '../../../components/StatusSelectorRow';
import NftCard from '../../../components/NftCard';
// import SortBy from '../../../components/SortBy';

import {
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

interface Props {
  nftsIsLoading: boolean,
  nftsData: InfiniteData<Nfts> | undefined
  fetchNextPageNftsData: any,
  remainingTime: number
}
const NftItem: FC<Props> = (({
  nftsData,
  nftsIsLoading,
  fetchNextPageNftsData,
  remainingTime,
}) => {
  const { t } = useTranslation();
  return (
    <Flex maxWidth="1015px" width="100%" flexDirection="column" justifyContent="flex-start">
      <Flex
        width="100%"
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
          {nftsData?.pages[0].pageInfo.totalNum || 0}
          {' '}
          {t('results')}
        </Text>
        {/* <Flex>
          <StatusSelectorRow statusArr={statusArr} selectedArr={selectedStatusArr} handleSelect={handleSelectStatus} />
          <SortBy selectedSort={selectedSort} setSelectedSort={setSelectedSort} />
        </Flex> */}
      </Flex>
      <Flex width="100%" flexFlow="row wrap">
        {nftsIsLoading
          ? (
            <Center width="100%" height="500px">
              <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
            </Center>
          ) : nftsData?.pages[0].pageInfo.totalNum ? (
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
                columns={[1, 2, 2, 3, 3]}
                spacing="20px"
              >
                {nftsData?.pages.map((page) => page.nfts.map(

                  (nft) => (
                    <Flex
                      key={nft?.id}
                    >
                      <NftCard nft={nft} remainingTime={remainingTime} />
                    </Flex>
                  ),
                ))}
              </SimpleGrid>
            </InfiniteScroll>
          ) : (
            <Flex
              width="100%"
              height="500px"
              background="#FFFFFF"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Image
                w="150px"
                h="100px"
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
      </Flex>
    </Flex>
  );
});
export default NftItem;
