/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import React, {
  FC, MouseEventHandler, useState, useEffect,
} from 'react';
import Countdown, { zeroPad } from 'react-countdown';
import {
  Flex,
  Image,
  Text,
  Box,
  Link,
  Button,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps, useHistory, Link as RouterLink } from 'react-router-dom';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import NoData from '../NoData';
import TimeBy from '../TimeBy';
import PriceHistoryChart from '../PriceHistoryChart';
import { priceStringDivUnit, currentPrice } from '../../../utils/format';
import { renderNmtNumberText } from '../../../components/Balance';

import {
  // IconDetailsRefresh,
  // IconDetailshaSre,
  IconDetailsDetail,
  // PriceIcon,
  HeadPortrait,
  IconAuthentication,
  // IconLeft,
  Historyempty,
  IconRankDown,
  IconRankUp,
} from '../../../assets/images';

interface Props {
  nftData: {
    nftInfo: {
      burned: string | null
      class_id: string
      creator_id: string
      deposit: string | null
      id: string
      metadata: Metadata
      description: string
      logoUrl: string
      name: string
      nftMartUrl: string
      url: string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      offers: any[]
      order_status: string
      owner_id: string
      price: string
      quantity: number
      royalty: boolean
      status: Status
      token_id: string
      category: []
    }
  },
  collectionsData:{
    collection:{
      metadata:{
        name: string,
        id: string,
        description: string,
        logoUrl: string,
        // eslint-disable-next-line @typescript-eslint/ban-types
        links: {} | undefined,
      },
      royalty_rate: number,
      id: string
    }
  } | undefined,
  account:InjectedAccountWithMeta | null,
  isLoginAddress:boolean,
  remainingTime:number,
  setOfferId: React.Dispatch<React.SetStateAction<string>>,
  setOfferOwner: React.Dispatch<React.SetStateAction<string>>,
  setIsShowDeal: React.Dispatch<React.SetStateAction<boolean>>,
  setIsShowBuy: React.Dispatch<React.SetStateAction<boolean>>,
  setIsShowOffer: React.Dispatch<React.SetStateAction<boolean>>,
  token:{ token: string; } | undefined,
  OfferssUnitArr:[],
  types:string
  deadline:number,
  setIsShowBritish:React.Dispatch<React.SetStateAction<boolean>>,
  setIsShowDutch:React.Dispatch<React.SetStateAction<boolean>>,
  setIsShowFixed:React.Dispatch<React.SetStateAction<boolean>>,
  recipientsId:string,
  setIshowReceive:React.Dispatch<React.SetStateAction<boolean>>,
  setIsAllowBritish:React.Dispatch<React.SetStateAction<boolean>>,
}
const DetailRight: FC<Props> = (({
  nftData,
  collectionsData,
  account,
  isLoginAddress,
  remainingTime,
  setOfferId,
  setOfferOwner,
  setIsShowDeal,
  setIsShowBuy,
  token,
  setIsShowOffer,
  OfferssUnitArr,
  types,
  deadline,
  setIsShowBritish,
  setIsShowDutch,
  setIsShowFixed,
  recipientsId,
  setIshowReceive,
  setIsAllowBritish,
}) => {
  const history = useHistory();
  const [selectedTime, setSelectedTime] = useState('seven');

  const formatAddress = (addr: string) => `${addr?.slice(0, 4)}...${addr?.slice(-4)}`;
  const price = nftData?.nftInfo?.price ? priceStringDivUnit(nftData?.nftInfo?.price) : null;
  const auctionPrice = nftData?.nftInfo?.auction?.price ? priceStringDivUnit(nftData?.nftInfo?.auction?.price) : null;

  const duchPrice = currentPrice(Number(nftData?.nftInfo?.auction?.max_price), Number(nftData?.nftInfo?.auction?.min_price), Number(nftData?.nftInfo?.auction?.deadline), remainingTime, Number(nftData?.nftInfo?.auction?.block_created));
  const collectionName = collectionsData?.collection?.metadata?.name;
  const nftName = nftData?.nftInfo?.metadata.name;
  const OffersArr = nftData?.nftInfo?.offers;
  const auctionStatus = nftData?.nftInfo?.auction?.status ? nftData?.nftInfo?.auction?.status : null;
  const allowBritishAuction = nftData?.nftInfo?.auction?.allow_british_auction || false;
  const bidCount = nftData?.nftInfo?.auction?.bid_count || false;

  const PriceHistory = nftData?.nftInfo?.history[selectedTime];
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
  useEffect(() => {
    if (types && remainingTime) {
      countFun(deadline);
    }
  }, [remainingTime]);
  const { t } = useTranslation();

  const handleDeal = (offerIdItem:string, offerOwnerItem:string) => {
    if (!account) {
      history.push(`/connect?callbackUrl=item/${nftId}`);
    }
    setOfferId(offerIdItem);
    setOfferOwner(offerOwnerItem);
    setIsShowDeal(true);
  };
  const handleBuy = () => {
    if (!account) {
      history.push(`/connect?callbackUrl=item/${nftId}`);
    }
    setIsShowBuy(true);
  };
  const handleOffer = () => {
    if (!account) {
      history.push(`/connect?callbackUrl=item/${nftId}`);
    }
    setIsShowOffer(true);
  };

  const timeBlock = (index:numer) => {
    const times = (index - remainingTime) * 6;

    let theTime = parseInt(times.toString(), 10);
    let middle = 0;
    let hour = 0;

    if (theTime > 60) {
      middle = parseInt((theTime / 60).toString(), 10);
      theTime = parseInt((theTime % 60).toString(), 10);
      if (middle > 60) {
        hour = parseInt((middle / 60).toString(), 10);
        middle = parseInt((middle % 60).toString(), 10);
      }
    }
    // let result = null;
    let result = `${parseInt(theTime.toString(), 10)}`;
    if (middle > 0) {
      result = `${parseInt(middle.toString(), 10)}:${result}`;
    }
    if (hour > 0) {
      result = `${parseInt(hour.toString(), 10)}:${result}`;
      // result = `${parseInt(hour.toString(), 10)}`;
    }
    return result;
  };
  const add0 = (m) => (m < 10 ? `0${m}` : m);
  const format = (time:string) => {
    const times = new Date(time);
    const y = times.getFullYear();
    const m = times.getMonth() + 1;
    const d = times.getDate();
    const h = times.getHours();
    const mm = times.getMinutes();
    const s = times.getSeconds();
    return `${y}-${add0(m)}-${add0(d)} ${add0(h)}:${add0(mm)}:${add0(s)}`;
  };
  const TABS = [
    {
      id: '0',
      title: t('Detail.offers'),
    },
    {
      id: '1',
      title: t('Detail.activities'),
    },
    {
      id: '2',
      title: t('Detail.priceHistory'),
    },
  ];
  const [selectTabId, setSelectTabId] = useState(0);
  const handletabSelect: MouseEventHandler<HTMLButtonElement> = (event) => {
    setSelectTabId(Number(event.currentTarget.id));
  };
  const front = (time) => {
    const b = time.toString().split('.');
    return b[0];
  };
  const hinder = (time) => {
    const b = time.toString().split('.');
    return b[1];
  };
  const renderer = ({
    hours, minutes, seconds,
  }) => (
    <Box
      fontSize="12px"
      fontFamily="TTHoves-Medium, TTHoves"
      fontWeight="500"
      color="#FFFFFF"
      lineHeight="14px"
      textAlign="right"
      display="flex"
      justifyContent="flex-end"
      position="relative"
    >
      <Flex align="flex-start" alignItems="center" color="#FFFFFF">
        <Box
          width="18px"
          height="28px"
          background="red"
          borderRadius="1px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          mr="2px"
        >
          {front(Number(zeroPad(hours)) / 10) || 0}
        </Box>
        <Box
          width="18px"
          height="28px"
          background="red"
          borderRadius="1px"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >

          {hinder(Number(zeroPad(hours)) / 10) || 0}
        </Box>
        <Text
          fontSize="12px"
          width="6px"
          color="#000000"
          textAlign="center"
          position="relative"
          zIndex="2"
        >
          :
        </Text>
        <Box
          width="18px"
          height="28px"
          background="red"
          borderRadius="1px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          mr="2px"
        >
          {front(Number(zeroPad(minutes)) / 10) || 0}
        </Box>
        <Box
          width="18px"
          height="28px"
          background="red"
          borderRadius="1px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          mr="0px"
        >
          {hinder(Number(zeroPad(minutes)) / 10) || 0}
        </Box>
        <Text
          fontSize="12px"
          width="6px"
          color="#000000"
          textAlign="center"
          position="relative"
          zIndex="2"
        >
          :
        </Text>
        <Box
          mr="2px"
          width="18px"
          height="28px"
          background="red"
          borderRadius="1px"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {front(Number(zeroPad(seconds)) / 10) || 0}
        </Box>
        <Box
          width="18px"
          height="28px"
          background="red"
          borderRadius="1px"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {hinder(Number(zeroPad(seconds)) / 10) || 0}
        </Box>
      </Flex>
    </Box>

  );
  return (
    <Flex width="748px" flexDirection="column">
      <Flex
        width="100%"
        flexDirection="column"
        justifyContent="flex-start"
        borderBottom="1px solid #000000"
      >
        <Flex flexDirection="column" p="0 0px 0 0px" alignItems="flex-start">
          <Text
            fontSize="54px"
            fontFamily="TTHoves-Bold, TTHoves"
            fontWeight="bold"
            color="#000000"
            lineHeight="64px"
          >
            {nftName}
          </Text>
          <Link
            mt="10px"
            as={RouterLink}
            to={`/collection/${account?.address}?collectionId=${collectionsData?.collection?.id}`}
          >
            <Flex alignItems="center">
              <Text
                p="2px 10px"
                backgroundColor="#000000"
                fontSize="14px"
                fontFamily="TTHoves-Regular, TTHoves"
                fontWeight="400"
                color="#FFFFFF"
              >
                {collectionName}
              </Text>
              <Image
                ml="4px"
                w="18px"
                h="18px"
                src={IconAuthentication.default}
              />
            </Flex>
          </Link>
          <Link
            display="inline-block"
            as={RouterLink}
            to={`/collection/${account?.address}?collectionId=${collectionsData?.collection?.id}`}
          >
            <Flex p="20px 0 0 0" justifyContent="flex-start" alignItems="center">
              <Image pr="4px" w="50px" h="auto" src={HeadPortrait.default} />
              <Flex flexDirection="column">
                <Text
                  color="#000000"
                  align="center"
                  fontSize="16px"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  textAlign="start"
                  fontFamily="TTHoves-Medium, TTHoves"
                  fontWeight="500"
                  lineHeight="18px"
                >
                  作者名字
                </Text>
                <Text
                  mt="2px"
                  color="#999999"
                  align="center"
                  fontSize="12px"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  textAlign="start"
                  fontFamily="TTHoves-Thin, TTHoves"
                  fontWeight="100"
                  lineHeight="14px"
                >
                  Owner
                </Text>
              </Flex>
            </Flex>
          </Link>
        </Flex>
        <Flex
          mt="30px"
          w="100%"
          h="100%"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-start"
          p="0 0px 0 0px"
        >
          <Flex flexDirection="column">
            <Flex h="100%" flexDirection="column" justifyContent="center">
              <Text
                fontSize="24px"
                fontFamily="TTHoves-Medium, TTHoves"
                fontWeight="500"
                color="#000000"
                lineHeight="29px"
                mb="8px"
              >
                {t('Detail.currentPrice')}
              </Text>
              <Flex flexDirection="column" justifyContent="flex-start">
                <Flex height="43px" flexDirection="row" alignItems="flex-end">
                  <Text
                    fontSize="36px"
                    fontFamily="TTHoves-Bold, TTHoves"
                    fontWeight="500"
                    color="#000000"
                    lineHeight="43px"
                  >
                    {types === 'British' ? (
                      auctionPrice
                    ) : null}
                    {types === 'Dutch' && !allowBritishAuction ? (
                      duchPrice
                    ) : null}
                    {types === 'Dutch' && allowBritishAuction && Number(bidCount) === 0 ? (
                      duchPrice
                    ) : null}
                    {types === 'Dutch' && allowBritishAuction && Number(bidCount) > 0 ? (
                      auctionPrice
                    ) : null}
                    {!types ? (
                      Number(price) ? price : '-'
                    ) : null}
                  </Text>
                  <Text
                    m="0 0 0px 4px"
                    fontSize="24px"
                    fontFamily="TTHoves-Regular, TTHoves"
                    fontWeight="400"
                    color="#999999"
                  >
                    {types === 'British' ? (
                      Number(auctionPrice) ? `NMT ($${token?.price * Number(auctionPrice)})` : null
                    ) : null}
                    {types === 'Dutch' && !allowBritishAuction ? (
                      Number(duchPrice) ? `NMT ($${token?.price * Number(duchPrice)})` : null
                    ) : null}
                    {types === 'Dutch' && allowBritishAuction && Number(bidCount) === 0 ? (
                      Number(duchPrice) ? `NMT ($${token?.price * Number(duchPrice)})` : null
                    ) : null}
                    {types === 'Dutch' && allowBritishAuction && Number(bidCount) > 0 ? (
                      Number(auctionPrice) ? `NMT ($${token?.price * Number(auctionPrice)})` : null
                    ) : null}
                    {!types ? (
                      Number(price) ? `NMT ($${token?.price * Number(price)})` : null
                    ) : null}
                  </Text>
                  {types === 'Dutch' && !allowBritishAuction ? (
                    <Image
                      m="0 0 8px 10px"
                      w="20px"
                      h="20px"
                      src={IconRankDown.default}
                    />
                  ) : null}
                  {types === 'Dutch' && allowBritishAuction && Number(bidCount) === 0 ? (
                    <Image
                      m="0 0 8px 10px"
                      w="20px"
                      h="20px"
                      src={IconRankDown.default}
                    />
                  ) : null}
                  {types === 'Dutch' && allowBritishAuction && Number(bidCount) > 0 ? (
                    <Image
                      m="0 0 8px 10px"
                      w="20px"
                      h="20px"
                      src={IconRankUp.default}
                    />
                  ) : null}
                  {Number(auctionPrice) && types === 'British'
                    ? (
                      <Image
                        m="0 0 8px 10px"
                        w="20px"
                        h="20px"
                        src={IconRankUp.default}
                      />
                    ) : null}
                </Flex>
              </Flex>
            </Flex>
            <Flex h="100%" m="16px 0 35px 0" flexDirection="column" justifyContent="center">
              {types === 'Dutch' && events.times > 0 ? (
                <Button
                  width="184px"
                  height="48px"
                  background={!isLoginAddress ? '#000000' : '#999999'}
                  borderRadius="4px"
                  fontSize="16px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="500"
                  color={!isLoginAddress ? '#FFFFFF' : '#FFFFFF'}
                  isDisabled={isLoginAddress || Number(events.times) === 0}
                  onClick={() => {
                    if (allowBritishAuction && Number(bidCount) > 0) {
                      setIsAllowBritish(true);
                    } else {
                      setIsShowDutch(true);
                    }
                  }}
                >
                  {!isLoginAddress ? t('Detail.placeBid') : '-'}
                </Button>
              ) : null}
              {types === 'British' && events.times > 0 ? (
                <Button
                  width="184px"
                  height="48px"
                  background={!isLoginAddress ? '#000000' : '#999999'}
                  borderRadius="4px"
                  fontSize="16px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="500"
                  color={!isLoginAddress ? '#FFFFFF' : '#FFFFFF'}
                  isDisabled={isLoginAddress || Number(events.times) === 0}
                  onClick={() => setIsShowBritish(true)}
                >
                  {!isLoginAddress ? t('Detail.placeBid') : '-'}
                </Button>
              ) : null}
              {!types ? (
                <Button
                  width="184px"
                  height="48px"
                  background={!isLoginAddress && Number(price) > 0 ? '#000000' : '#999999'}
                  borderRadius="4px"
                  fontSize="16px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="500"
                  color={!isLoginAddress && Number(price) > 0 ? '#FFFFFF' : '#FFFFFF'}
                  isDisabled={isLoginAddress || Number(price) === 0}
                  onClick={handleBuy}
                >
                  {!isLoginAddress && Number(price) > 0 ? t('Detail.buyNow') : '-'}
                </Button>
              ) : null}
              {recipientsId === account?.address && events.times === 0 && auctionStatus === 'Created' ? (
                <Button
                  width="184px"
                  height="48px"
                  background="#000000"
                  borderRadius="4px"
                  fontSize="16px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="500"
                  color="#FFFFFF"
                  onClick={() => setIshowReceive(true)}
                >
                  {t('Detail.receive')}
                </Button>
              ) : null}

              {/* <Text
                  fontSize="14px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="400"
                  color="#999999"
                >
                  * Extend 30 minutes after bidding
                </Text> */}
            </Flex>
          </Flex>
          {types && Number(events.day) < 4 && Number(events.times) > 0 ? (
            <Flex flexDirection="column" h="100%" justifyContent="flex-start">
              <Text
                color="#000000"
                align="center"
                fontSize="16px"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                textAlign="right"
                mb="12px"
              >
                Auction onds in
              </Text>
              {Number(events.times)
                ? (
                  <Countdown
                    autoStart
                    daysInHours
                    date={Date.now() + Number(events.times)}
                    renderer={renderer}
                  />
                ) : null}
            </Flex>
          ) : null}
        </Flex>
        {Number(nftData.nftInfo.auction?.hammer_price) && Number(events.times) > 0
          ? (
            <Flex
              width="100%"
              height="65px"
              background="#F9F9F9"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              p="0 20px 0 20px"
              m="0px 0 20px 0px"
            >
              <Text
                fontSize="14px"
                fontFamily="TTHoves-Regular, TTHoves"
                fontWeight="400"
                color="#999999"
              >
                {!isLoginAddress ? '*You can buy this item immediately using Fixed Price' : '-'}
              </Text>

              <Flex flexDirection="row" justifyContent="flex-end" alignItems="center">
                <Text
                  fontSize="14px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="bold"
                  color="#999999"
                  display="flex"
                  flexDirection="row"
                >
                  {t('Detail.fixedPrice')}
                  <Text
                    m="0 3px"
                    fontSize="14px"
                    fontFamily="TTHoves-Regular, TTHoves"
                    fontWeight="400"
                    color="#000000"
                  >
                    {priceStringDivUnit(nftData.nftInfo.auction?.hammer_price)}
                  </Text>
                  NMT
                </Text>
                {!isLoginAddress
                  && (
                    <Button
                      ml="40px"
                      width="109px"
                      height="35px"
                      background="#FFFFFF"
                      borderRadius="4px"
                      border="1px solid #3D00FF"
                      fontSize="14px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#3D00FF"
                      onClick={() => { setIsShowFixed(true); }}
                    >
                      {t('Detail.buyNow')}
                    </Button>
                  )}
              </Flex>
            </Flex>
          )
          : null}
      </Flex>
      <Flex
        p="0 0px 0 0px"
        mt="20px"
        w="100%"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        {TABS.map((item, index) => (
          <Button
            key={item.id}
            id={item.id}
            mr="40px"
            height="36px"
            borderRadius="2px"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            onClick={handletabSelect}
            backgroundColor={selectTabId === index ? '#000000' : '#FFFFFF'}
          >
            <Flex h="100%" alignItems="center">
              <Text
                fontSize="16px"
                fontFamily="TTHoves-Medium, TTHoves"
                fontWeight="500"
                color={selectTabId === index ? '#FFFFFF' : '#191A24'}
                lineHeight="18px"
              >
                {item.title}
              </Text>
            </Flex>
          </Button>
        ))}
      </Flex>
      {selectTabId === 0 ? (
        <Box p="20px 0">
          <Flex w="100%" flexDirection="column" justifyContent="flex-start">
            {OffersArr.length
              ? (
                <>
                  <Flex h="40px" w="100%" flexDirection="row" justifyContent="space-between" align="center">
                    <Text
                      w="136px"
                      textAlign="left"
                      fontSize="12px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#999999"
                      lineHeight="20px"
                    >
                      {t('Detail.from')}
                    </Text>
                    <Text
                      w="136px"
                      textAlign="center"
                      fontSize="12px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#999999"
                      lineHeight="20px"
                    >
                      {t('Detail.price')}
                    </Text>
                    <Text
                      w="136px"
                      textAlign="center"
                      fontSize="12px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#999999"
                      lineHeight="20px"
                    >
                      {t('Detail.expiration')}
                    </Text>
                    <Text
                      w="136px"
                      textAlign="right"
                      fontSize="12px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#999999"
                      lineHeight="20px"
                    />

                  </Flex>
                  <Box height="162px" overflowY="scroll" boxSizing="border-box">
                    {OffersArr.map((item) => (
                      <Box
                        key={item.id}
                        h="54px"
                      >
                        <Flex
                          w="100%"
                          flexDirection="row"
                          justifyContent="space-between"
                          align="center"
                        >
                          <Text
                            w="136px"
                            textAlign="left"
                            fontSize="14px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#000000"
                            lineHeight="20px"
                          >
                            {item.bidder_id ? formatAddress(item.bidder_id) : (item?.order?.seller_id
                              ? formatAddress(item?.order?.seller_id)
                              : formatAddress(item?.order?.buyer_id))}
                          </Text>
                          <Text
                            w="136px"
                            display="flex"
                            flexDirection="row"
                            justifyContent="center"
                            fontSize="14px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#000000"
                            lineHeight="20px"
                          >
                            {item.price ? priceStringDivUnit(item.price) : priceStringDivUnit(item?.order?.price)}
                            <Text
                              ml="3px"
                              color="#999999"
                            >
                              NMT
                            </Text>
                          </Text>
                          {item?.order?.deadline && item.order.status_id === 'Created' ? (
                            <Text
                              minW="136px"
                              textAlign="center"
                              fontSize="14px"
                              fontFamily="TTHoves-Regular, TTHoves"
                              fontWeight="400"
                              color="#000000"
                              lineHeight="20px"
                            >
                              in
                              {' '}

                              {Number(timeBlock(item?.order?.deadline)) > 0 ? timeBlock(item?.order?.deadline) : '-'}
                              {' '}
                              hours
                            </Text>
                          ) : (
                            <Text
                              w="136px"
                              textAlign="center"
                              fontSize="14px"
                              fontFamily="TTHoves-Regular, TTHoves"
                              fontWeight="400"
                              color="#000000"
                              lineHeight="20px"
                            >
                              {item.timestamp ? format(item.timestamp) : '-'}
                            </Text>
                          )}
                          {Number(timeBlock(item?.order?.deadline)) > 0 && isLoginAddress && item.order.status_id === 'Created' ? (
                            <Text
                              w="136px"
                              textAlign="right"
                              fontSize="14px"
                              fontFamily="TTHoves-Regular, TTHoves"
                              fontWeight="400"
                              color="#3D00FF"
                              lineHeight="20px"
                              onClick={() => {
                                handleDeal(item.order_id, item.order.buyer_id);
                              }}
                            >
                              {' '}
                              {t('Detail.deal')}
                            </Text>
                          ) : (
                            <Text
                              w="136px"
                              textAlign="right"
                              fontSize="14px"
                              fontFamily="TTHoves-Regular, TTHoves"
                              fontWeight="400"
                              lineHeight="20px"
                            >
                              {' '}
                              -
                            </Text>
                          )}
                        </Flex>
                      </Box>
                    ))}
                  </Box>
                </>
              )
              : (
                <NoData widths="732px" />
              )}
            <Flex justifyContent="flex-end">
              {isLoginAddress ? (
                ''
              ) : (
                <Button
                  mt="16px"
                  width="132px"
                  height="40px"
                  background="#FFFFFF"
                  borderRadius="4px"
                  border="1px solid #000000"
                  fontSize="16px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="500"
                  color="#000000"
                  onClick={handleOffer}
                  isDisabled={!!(types)}
                >
                  {t('Detail.makeOffer')}
                </Button>
              )}
            </Flex>
          </Flex>
        </Box>
      ) : null}
      {selectTabId === 1 ? (
        <Box p="20px">
          {0 / 1
            ? (
              <Box p="0 20px">
                <Flex w="100%" flexDirection="column" justifyContent="flex-start">
                  <Flex h="40px" w="100%" flexDirection="row" justifyContent="space-between" align="center">
                    <Text
                      w="136px"
                      textAlign="left"
                      fontSize="12px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#999999"
                      lineHeight="20px"
                    >
                      {t('Detail.Event')}
                    </Text>
                    <Text
                      w="136px"
                      textAlign="center"
                      fontSize="12px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#999999"
                      lineHeight="20px"
                    >
                      {t('Detail.UnitPrice')}
                    </Text>
                    <Text
                      w="136px"
                      textAlign="center"
                      fontSize="12px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#999999"
                      lineHeight="20px"
                    >
                      {t('Detail.Quantity')}
                    </Text>
                    <Text
                      w="136px"
                      textAlign="center"
                      fontSize="12px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#999999"
                      lineHeight="20px"
                    >
                      {t('Detail.from')}
                    </Text>
                    <Text
                      w="136px"
                      textAlign="center"
                      fontSize="12px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#999999"
                      lineHeight="20px"
                    >
                      {t('Detail.To')}
                    </Text>
                    <Text
                      w="136px"
                      textAlign="right"
                      fontSize="12px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#999999"
                      lineHeight="20px"
                    >
                      {t('Detail.Date')}
                    </Text>

                  </Flex>
                  {OfferssUnitArr.map((item) => (
                    <Flex
                      key={item}
                      h="54px"
                      w="100%"
                      flexDirection="row"
                      justifyContent="space-between"
                      align="center"
                    >
                      <Text
                        w="136px"
                        textAlign="left"
                        fontSize="14px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#000000"
                        lineHeight="20px"
                      >
                        Listing
                      </Text>
                      <Text
                        w="136px"
                        display="flex"
                        flexDirection="row"
                        justifyContent="center"
                        fontSize="14px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#000000"
                        lineHeight="20px"
                      >
                        29084
                        <Text
                          ml="3px"
                          color="#999999"
                        >
                          NMT
                        </Text>
                      </Text>
                      <Text
                        w="136px"
                        textAlign="center"
                        fontSize="14px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#000000"
                        lineHeight="20px"
                      >
                        6
                      </Text>
                      <Text
                        w="136px"
                        textAlign="center"
                        fontSize="14px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#3D00FF"
                        lineHeight="20px"
                      >
                        4tf...fp
                      </Text>
                      <Text
                        w="136px"
                        textAlign="center"
                        fontSize="14px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#000000"
                        lineHeight="20px"
                      />
                      <Text
                        w="136px"
                        textAlign="right"
                        fontSize="14px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#000000"
                        lineHeight="20px"
                      >
                        i minutes
                      </Text>
                    </Flex>
                  ))}

                </Flex>
              </Box>
            )
            : (
              <Box p="0px">
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
                    {t('Detail.noOffersDataYet')}
                  </Text>
                </Flex>
              </Box>
            )}
        </Box>
      ) : null}
      {selectTabId === 2 ? (
        <Box p="20px">
          <Flex flexDirection="row" justifyContent="flex-start" mb="20px">
            <TimeBy selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
            <Flex m="0 20px" textAlign="center" flexDirection="column" justifyContent="center">
              <Text
                mb="2px"
                fontSize="12px"
                fontFamily="TTHoves-Regular, TTHoves"
                fontWeight="400"
                color="#999999"
                lineHeight="14px"
              >
                {t(`Detail.${selectedTime}`)}
                {' '}
                {t('Detail.average')}
              </Text>
              <Flex align="flex-start" alignItems="center">
                <Box w="14px" h="14px" src={IconDetailsDetail.default} as="img" alt="" mr="4px" />
                <Text
                  fontSize="16px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="400"
                  color="#000000"
                  lineHeight="18px"
                >
                  {renderNmtNumberText(PriceHistory?.average) || '-'}
                </Text>
              </Flex>
            </Flex>
            <Flex textAlign="center" flexDirection="column" justifyContent="center">
              <Text
                mb="2px"
                fontSize="12px"
                fontFamily="TTHoves-Regular, TTHoves"
                fontWeight="400"
                color="#999999"
                lineHeight="14px"
              >
                {t(`Detail.${selectedTime}`)}
                {' '}
                {t('Detail.volume')}
              </Text>
              <Flex align="flex-start" alignItems="center">
                <Box w="14px" h="14px" src={IconDetailsDetail.default} as="img" alt="" mr="4px" />
                <Text
                  fontSize="16px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="400"
                  color="#000000"
                  lineHeight="18px"
                >
                  {PriceHistory?.volume || '-'}
                </Text>
              </Flex>
            </Flex>
          </Flex>
          {PriceHistory?.price_list.length
            ? (
              <PriceHistoryChart PriceDate={PriceHistory.price_list} />)
            : (
              <NoData widths="100%" />
            )}
        </Box>
      ) : null}
    </Flex>

  );
});
export default DetailRight;
