import React, { useEffect, useState } from 'react';

import {
  Flex,
  Image,
  Avatar,
  Text,
  Center,
  Spinner,
  Button,
  SimpleGrid,
  Box,
  Link,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps, useLocation, useHistory } from 'react-router-dom';
import { parse } from 'search-params';
import InfiniteScroll from 'react-infinite-scroll-component';
import MainContainer from '../../layout/MainContainer';
import NftCard from '../../components/NftCard';
import { useAppSelector } from '../../hooks/redux';
import useCollectionsSinger from '../../hooks/reactQuery/useCollectionsSinger';

import {
  CollectionBackground,
  WEBSITE,
  DISCORD,
  TWITTER,
  IconIns,
  medium,
  telegram,
  IconDetailsocllections,
} from '../../assets/images';
import {
  PINATA_SERVER,
  DEFAULT_PAGE_LIMIT,
} from '../../constants';
import SortBy from '../../components/SortBy';
import useNftsPersonal from '../../hooks/reactQuery/useNftsPersonal';
import useAccount from '../../hooks/reactQuery/useAccount';
import Sort from '../../constants/Sort';

const ICONS = [
  { icon: WEBSITE.default, name: 'website' },
  { icon: DISCORD.default, name: 'discord' },
  { icon: TWITTER.default, name: 'twitter' },
  { icon: IconIns.default, name: 'ins' },
  { icon: medium.default, name: 'medium' },
  { icon: telegram.default, name: 'telegram' },
];

