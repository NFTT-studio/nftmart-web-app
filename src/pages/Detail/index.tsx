import React, { useState, useEffect } from 'react';
import Countdown from 'react-countdown';
import {
  Flex,
  Container,
  Text,
  Image,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Spinner,
  Modal,
  ModalOverlay,
} from '@chakra-ui/react';

import { useTranslation } from 'react-i18next';
import { RouteComponentProps, useHistory, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import MainContainer from '../../layout/MainContainer';
import CancelDialog from './CancelDialog';
import CancelAuctionDialog from './CancelAuctionDialog';
import DealDialog from './DealDialog';
import DetailLeft from './DetailLeft';
import DetailRight from './DetailRight';
import { getBlock } from '../../polkaSDK/api/getBlock';
import {
  CACHE_SERVER_URL,
  PINATA_SERVER,
} from '../../constants';

import useNft from '../../hooks/reactQuery/useNft';
import useCollectionsSinger from '../../hooks/reactQuery/useCollectionsSinger';
import useToken from '../../hooks/reactQuery/useToken';
import useAccount from '../../hooks/reactQuery/useAccount';

import { priceStringDivUnit } from '../../utils/format';
import useIsLoginAddress from '../../hooks/utils/useIsLoginAddress';
import { useAppSelector } from '../../hooks/redux';
import BuyDialog from './BuyDialog';
import OfferDialog from './OfferDialog';
import DutchDialog from './DutchDialog';
import BritishDialog from './BritishDialog';

const propertiesArr = [1, 2, 3, 4, 5, 6];
const OfferssUnitArr = [1, 2, 3, 4, 5, 6];

const Detail = ({ match }: RouteComponentProps<{ nftId: string }>) => {
  function number2PerU16(x) {
    return (x / 65535) * 100;
  }
  const chainState = useAppSelector((state) => state.chain);
  const { t } = useTranslation();
  const history = useHistory();
  const [isCollect, setIsCollect] = useState(false);

  const [remainingTime, setRemainingTime] = useState(0);
  const { account } = chainState;
  const { nftId } = match.params;
  const { data: nftData, isLoading: nftDataIsLoading } = useNft(nftId);
  const collectionsId = nftId.split('-')[0];
  const tokenId = nftId.split('-')[1];

  const collectNft = async (type:string) => {
    const data = {
      nft_id: nftId,
      collecter_id: account?.address || '',
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
      nft_id: nftId,
      viewer_id: account?.address || '',
    };
    await axios.post(`${CACHE_SERVER_URL}nfts/action/view`, qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  };

  const [isShowCancel, setIsShowCancel] = useState(false);
  const [isCancelAuction, setIsCancelAuction] = useState(false);
  const [isShowDeal, setIsShowDeal] = useState(false);
  const [isShowBuy, setIsShowBuy] = useState(false);
  const [isShowOffer, setIsShowOffer] = useState(false);
  const [isShowDutch, setIsShowDutch] = useState(false);
  const [isShowBritish, setIsShowBritish] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offerId, setOfferId] = useState('');
  const [offerOwner, setOfferOwner] = useState('');
  const [events, setEvents] = useState(
    {
      times: 0,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
    },
  );

  const countFun = (index:number) => {
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
  useEffect(() => {
    collectNft('status');
    browse();
    getBlock().then((res) => {
      setRemainingTime(res);
    });
  }, []);
  useEffect(() => {
    if (type && remainingTime) {
      countFun(deadline);
    }
  }, [remainingTime]);

  const { data: token } = useToken();
  const isLoginAddress = useIsLoginAddress(nftData?.nftInfo.owner_id);
  const { data: collectionsData, isLoading: collectionsDateIsLoading } = useCollectionsSinger(collectionsId);
  if (nftDataIsLoading || collectionsDateIsLoading || !nftData) {
    return <Spinner />;
  }

  const logoUrl = `${PINATA_SERVER}${nftData.nftInfo.metadata.logoUrl}`;
  const price = priceStringDivUnit(nftData?.nftInfo?.price);
  const collectionName = collectionsData?.collection?.metadata?.name;
  const nftName = nftData?.nftInfo?.metadata.name;

  const ownerId = nftData?.nftInfo?.owner_id;
  const orderId = nftData?.nftInfo?.order_id;
  const termOfValidity = !!((nftData?.nftInfo?.auction?.deadline - remainingTime) > 0);
  const auctionId = nftData?.nftInfo?.auction?.id;
  const initPrice = priceStringDivUnit(nftData?.nftInfo?.auction?.init_price);
  const minRaise = price * (1 + number2PerU16(nftData?.nftInfo?.auction?.min_raise) / 100);
  const creatorId = nftData?.nftInfo?.auction?.creator_id;
  // console.log(creatorId);

  return (
    <MainContainer title={`${nftName}-${collectionName}${t('Detail.title')}`}>
      {!type && isLoginAddress ? (
        <>
          {nftData?.nftInfo.status === 'Selling'
            ? (
              <Flex
                minWidth="1364px"
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
                      onClick={() => history.push(`/sellSetting/${nftId}`)}
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
                  justifyContent="flex-end"
                >
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
                      onClick={() => history.push(`/sellSetting/${nftId}`)}
                    >
                      {t('Detail.Sell')}
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
            )}
        </>
      ) : ''}
      {type && isLoginAddress ? (
        <>
          {termOfValidity
            ? (
              <Flex
                minWidth="1364px"
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
                      {t('Detail.cancelTips')}
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
                    {t('Detail.cancelTips')}
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
            )}
        </>
      ) : ''}
      <Container
        mt="40px"
        display="flex"
        flexDirection="column"
        width="100%"
        height="100%"
        justifyContent="flex-start"
      >

        <Flex
          w="100%"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <DetailLeft
            nftData={nftData}
            collectionsData={collectionsData}
            logoUrl={logoUrl}
            propertiesArr={propertiesArr}
          />
          <DetailRight
            nftData={nftData}
            collectionsData={collectionsData}
            account={account}
            isLoginAddress={isLoginAddress}
            isCollect={isCollect}
            remainingTime={remainingTime}
            setOfferId={setOfferId}
            setOfferOwner={setOfferOwner}
            setIsShowDeal={setIsShowDeal}
            setIsShowBuy={setIsShowBuy}
            token={token}
            OfferssUnitArr={OfferssUnitArr}
            setIsShowOffer={setIsShowOffer}
            setIsCollect={setIsCollect}
            collectNft={collectNft}
            types={type}
            deadline={deadline}
            setIsShowBritish={setIsShowBritish}
            setIsShowDutch={setIsShowDutch}
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
            moreThan={minRaise || Number(initPrice)}
            creatorId={creatorId}
            auctionId={auctionId}
          />
        )}
        {isShowDutch && (
          <DutchDialog
            isShowDutch={isShowDutch}
            setIsShowDutch={setIsShowDutch}
            price={price}
            logoUrl={logoUrl}
            nftName={nftName}
            collectionName={collectionName}
            creatorId={creatorId}
            auctionId={auctionId}
          />
        )}
        {isShowCancel && (
          <CancelDialog
            isShowCancel={isShowCancel}
            setIsShowCancel={setIsShowCancel}
            orderId={orderId}
            nftId={nftId}
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
            orderId={nftData?.nftInfo.status === 'Selling' ? orderId : ''}
          />
        )}
      </Container>
      <Modal isOpen={isSubmitting} onClose={() => setIsSubmitting(false)}>
        <ModalOverlay />
      </Modal>
    </MainContainer>

  );
};
export default Detail;
