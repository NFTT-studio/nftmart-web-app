/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-children-prop */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
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
import { without } from 'lodash';
import {
  RouteComponentProps, useLocation, useHistory, Link as RouterLink,
} from 'react-router-dom';
import { parse } from 'search-params';
import InfiniteScroll from 'react-infinite-scroll-component';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { any } from 'ramda';
import { timeStamp } from 'console';
import Identicon from 'react-identicons';
import MainContainer from '../../layout/MainContainer';
import NftCard from '../../components/NftCard';
import { useAppSelector } from '../../hooks/redux';
import useCollectionsSinger from '../../hooks/reactQuery/useCollectionsSinger';
import { getBlock } from '../../polkaSDK/api/getBlock';
import useUser from '../../hooks/reactQuery/useUser';

import {
  CollectionBackground,
  WEBSITE,
  DISCORD,
  TWITTER,
  IconIns,
  medium,
  telegram,
  IconAuthentication,
  Emptyimg,
  HeadPortrait,
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
  { icon: WEBSITE.default, name: 'website', linkPrefix: '' },
  { icon: DISCORD.default, name: 'discord', linkPrefix: 'https://discord.gg/' },
  { icon: TWITTER.default, name: 'twitter', linkPrefix: 'https://twitter.com/' },
  { icon: IconIns.default, name: 'ins', linkPrefix: 'https://www.instagram.com/' },
  { icon: medium.default, name: 'medium', linkPrefix: 'https://www.medium.com/@' },
  { icon: telegram.default, name: 'telegram', linkPrefix: 'https://t.me/' },
];

