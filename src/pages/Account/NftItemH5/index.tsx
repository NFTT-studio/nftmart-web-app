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
import NftCard from '../../../components/OrderCard';
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
    <Flex width="100%" flexDirection="column" justifyContent="flex-start">
      <Flex
        width="100%"
        justifyContent="center"
      >
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
              <Flex
                w="100%"
                flexDirection="column"
                alignItems="center"
              >
                {nftsData?.pages.map((page) => page.nfts.map(

                  (nft) => (
                    <Flex
                      mt="25px"
                      w="100%"
                      key={nft?.id}
                      justifyContent="center"
                    >
                      <NftCard nft={nft} remainingTime={remainingTime} />
                    </Flex>
                  ),
                ))}
              </Flex>
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
