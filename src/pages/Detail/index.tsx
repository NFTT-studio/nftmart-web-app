/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import Helmet from 'react-helmet';
import {
  Flex,
  Container,
  Text,
  Image,
  Button,
  Spinner,
  Modal,
  ModalOverlay,
  Center,
  Box,
  Link,
  useMediaQuery,
} from '@chakra-ui/react';
import { useQueryClient } from 'react-query';

import { useTranslation } from 'react-i18next';
import { RouteComponentProps, useHistory, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import Identicon from '@polkadot/react-identicon';
import ReactAudioPlayer from 'react-audio-player';
import MainContainer from '../../layout/MainContainer';
import CancelDialog from './CancelDialog';
import CancelAuctionDialog from './CancelAuctionDialog';
import DealDialog from './DealDialog';
import RemoveDialog from './RemoveDialog';
import ReceiveDialog from './ReceiveDialog';
import DetailLeft from './DetailLeft';
import DetailLeftH5 from './DetailLeftH5';
import DetailRight from './DetailRight';
import DetailRightH5 from './DetailRightH5';
import { getBlock } from '../../polkaSDK/api/getBlock';
import {
  CACHE_SERVER_URL,
  PINATA_SERVER,
  QUERY_KEYS,
} from '../../constants';
import {
  IconDetailsCollection,
  IconDetailsCollectionS,
  IconDetailsRefresh,
  IconAuthentication,
  ImgFillTop,
  ImgFillBottom,
} from '../../assets/images';

import useNft from '../../hooks/reactQuery/useNft';
import useCollectionsSinger from '../../hooks/reactQuery/useCollectionsSinger';
import useToken from '../../hooks/reactQuery/useToken';

import { priceStringDivUnit, currentPrice } from '../../utils/format';
import useIsLoginAddress from '../../hooks/utils/useIsLoginAddress';
import { useAppSelector } from '../../hooks/redux';
import BuyDialog from './BuyDialog';
import OfferDialog from './OfferDialog';
import DutchDialog from './DutchDialog';
import BritishDialog from './BritishDialog';
import FixedDialog from './FixedDialog';
import DelDialog from './DelDialog';
import ReduceRoyalties from './ReduceRoyalties';
import AllowBritishDialog from './AllowBritishDialog';
import ShareDetail from '../../components/ShareDetail';

const propertiesArr = [1, 2, 3, 4, 5, 6];
const OfferssUnitArr = [1, 2, 3, 4, 5, 6];
const Detail = ({ match }: RouteComponentProps<{ collectionId: string, nftId: string, nftName: string, }>) => {
  const pictureType = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
  const videoType = ['mp4', 'webm'];
  const audioType = ['mp3', 'wav', 'ogg'];
  const [isLargerThan700] = useMediaQuery('(min-width: 700px)');
  function number2PerU16(x) {
    return (x / 65535) * 100;
  }
  const chainState = useAppSelector((state) => state.chain);
  const { t } = useTranslation();
  const history = useHistory();
  const [isCollect, setIsCollect] = useState(false);
  const queryCliet = useQueryClient();

  const [remainingTime, setRemainingTime] = useState(0);
  const { account } = chainState;
  const { collectionId, nftId } = match.params;
  const { data: nftData, isLoading: nftDataIsLoading, refetch: refetchNftData } = useNft(`${collectionId}-${nftId}`);
  const collectionsId = collectionId;
  const tokenId = nftId;

  const collectNft = async (type: string) => {
    const data = {
      nft_id: `${collectionId}-${nftId}`,
      collecter_id: account?.address,
      type,
    };
    await axios.post(`${CACHE_SERVER_URL}nfts/action/collect`, qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then((res) => {
      if (type === 'status') {
        const status = !!res.data.collect_status;
        setIsCollect(status);
      }
    });
  };
  const browse = async () => {
    const data = {
      nft_id: `${collectionId}-${nftId}`,
      viewer_id: account?.address || '',
    };
    await axios.get(`${CACHE_SERVER_URL}nfts/action/view`, { params: data });
  };

  const [refresh, setRefresh] = useState(false);
  const [isShowCancel, setIsShowCancel] = useState(false);
  const [isCancelAuction, setIsCancelAuction] = useState(false);
  const [isShowDeal, setIsShowDeal] = useState(false);
  const [isShowRemove, setIsShowRemove] = useState(false);
  const [isShowReceive, setIshowReceive] = useState(false);
  const [isShowBuy, setIsShowBuy] = useState(false);
  const [isShowOffer, setIsShowOffer] = useState(false);
  const [isShowDutch, setIsShowDutch] = useState(false);
  const [allowBritish, setIsAllowBritish] = useState(false);
  const [isShowBritish, setIsShowBritish] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offerId, setOfferId] = useState('');
  const [offerOwner, setOfferOwner] = useState('');
  const [isShowDel, setIsShowDel] = useState(false);
  const [isShowRoyalties, setIsShowRoyalties] = useState(false);
  const [events, setEvents] = useState(
    {
      times: 0,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
    },
  );
  const [isShowFixed, setIsShowFixed] = useState(false);

  const countFun = (index: number) => {
    const times = (Number(index) - Number(remainingTime)) * 6 * 1000;
    // eslint-disable-next-line no-param-reassign
    const day = (Math.floor((times / 1000 / 3600 / 24)));
    const hour = (Math.floor((times / 1000 / 3600) % 24));
    const minute = (Math.floor((times / 1000 / 60) % 60));
    // eslint-disable-next-line no-mixed-operators
    const second = (Math.floor(times / 1000 % 60));
    if (times > 0) {
      setEvents({
        times,
        day,
        hour,
        minute,
        second,
      });
    }
  };

  const type = nftData?.nftInfo?.auction?.type || false;
  const deadline = nftData?.nftInfo?.auction?.deadline;
  const { data: collectionsData, isLoading: collectionsDateIsLoading } = useCollectionsSinger(collectionsId);
  useEffect(() => {
    if (!!nftData?.nftInfo?.burned === true) {
      history.push('/');
    }
  }, []);
  useEffect(() => {
    collectNft('status');
    browse();
    getBlock().then((res) => {
      setRemainingTime(res);
    });
  }, [account?.address]);
  useEffect(() => {
    if (type && remainingTime) {
      countFun(deadline);
    }
  }, [remainingTime]);
  useEffect(() => {
    if (allowBritish) {
      getBlock().then((res) => {
        setRemainingTime(res);
      });
    }
  }, [allowBritish]);
  useEffect(() => {
    if (isShowDutch) {
      getBlock().then((res) => {
        setRemainingTime(res);
      });
    }
  }, [isShowDutch]);
  useEffect(() => {
    if (isShowBritish) {
      getBlock().then((res) => {
        setRemainingTime(res);
      });
    }
  }, [isShowBritish]);

  const { data: token } = useToken();
  const isLoginAddress = useIsLoginAddress(nftData?.nftInfo?.owner_id);
  const isBidder = useIsLoginAddress(nftData?.nftInfo?.auction?.auctionbid[0]?.bidder_id);
  const isCreator = useIsLoginAddress(nftData?.nftInfo?.creator_id);

  const logoUrl = `${PINATA_SERVER}nft/${nftData?.nftInfo?.metadata?.logoUrl}`;
  const price = priceStringDivUnit(nftData?.nftInfo?.price);
  const auctionPrice = priceStringDivUnit(nftData?.nftInfo?.auction?.price);
  const collectionName = collectionsData?.collection?.metadata?.name;
  const fileType = nftData?.nftInfo?.metadata?.fileType;

  useEffect(() => {
    getBlock().then((res) => {
      setRemainingTime(res);
      queryCliet.refetchQueries(QUERY_KEYS.NFT);
    });
    queryCliet.refetchQueries(QUERY_KEYS.NFT);
  }, [auctionPrice]);

  const ownerId = nftData?.nftInfo?.owner_id;
  const orderId = nftData?.nftInfo?.sale_id;
  const termOfValidity = !!((nftData?.nftInfo?.auction?.deadline - remainingTime) > 0);
  const auctionId = nftData?.nftInfo?.auction?.id;
  const nftName = match.params.nftName || nftData?.nftInfo?.metadata?.name;
  const initPrice = priceStringDivUnit(nftData?.nftInfo?.auction?.init_price);
  const minRaise = Number(auctionPrice) * (1 + number2PerU16(nftData?.nftInfo?.auction?.min_raise) / 100);
  const minActionRaise = Number(priceStringDivUnit(nftData?.nftInfo?.auction?.price)) * (1 + number2PerU16(nftData?.nftInfo?.auction?.min_raise) / 100);
  const creatorId = nftData?.nftInfo?.auction?.creator_id;
  const offersLength = nftData?.nftInfo?.offers.length;
  const recipientsId = nftData?.nftInfo?.offers[0]?.bidder_id;
  const allowBritishAuction = nftData?.nftInfo?.auction?.allow_british_auction || false;
  const bidCount = nftData?.nftInfo?.auction?.bid_count || false;
  const duchPrice = currentPrice(Number(nftData?.nftInfo?.auction?.max_price), Number(nftData?.nftInfo?.auction?.min_price), Number(nftData?.nftInfo?.auction?.deadline), remainingTime, Number(nftData?.nftInfo?.auction?.block_created));

  return (
    <>
      <Helmet>
        {nftData?.nftInfo?.metadata?.name && <meta name="twitter:title" content={nftData?.nftInfo?.metadata?.name} />}
        {nftData?.nftInfo?.metadata?.description && <meta name="twitter:description" content={nftData?.nftInfo?.metadata?.description} />}
        {nftData?.nftInfo?.metadata?.logoUrl && <meta name="twitter:image" content={`${PINATA_SERVER}nft/${nftData?.nftInfo?.metadata?.logoUrl}`} />}
        {nftData?.nftInfo?.metadata?.name && <meta name="og:title" content={nftData?.nftInfo?.metadata?.name} />}
        {nftData?.nftInfo?.metadata?.description && <meta name="og:description" content={nftData?.nftInfo?.metadata?.description} />}
        {nftData?.nftInfo?.metadata?.logoUrl && <meta name="og:image" content={`${PINATA_SERVER}nft/${nftData?.nftInfo?.metadata?.logoUrl}`} />}
      </Helmet>
      {nftDataIsLoading || collectionsDateIsLoading || !nftData || refresh ? (
        <Center width="100%" height="100vh">
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        </Center>
      )
        : (
          <>
            {isLargerThan700
              ? (
                <MainContainer title={`${nftName}-${collectionName}${t('Detail.title')}`}>
                  {!type && isLoginAddress ? (
                    <>
                      {nftData?.nftInfo?.status_id === 'ForSale'
                        ? (
                          <Flex
                            w="100vw"
                            background="#F9F9F9"
                            justifyContent="center"
                            h="80px"
                            alignItems="center"
                          >
                            <Flex
                              h="100%"
                              maxWidth="1364px"
                              w="100%"
                              justifyContent="flex-end"
                            >
                              <Flex h="100%" alignItems="center">
                                <Button
                                  ml="30px"
                                  width="110px"
                                  height="40px"
                                  background="#FFFFFF"
                                  borderRadius="4px"
                                  fontSize="14px"
                                  fontFamily="TTHoves-Regular, TTHoves"
                                  fontWeight="400"
                                  color="#000000"
                                  lineHeight="16px"
                                  border="1px solid #000000"
                                  _hover={{
                                    background: '#000000',
                                    color: '#FFFFFF',
                                  }}
                                  onClick={() => setIsShowCancel(true)}
                                >
                                  {t('Detail.cancel')}
                                </Button>
                                <Button
                                  ml="10px"
                                  width="110px"
                                  height="40px"
                                  background="#FFFFFF"
                                  borderRadius="4px"
                                  fontSize="14px"
                                  fontFamily="TTHoves-Regular, TTHoves"
                                  fontWeight="400"
                                  color="#000000"
                                  lineHeight="16px"
                                  border="1px solid #000000"
                                  _hover={{
                                    background: '#000000',
                                    color: '#FFFFFF',
                                  }}
                                  onClick={() => history.push(`/${collectionId}-${nftId}/sellSetting`)}
                                >
                                  {t('Detail.setting')}
                                </Button>
                              </Flex>
                            </Flex>
                          </Flex>
                        )
                        : (
                          <Flex
                            w="100vw"
                            background="#F9F9F9"
                            justifyContent="center"
                            h="80px"
                            alignItems="center"
                          >
                            <Flex
                              width="100%"
                              h="100%"
                              maxWidth="1364px"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Flex
                                width="100%"
                                maxWidth="1364px"
                                justifyContent="flex-start"
                              >
                                <Button
                                  mr="20px"
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
                                  onClick={() => setIsShowDel(true)}
                                >
                                  {t('Update.burning')}
                                </Button>
                                {isCreator
                                  ? (
                                    <Link
                                      as={RouterLink}
                                      to={`/account/items/create?collectionId=${collectionId}&modifyId=${collectionId}-${nftId}`}
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
                                      >
                                        {t('Update.modify')}
                                      </Button>
                                    </Link>
                                  ) : ''}
                              </Flex>
                              <Flex h="100%" alignItems="center">
                                <Button
                                  ml="10px"
                                  width="110px"
                                  height="40px"
                                  background="#FFFFFF"
                                  borderRadius="4px"
                                  fontSize="14px"
                                  fontFamily="TTHoves-Regular, TTHoves"
                                  fontWeight="400"
                                  color="#000000"
                                  lineHeight="16px"
                                  border="1px solid #000000"
                                  _hover={{
                                    background: '#000000',
                                    color: '#FFFFFF',
                                  }}
                                  onClick={() => history.push(`/${collectionId}-${nftId}/sellSetting`)}
                                >
                                  {t('Detail.Sell')}
                                </Button>
                              </Flex>
                            </Flex>
                          </Flex>
                        )}
                    </>
                  )
                    : isCreator && nftData?.nftInfo?.status_id === 'Idle' ? (
                      <Flex
                        w="100vw"
                        background="#F9F9F9"
                        justifyContent="center"
                        h="80px"
                        alignItems="center"
                      >
                        <Flex
                          width="100%"
                          h="100%"
                          maxWidth="1364px"
                          justifyContent="space-start"
                          alignItems="center"
                        >
                          <Flex
                            width="100%"
                            maxWidth="1364px"
                            justifyContent="flex-start"
                          >
                            <Button
                              mr="20px"
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
                              onClick={() => setIsShowRoyalties(true)}
                            >
                              {t('Update.reduceRoyalties')}
                            </Button>
                          </Flex>
                        </Flex>
                      </Flex>
                    ) : ''}
                  {type && isLoginAddress ? (
                    <>
                      {termOfValidity
                        ? (
                          <Flex
                            w="100vw"
                            background="#F9F9F9"
                            justifyContent="center"
                            h="80px"
                            alignItems="center"
                          >
                            <Flex
                              h="100%"
                              width="1364px"
                              justifyContent="flex-end"
                            >
                              <Flex
                                width="100%"
                                h="100%"
                                maxWidth="1364px"
                                justifyContent="flex-end"
                                alignItems="center"
                              >
                                <Text
                                  fontSize="14px"
                                  fontFamily="TTHoves-Regular, TTHoves"
                                  fontWeight="400"
                                  color="#999999"
                                >
                                  {bidCount > 0 ? t('Detail.cancelTips') : null}
                                </Text>
                                <Flex h="100%" alignItems="center">
                                  <Button
                                    ml="30px"
                                    width="110px"
                                    height="40px"
                                    background="#FFFFFF"
                                    borderRadius="4px"
                                    fontSize="14px"
                                    fontFamily="TTHoves-Regular, TTHoves"
                                    fontWeight="400"
                                    color="#000000"
                                    lineHeight="16px"
                                    border="1px solid #000000"
                                    isDisabled={bidCount > 0}
                                    _hover={{
                                      background: '#000000',
                                      color: '#FFFFFF',
                                    }}
                                    onClick={() => setIsCancelAuction(true)}
                                  >
                                    {t('Detail.cancel')}
                                  </Button>
                                  {/* <Button
                    ml="10px"
                    width="110px"
                    height="40px"
                    background="#FFFFFF"
                    borderRadius="4px"
                    fontSize="14px"
                    fontFamily="TTHoves-Regular, TTHoves"
                    fontWeight="400"
                    color="#000000"
                    lineHeight="16px"
                    border="1px solid #000000"
                    _hover={{
                      background: '#000000',
                      color: '#FFFFFF',
                    }}
                    onClick={() => history.push(`/sellSetting/${nftId}`)}
                  >
                    {t('Detail.setting')}
                  </Button> */}
                                </Flex>
                              </Flex>
                            </Flex>
                          </Flex>
                        )
                        : (
                          <Flex
                            w="100vw"
                            background="#F9F9F9"
                            justifyContent="center"
                            h="80px"
                            alignItems="center"
                          >
                            <Flex
                              width="100%"
                              h="100%"
                              maxWidth="1364px"
                              justifyContent="flex-end"
                              alignItems="center"
                            >
                              <Text
                                fontSize="14px"
                                fontFamily="TTHoves-Regular, TTHoves"
                                fontWeight="400"
                                color="#999999"
                              >
                                {bidCount > 0 ? t('Detail.cancelTips') : null}
                              </Text>
                              <Flex h="100%" alignItems="center">
                                <Button
                                  ml="30px"
                                  width="110px"
                                  height="40px"
                                  background="#FFFFFF"
                                  borderRadius="4px"
                                  fontSize="14px"
                                  fontFamily="TTHoves-Regular, TTHoves"
                                  fontWeight="400"
                                  color="#000000"
                                  lineHeight="16px"
                                  border="1px solid #000000"
                                  isDisabled={offersLength > 1}
                                  _hover={{
                                    background: '#000000',
                                    color: '#FFFFFF',
                                  }}
                                  onClick={() => setIsCancelAuction(true)}
                                >
                                  {t('Detail.cancel')}
                                </Button>
                                {/* <Button
                    ml="10px"
                    width="110px"
                    height="40px"
                    background="#FFFFFF"
                    borderRadius="4px"
                    fontSize="14px"
                    fontFamily="TTHoves-Regular, TTHoves"
                    fontWeight="400"
                    color="#000000"
                    lineHeight="16px"
                    border="1px solid #000000"
                    _hover={{
                      background: '#000000',
                      color: '#FFFFFF',
                    }}
                    onClick={() => history.push(`/${nftId}/sellSetting`)}
                  >
                    {t('Detail.setting')}
                  </Button> */}
                              </Flex>
                            </Flex>
                          </Flex>
                        )}
                    </>
                  ) : ''}
                  <Container
                    mt="0px"
                    display="flex"
                    flexDirection="column"
                    maxWidth="1364px"
                    w="100%"
                    height="100%"
                    justifyContent="flex-start"
                  >
                    <Flex m="26px 0 22px 0" p="0 20px 0 20px" width="100%" h="40px" justifyContent="flex-end" alignItems="center">
                      {/* {nftData?.nftInfo?.view_count ? (
                <Flex h="22px" justifyContent="flex-start" alignItems="center" mr="20px">
                  <Image
                    mr="4px"
                    w="16px"
                    h="16px"
                    src={IconBrowse.default}
                  />
                  <Text
                    fontSize="14px"
                    fontFamily="TTHoves-Regular, TTHoves"
                    fontWeight="400"
                    color="#000000"
                  >
                    {nftData?.nftInfo?.view_count}
                  </Text>
                </Flex>
              ) : null}
              {nftData?.nftInfo?.collect_count ? (
                <Flex h="22px" justifyContent="flex-start" alignItems="center">
                  <Image
                    mr="4px"
                    w="16px"
                    h="16px"
                    src={IconLiulan.default}
                  />
                  <Text
                    fontSize="14px"
                    fontFamily="TTHoves-Regular, TTHoves"
                    fontWeight="400"
                    color="#000000"
                  >
                    {nftData?.nftInfo?.collect_count}
                  </Text>
                </Flex>
              ) : null} */}

                      <Flex>
                        <Box
                          cursor="pointer"
                          ml="28px"
                          width="32px"
                          height="32px"
                          borderRadius="50%"
                          border="1px solid #E5E5E5"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          onClick={() => {
                            setRefresh(true);
                            browse();
                            collectNft('status');
                            getBlock().then((res) => {
                              setRemainingTime(res);
                            });
                            queryCliet.refetchQueries(QUERY_KEYS.CATEGORIES);
                            queryCliet.refetchQueries(QUERY_KEYS.NFT);
                            setTimeout(() => {
                              setRefresh(false);
                            }, 500);
                          }}
                          _hover={{
                            boxShadow: '0px 2px 8px 0px #E1E1E1',
                          }}
                        >
                          <Image
                            w="22px"
                            h="22px"
                            src={IconDetailsRefresh.default}
                          />
                        </Box>
                        <ShareDetail />
                        <Box
                          cursor="pointer"
                          ml="28px"
                          width="32px"
                          height="32px"
                          borderRadius="50%"
                          border="1px solid #E5E5E5"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          _hover={{
                            boxShadow: '0px 2px 8px 0px #E1E1E1',
                          }}
                          onClick={() => {
                            setIsCollect(!isCollect);
                            const types = isCollect ? 'cancle' : 'collect';
                            collectNft(types);
                            setTimeout(() => {
                              refetchNftData();
                            }, 10);
                          }}
                        >
                          <Image
                            w="22px"
                            h="22px"
                            src={isCollect ? IconDetailsCollectionS.default : IconDetailsCollection.default}
                          />
                        </Box>

                      </Flex>
                    </Flex>
                    <Flex
                      maxW="1364px"
                      w="100%"
                      flexFlow="row wrap"
                      justifyContent={['center', 'center', 'center', 'center', 'space-between']}
                      alignItems="flex-start"
                    >
                      <DetailLeft
                        nftData={nftData}
                        collectionsData={collectionsData}
                        logoUrl={logoUrl}
                        propertiesArr={propertiesArr}
                      />
                      <DetailRight
                        nftId={`${collectionId}-${nftId}`}
                        nftData={nftData}
                        collectionsData={collectionsData}
                        account={account}
                        isLoginAddress={isLoginAddress}
                        isBidder={isBidder}
                        remainingTime={remainingTime}
                        setOfferId={setOfferId}
                        setOfferOwner={setOfferOwner}
                        setIsShowDeal={setIsShowDeal}
                        setIsShowRemove={setIsShowRemove}
                        setIsShowBuy={setIsShowBuy}
                        token={token}
                        OfferssUnitArr={OfferssUnitArr}
                        setIsShowOffer={setIsShowOffer}
                        types={type}
                        deadline={deadline}
                        setIsShowBritish={setIsShowBritish}
                        setIsShowDutch={setIsShowDutch}
                        setIsShowFixed={setIsShowFixed}
                        recipientsId={recipientsId}
                        setIshowReceive={setIshowReceive}
                        setIsAllowBritish={setIsAllowBritish}
                      />
                    </Flex>

                    {isShowBuy && (
                      <BuyDialog
                        isShowBuy={isShowBuy}
                        setIsShowBuy={setIsShowBuy}
                        price={price}
                        logoUrl={logoUrl}
                        nftName={nftName}
                        collectionName={collectionName}
                        orderId={orderId}
                        ownerId={ownerId}
                      />
                    )}
                    {isShowFixed && (
                      <FixedDialog
                        isShowFixed={isShowFixed}
                        setIsShowFixed={setIsShowFixed}
                        price={nftData.nftInfo.auction?.hammer_price}
                        logoUrl={logoUrl}
                        nftName={nftName}
                        collectionName={collectionName}
                        orderId={orderId}
                        ownerId={ownerId}
                        creatorId={creatorId}
                        auctionId={auctionId}
                      />
                    )}
                    {isShowOffer && (
                      <OfferDialog
                        isShowOffer={isShowOffer}
                        setIsShowOffer={setIsShowOffer}
                        classId={collectionsId}
                        categoryId={nftData.nftInfo.category?.id}
                        tokenId={tokenId}
                      />
                    )}
                    {isShowBritish && (
                      <BritishDialog
                        isShowBritish={isShowBritish}
                        setIsShowBritish={setIsShowBritish}
                        moreThan={Math.ceil(minRaise) || Number(auctionPrice)}
                        creatorId={creatorId}
                        auctionId={auctionId}
                      />
                    )}
                    {isShowDutch && (
                      <DutchDialog
                        isShowDutch={isShowDutch}
                        setIsShowDutch={setIsShowDutch}
                        price={duchPrice}
                        logoUrl={logoUrl}
                        nftName={nftName}
                        collectionName={collectionName}
                        creatorId={creatorId}
                        auctionId={auctionId}
                      />
                    )}
                    {allowBritish && (
                      <AllowBritishDialog
                        isShowBritish={allowBritish}
                        setIsShowBritish={setIsAllowBritish}
                        moreThan={Math.ceil(minActionRaise) || Number(priceStringDivUnit(nftData?.nftInfo?.auction?.price))}
                        creatorId={creatorId}
                        auctionId={auctionId}
                      />
                    )}
                    {isShowCancel && (
                      <CancelDialog
                        isShowCancel={isShowCancel}
                        setIsShowCancel={setIsShowCancel}
                        orderId={nftData?.nftInfo?.status_id === 'ForSale' ? orderId : ''}
                        nftId={`${collectionId}-${nftId}`}
                      />
                    )}
                    {isCancelAuction && (
                      <CancelAuctionDialog
                        isShowCancel={isCancelAuction}
                        setIsShowCancel={setIsCancelAuction}
                        orderId={orderId}
                        auctionId={auctionId}
                        type={type}
                      />
                    )}
                    {isShowDeal && (
                      <DealDialog
                        isShowDeal={isShowDeal}
                        setIsShowDeal={setIsShowDeal}
                        offerId={offerId}
                        offerOwner={offerOwner}
                        orderId={nftData?.nftInfo?.status_id === 'ForSale' ? orderId : ''}
                      />
                    )}
                    {isShowRemove && (
                      <RemoveDialog
                        isShowRemove={isShowRemove}
                        setIsShowRemove={setIsShowRemove}
                        offerId={offerId}
                      />
                    )}
                    {isShowReceive && (
                      <ReceiveDialog
                        isShowReceive={isShowReceive}
                        setIshowReceive={setIshowReceive}
                        auctionId={auctionId}
                        creatorId={creatorId}
                        type={type}
                      />
                    )}
                    {isShowDel && (
                      <DelDialog
                        isShowDel={isShowDel}
                        setIsShowDel={setIsShowDel}
                        classId={Number(collectionId)}
                        tokenId={Number(nftId)}
                        nftName={nftData?.nftInfo?.metadata?.name}
                        collectionName={collectionName}
                      />
                    )}
                    {isShowRoyalties && (
                      <ReduceRoyalties
                        isShowDel={isShowRoyalties}
                        setIsShowDel={setIsShowRoyalties}
                        classId={Number(collectionId)}
                        tokenId={Number(nftId)}
                        oldRoyalties={Number(Math.ceil(number2PerU16(nftData?.nftInfo?.royalty_rate)))}
                      />
                    )}
                  </Container>
                  <Modal isOpen={isSubmitting} onClose={() => setIsSubmitting(false)}>
                    <ModalOverlay />
                  </Modal>
                </MainContainer>
              )
              : (
                <MainContainer title={`${nftName}-${collectionName}${t('Detail.title')}`}>
                  <Flex
                    width="100%"
                    flexDirection="column"
                    justifyContent="flex-start"
                    p="0 20px"
                  >
                    <Flex
                      width="100%"
                      flexDirection="column"
                      p="0 0px 0 0px"
                      alignItems="flex-start"
                    >
                      <Text
                        fontSize="16px"
                        fontFamily="TTHoves-Bold, TTHoves"
                        fontWeight="bold"
                        color="#000000"
                        lineHeight="64px"
                        maxWidth="100%"
                        textAlign="start"
                      >
                        {nftName}
                      </Text>
                      <Flex
                        width="100%"
                        display="flex"
                        flexDirection="column"
                        justifyContent="flex-start"
                        alignItems="center"
                      >
                        <Box
                          width="100%"
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          position="relative"
                        >
                          <Image
                            width="20px"
                            height="20px"
                            src={ImgFillTop.default}
                            position="absolute"
                            right="0px"
                          />
                          {pictureType.indexOf(fileType) > -1
                            ? (
                              <Flex
                                m="10px"
                                width="calc(100% - 20px)"
                                minH="135px"
                                justifyContent="center"
                              >
                                <Link
                                  target="_blank"
                                  href={`${PINATA_SERVER}nft/${nftData?.nftInfo?.metadata.logoUrl}`}
                                  fontSize="14px"
                                  fontFamily="TTHoves-Regular, TTHoves"
                                  fontWeight="400"
                                  color="#3D00FF"
                                >
                                  <Image
                                    // cursor="pointer"
                                    maxWidth="100%"
                                    objectFit="contain"
                                    height="auto"
                                    maxHeight="540px"
                                    src={nftData?.nftInfo?.metadata?.fileType === 'gif' ? `${PINATA_SERVER}nft/${nftData?.nftInfo?.metadata?.logoUrl}` : `${PINATA_SERVER}nft/${nftData?.nftInfo?.metadata.logoUrl}!detail`}
                                  />
                                </Link>
                              </Flex>
                            )
                            : (
                              videoType.indexOf(fileType) > -1
                                ? (
                                  <Box
                                    m="10px"
                                    width="calc(100% - 20px)"
                                    height="auto"
                                  >
                                    <video
                                      width="100%"
                                      height="auto"
                                      controls
                                      poster={`${PINATA_SERVER}nft/${nftData?.nftInfo?.metadata?.previewUrl}!detail`}
                                    >
                                      <source style={{ height: 'auto' }} src={`${PINATA_SERVER}nft/${nftData?.nftInfo?.metadata.logoUrl}`} />
                                    </video>
                                  </Box>
                                )
                                : (
                                  <Box
                                    m="10px"
                                    width="calc(100% - 20px)"
                                    height="auto"
                                  >
                                    <Link
                                      target="_blank"
                                      href={`${PINATA_SERVER}nft/${nftData?.nftInfo?.metadata.previewUrl}`}
                                      fontSize="14px"
                                      fontFamily="TTHoves-Regular, TTHoves"
                                      fontWeight="400"
                                      color="#3D00FF"
                                    >
                                      <Image
                                        width="100%"
                                        height="auto"
                                        src={`${PINATA_SERVER}nft/${nftData?.nftInfo?.metadata.previewUrl}!detail`}
                                      />
                                    </Link>
                                    <ReactAudioPlayer
                                      style={{
                                        width: '100%',
                                      }}
                                      src={`${PINATA_SERVER}nft/${nftData?.nftInfo?.metadata.logoUrl}`}
                                      autoPlay
                                      controls
                                    />
                                  </Box>
                                )
                            )}
                          <Image
                            position="absolute"
                            left="0px"
                            bottom="0px"
                            width="20px"
                            height="20px"
                            src={ImgFillBottom.default}
                          />
                        </Box>

                      </Flex>
                      <DetailRightH5
                        nftId={`${collectionId}-${nftId}`}
                        nftData={nftData}
                        collectionsData={collectionsData}
                        account={account}
                        isLoginAddress={isLoginAddress}
                        isBidder={isBidder}
                        remainingTime={remainingTime}
                        setOfferId={setOfferId}
                        setOfferOwner={setOfferOwner}
                        setIsShowDeal={setIsShowDeal}
                        setIsShowRemove={setIsShowRemove}
                        setIsShowBuy={setIsShowBuy}
                        token={token}
                        OfferssUnitArr={OfferssUnitArr}
                        setIsShowOffer={setIsShowOffer}
                        types={type}
                        deadline={deadline}
                        setIsShowBritish={setIsShowBritish}
                        setIsShowDutch={setIsShowDutch}
                        setIsShowFixed={setIsShowFixed}
                        recipientsId={recipientsId}
                        setIshowReceive={setIshowReceive}
                        setIsAllowBritish={setIsAllowBritish}
                      />
                    </Flex>
                    <DetailLeftH5
                      nftData={nftData}
                      collectionsData={collectionsData}
                      logoUrl={logoUrl}
                      propertiesArr={propertiesArr}
                    />

                  </Flex>
                </MainContainer>
              )}
          </>
        )}
    </>
  );
};
export default Detail;