const Collection = ({ match }: RouteComponentProps<{ address: string }>) => {
  const { t } = useTranslation();
  const formatAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  const chainState = useAppSelector((state) => state.chain);
  const { account } = chainState;
  const { address } = match.params;
  const location = useLocation();
  const [isPerson, setIsPerson] = useState(false);
  const search = parse(location.search.replace('?', ''));
  const classId = search.collectionId;
  const [remainingTime, setRemainingTime] = useState(0);
  const [selectedCollection] = useState<string[]>([classId]);
  useEffect(() => {
    getBlock().then((res) => {
      setRemainingTime(res);
    });
  }, []);

  const {
    data: collectionsData,
    isLoading: collectionsIsLoading,
    refetch: refetchCollectionsData,
  } = useCollectionsSinger(classId);
  const links = collectionsData?.collection?.metadata?.links;
  const ICON_LIST = ICONS.map((item, index) => ({
    src: item.icon,
    id: index,
    link: links ? item.linkPrefix + links[item.name] : '',
  }));
  const {
    data: dataCreator,
    refetch: refetchCreatorData,
  } = useUser(collectionsData?.collection?.creator_id);
  const newLink = ICON_LIST.filter((item) => item.link !== '');
  const [selectedSort, setSelectedSort] = useState(Sort[1].key);
  const {
    data: nftsData, isLoading: nftsIsLoading, fetchNextPage, refetch: refetchNftsData,
  } = useNftsPersonal(
    {
      collectionId: selectedCollection,
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
  }, [collectionsData?.collection?.creator_id, address]);
  useEffect(() => {
    refetchCollectionsData();
    refetchNftsData();
  }, [classId]);
  useEffect(() => {
    refetchCreatorData();
  }, [dataCreator?.address === 'undefined']);
  const begin = any;
  useEffect(() => {
    refetchCollectionsData();
    refetchNftsData();
    refetchCreatorData();
    // if (JSON.stringify(collectionsData) === '{}') {
    //   begin = setInterval(() => {

    //   }, 3000);
    // } else {
    //   clearInterval(begin);
    // }
  }, [JSON.stringify(collectionsData) === '{}']);
  useEffect(() => () => {
    clearInterval(begin);
  }, []);
  // isLoading
  return (
    <>
      { nftsIsLoading || collectionsIsLoading || JSON.stringify(collectionsData) === '{}'
        ? (
          <Center width="100%" height="100vh">
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
          </Center>
        )
        : (
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
                  <Link
                    as={RouterLink}
                    to={`/profile/nft/create/${classId}`}
                  >
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
                  </Link>
                </Flex>
              </Flex>
            ) : ''}
            <Flex maxWidth="1400px" w="100%" position="relative">
              <Box
                maxWidth="1400px"
                w="100vw"
                minHeight="200px"
              >
                <Image
                  maxWidth="1400px"
                  width="100%"
                  height="auto"
                  src={collectionsData?.collection?.metadata?.banner
                    ? `${PINATA_SERVER}banner/${collectionsData?.collection?.metadata?.banner}`
                    : CollectionBackground.default}
                  alt="banner"
                  fallback={(
                    <Center width="100%" height="300px">
                      <Spinner />
                    </Center>
                  )}
                />

              </Box>
              <Avatar
                position="absolute"
                bottom="-50px"
                border="3px solid #FFFFFF"
                m="0 40px"
                src={`${PINATA_SERVER}logo/${collectionsData?.collection?.metadata.logoUrl}`}
                w="100px"
                h="100px"
                boxShadow="0px 6px 20px 0px #D3D5DC"
                fallback={(
                  <Center width="108px" height="108px">
                    <Spinner />
                  </Center>
                )}
              />
            </Flex>
            <Flex
              w="100%"
              maxWidth="1400px"
              direction="row"
              justifyContent="space-between"
              padding="81px 40px 20px 40px"
            >
              <Flex mr="20px" w="100%" maxWidth="301px" direction="column">
                <Flex h="33px" alignItems="center">
                  <Text
                    fontSize="28px"
                    fontFamily="TTHoves-Bold, TTHoves"
                    fontWeight="bold"
                    color="#000000"
                    lineHeight="33px"
                  >
                    {collectionsData?.collection?.metadata.name}
                  </Text>
                  <Image
                    ml="4px"
                    w="18px"
                    h="auto"
                    src={IconAuthentication.default}
                  />
                </Flex>
                {dataCreator ? (
                  <Flex alignItems="center" m="20px 0">
                    <Link
                      as={RouterLink}
                      to={`/account/${collectionsData?.collection?.creator_id}/wallet`}
                      onClick={() => {
                        localStorage.setItem('ButtonSelect', '1');
                      }}
                    >
                      {dataCreator?.avatar ? (
                        <Image
                          mr="4px"
                          w="50px"
                          h="auto"
                          borderRadius="50%"
                          border="1px solid #D3D5DC"
                          src={dataCreator?.avatar}
                        />
                      ) : (
                        <Identicon
                          className="creatorAvatar"
                          string={collectionsData?.collection?.creator_id}
                        />
                      )}
                    </Link>
                    <Text
                      fontSize="14px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#000000"
                      lineHeight="16px"
                    >
                      <Text
                        fontSize="14px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#000000"
                        display="flex"
                        flexDirection="row"
                      >
                        {t('Detail.createdBy')}
                        <Link
                          as={RouterLink}
                          to={`/account/${collectionsData?.collection?.creator_id}/wallet`}
                          m="0 3px"
                          fontSize="14px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#3D00FF"
                          onClick={() => {
                            localStorage.setItem('ButtonSelect', '1');
                          }}
                        >
                          {dataCreator?.name || formatAddress(collectionsData?.collection?.creator_id)}
                        </Link>
                      </Text>
                    </Text>
                  </Flex>
                ) : null}

                <Text
                  mt="10px"
                  fontSize="15px"
                  fontFamily="TTHoves-Light, TTHoves"
                  fontWeight="300"
                  color="#191A24"
                  lineHeight="175%"
                >
                  <ReactMarkdown children={`${collectionsData?.collection?.metadata.description}`} remarkPlugins={[remarkGfm]} />
                </Text>
                <Flex
                  m="40px 0"
                  width="100%"
                  flexDirection="row"
                  alignContent="center"
                >
                  <Flex
                    width="25%"
                    flexDirection="column"
                    alignContent="center"
                  >
                    <Flex
                      fontSize="14px"
                      fontFamily="TTHoves-Thin, TTHoves"
                      fontWeight="100"
                      color="#000000"
                      lineHeight="16px"
                      justifyContent="flex-start"
                      alignItems="center"
                    >
                      {t('class.Items')}
                    </Flex>
                    <Flex
                      fontSize="14px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#000000"
                      lineHeight="16px"
                      justifyContent="flex-start"
                      alignItems="center"
                    >
                      {nftsData?.pages[0].pageInfo.totalNum || 0}
                    </Flex>
                  </Flex>
                  <Flex
                    width="25%"
                    flexDirection="column"
                    alignContent="center"
                  >
                    <Flex
                      fontSize="14px"
                      fontFamily="TTHoves-Thin, TTHoves"
                      fontWeight="100"
                      color="#000000"
                      lineHeight="16px"
                      justifyContent="center"
                      alignItems="center"
                    >
                      {t('class.Owners')}
                    </Flex>
                    <Flex
                      fontSize="14px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#000000"
                      lineHeight="16px"
                      justifyContent="center"
                      alignItems="center"
                    >
                      {collectionsData?.collection?.owner_count || 0}
                    </Flex>
                  </Flex>
                  <Flex
                    width="25%"
                    flexDirection="column"
                    alignContent="center"
                  >
                    <Flex
                      fontSize="14px"
                      fontFamily="TTHoves-Thin, TTHoves"
                      fontWeight="100"
                      color="#000000"
                      lineHeight="16px"
                      justifyContent="center"
                      alignItems="center"
                    >
                      {t('class.Viewers')}
                    </Flex>
                    <Flex
                      fontSize="14px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#000000"
                      lineHeight="16px"
                      justifyContent="center"
                      alignItems="center"
                    >
                      {collectionsData?.collection?.view_count || 0}
                    </Flex>
                  </Flex>
                  <Flex
                    width="25%"
                    flexDirection="column"
                    alignContent="center"
                  >
                    <Flex
                      fontSize="14px"
                      fontFamily="TTHoves-Thin, TTHoves"
                      fontWeight="100"
                      color="#000000"
                      lineHeight="16px"
                      justifyContent="flex-end"
                      alignItems="center"
                    >
                      {t('class.Stars')}
                    </Flex>
                    <Flex
                      fontSize="14px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#000000"
                      lineHeight="16px"
                      justifyContent="flex-end"
                      alignItems="center"
                    >
                      {collectionsData?.collection?.collect_count || 0}
                    </Flex>
                  </Flex>

                </Flex>
                <Flex>
                  {newLink.map((item, index) => (
                    <Link
                      target="_blank"
                      href={item.link}
                    >
                      <Box
                        key="index"
                        width="40px"
                        height="40px"
                        borderRadius={index === 0 ? '4px 0px 0px 4px' : index === newLink.length - 1 ? '0px 4px 4px 0px' : ''}
                        borderTop="1px solid #E5E5E5"
                        borderBottom="1px solid #E5E5E5"
                        borderLeft="1px solid #E5E5E5"
                        borderRight={index === newLink.length - 1 ? '1px solid #E5E5E5' : ''}
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
                  ))}
                </Flex>
                {/* <Flex flexDirection="column">
                {ICON_LIST.map((item) => (
                  item.link === '' ? null
                    : (
                      <Link
                        href={item.link}
                      >
                        <Flex
                          height="40px"
                          justifyContent="flex-start"
                        >
                          <Box
                            mr="15px"
                            key="index"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Image
                              w="22px"
                              h="22px"
                              src={item.src}
                            />
                          </Box>
                          <Flex
                            fontSize="14px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#000000"
                            lineHeight="16px"
                            justifyContent="flex-start"
                            alignItems="center"
                          >
                            {item.link}
                          </Flex>
                        </Flex>
                      </Link>
                    )
                ))}
              </Flex>
             */}
              </Flex>
              <Flex maxWidth="1003px" w="100%" direction="column">
                <Flex
                  m="10px 0 0px 0"
                  width="100%"
                  maxWidth="1003px"
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
                      {nftsData?.pages[0].pageInfo.totalNum || 0}
                      {' '}
                      {t('results')}
                    </Text>
                    <SortBy selectedSort={selectedSort} setSelectedSort={setSelectedSort} />
                  </Flex>
                </Flex>
                {nftsData?.pages[0].pageInfo.totalNum
                  ? (
                    <InfiniteScroll
                      dataLength={nftsData?.pages.length * DEFAULT_PAGE_LIMIT}
                      next={fetchNextPage}
                      hasMore={nftsData?.pages.length * DEFAULT_PAGE_LIMIT < nftsData?.pages[0].pageInfo.totalNum}
                      loader={<h4>Loading...</h4>}
                      initialScrollY={1}
                    >
                      <SimpleGrid
                        w="100%"
                        m="20px 0 20px 0"
                        columns={[1, 1, 1, 2, 3]}
                        spacing="20px"
                      >
                        {nftsData?.pages.map((page) => page.nfts?.map(
                          (nft) => <NftCard nft={nft} remainingTime={remainingTime} />,
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

          </MainContainer>
        )}
    </>
  );
};

export default Collection;