const Collection = ({ match }: RouteComponentProps<{ address: string }>) => {
  const { t } = useTranslation();

  const chainState = useAppSelector((state) => state.chain);
  const { account } = chainState;
  const { address } = match.params;
  const location = useLocation();
  const [isPerson, setIsPerson] = useState(false);
  const dataPerson = useAccount(address);
  const search = parse(location.search.replace('?', ''));
  const ownerId = address;
  const classId = search.collectionId;

  const { data: collectionsData } = useCollectionsSinger(classId);
  const links = collectionsData?.collection?.metadata?.links;
  const ICON_LIST = ICONS.map((item, index) => ({
    src: item.icon,
    id: index,
    link: links ? links[item.name] : '',
  }));

  const [selectedSort, setSelectedSort] = useState(Sort[1].key);
  const { data: nftsData, isLoading, fetchNextPage } = useNftsPersonal(
    {
      classId,
      sortBy: selectedSort,
    },
  );
  const history = useHistory();
  function handleCreate() {
    history.push(`/profile/nft/create/${classId}`);
  }
  useEffect(() => {
    if (collectionsData?.collection?.creator_id === account?.address) {
      setIsPerson(true);
    }
  }, [collectionsData?.collection?.creator_id, address, dataPerson]);

  if (isLoading) {
    return (
      <Center height="100vh">
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Center>
    );
  }
  return (
    <MainContainer title={`${collectionsData?.collection?.metadata.name}${t('Collection.title')}`}>
      {isPerson ? (
        <Flex
          w="100vw"
          background="#F9F9F9"
          justifyContent="center"
          h="80px"
          alignItems="center"
        >
          <Flex
            width="100%"
            maxWidth="1364px"
            justifyContent="flex-end"
          >
            {/* <Button
              mr="10px"
              width="137px"
              height="40px"
              background="#FFFFFF"
              borderRadius="4px"
              border="1px solid #000000"
              fontSize="14px"
              fontFamily="TTHoves-Regular, TTHoves"
              fontWeight="400"
              color="#000000"
              lineHeight="16px"
              _hover={{
                background: '#000000',
                color: '#FFFFFF',
              }}
            >
              {t('Collection.Editprofile')}
            </Button> */}
            <Button
              width="137px"
              height="40px"
              background="#FFFFFF"
              borderRadius="4px"
              border="1px solid #000000"
              fontSize="14px"
              fontFamily="TTHoves-Regular, TTHoves"
              fontWeight="400"
              color="#000000"
              lineHeight="16px"
              _hover={{
                background: '#000000',
                color: '#FFFFFF',
              }}
              onClick={handleCreate}
            >
              {t('Collection.addItem')}
            </Button>
          </Flex>
        </Flex>
      ) : ''}

      <Image mt="20px" maxWidth="1364px" width="100%" src={CollectionBackground.default} alt="banner" />
      <Flex w="100%" maxWidth="1364px" direction="row" paddingTop="20px" paddingBottom="20px">
        <Avatar
          m="0 20px"
          src={`${PINATA_SERVER}${collectionsData?.collection?.metadata.logoUrl}`}
          w="100px"
          h="100px"
        />
        <Flex w="100%" direction="column">
          <Flex h="33px" alignItems="center">
            <Text
              fontSize="28px"
              fontFamily="TTHoves-Bold, TTHoves"
              fontWeight="bold"
              color="#191A24"
              lineHeight="33px"
            >
              {collectionsData?.collection?.metadata.name}
            </Text>
            <Image
              ml="4px"
              w="18px"
              h="18px"
              src={IconDetailsocllections.default}
            />
          </Flex>
          <Text
            mt="12px"
            fontSize="14px"
            fontFamily="TTHoves-Light, TTHoves"
            fontWeight="300"
            color="#191A24"
            lineHeight="16px"
          >
            {collectionsData?.collection?.metadata.description}
          </Text>
          <Flex mt="24px">
            {/* <Flex mr="20px">
              <Image
                mR="4px"
                w="16px"
                h="16px"
                src={IconDetailsocllections.default}
              />
              <Text
                fontSize="14px"
                fontFamily="TTHoves-Regular, TTHoves"
                fontWeight="400"
                color="#000000"
                lineHeight="16px"
              >
                12,323 items
              </Text>
            </Flex>
            <Flex mr="20px">
              <Image
                mR="4px"
                w="16px"
                h="16px"
                src={IconDetailsocllections.default}
              />
              <Text
                fontSize="14px"
                fontFamily="TTHoves-Regular, TTHoves"
                fontWeight="400"
                color="#000000"
                lineHeight="16px"
              >
                4,323 owners
              </Text>
            </Flex>
            <Flex mr="20px">
              <Image
                mR="4px"
                w="16px"
                h="16px"
                src={IconDetailsocllections.default}
              />
              <Text
                fontSize="14px"
                fontFamily="TTHoves-Regular, TTHoves"
                fontWeight="400"
                color="#000000"
                lineHeight="16px"
              >
                12,993 viewers
              </Text>
            </Flex>
            <Flex mr="20px">
              <Image
                mR="4px"
                w="16px"
                h="16px"
                src={IconDetailsocllections.default}
              />
              <Text
                fontSize="14px"
                fontFamily="TTHoves-Regular, TTHoves"
                fontWeight="400"
                color="#000000"
                lineHeight="16px"
              >
                2,301 stars
              </Text>
            </Flex> */}
          </Flex>
        </Flex>
        <Flex>
          {ICON_LIST.map((item) => (
            item.link === '' ? null
              : (
                <Link
                  href={item.link}
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
                      src={item.src}
                    />
                  </Box>

                </Link>
              )
          ))}
        </Flex>

      </Flex>
      <Flex
        m="0px 0 0px 0"
        width="100%"
        maxWidth="1364px"
        h="36px"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
      >
        <Flex
          w="100%"
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
      </Flex>
      <InfiniteScroll
        dataLength={nftsData?.pages.length * DEFAULT_PAGE_LIMIT}
        next={fetchNextPage}
        hasMore={nftsData?.pages.length * DEFAULT_PAGE_LIMIT < nftsData?.pages[0].pageInfo.totalNum}
        loader={<h4>Loading...</h4>}
        initialScrollY={1}
      >
        <SimpleGrid
          w="100%"
          maxWidth="1364px"
          m="20px 0 20px 0"
          columns={5}
        >
          {nftsData?.pages.map((page) => page.nfts?.map(
            (nft) => <Flex m="16px"><NftCard nft={nft} /></Flex>,
          ))}
        </SimpleGrid>
      </InfiniteScroll>

    </MainContainer>
  );
};

export default Collection;
