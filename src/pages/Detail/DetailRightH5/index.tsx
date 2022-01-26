/* eslint-disable no-return-assign */
/* eslint-disable react-hooks/rules-of-hooks */
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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import Identicon from '@polkadot/react-identicon';
import InfiniteScroll from 'react-infinite-scroll-component';
import NoData from '../NoData';
import TimeBy from '../TimeByH5';
import Activity from '../ActivityH5';
import PriceHistoryChart from '../PriceHistoryChart';
import { priceStringDivUnit, currentPrice, formatNum } from '../../../utils/format';
import { renderNmtNumberText } from '../../../components/Balance';
import useEvent from '../../../hooks/reactQuery/useEvent';
import useHistoryprice from '../../../hooks/reactQuery/useHistoryprice';
import {
  PINATA_SERVER,
  DEFAULT_PAGE_LIMIT,
} from '../../../constants';

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
  nftId: string,
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
  collectionsData: {
    collection: {
      metadata: {
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
  account: InjectedAccountWithMeta | null,
  isLoginAddress: boolean,
  isBidder: boolean,
  remainingTime: number,
  setOfferId: React.Dispatch<React.SetStateAction<string>>,
  setOfferOwner: React.Dispatch<React.SetStateAction<string>>,
  setIsShowDeal: React.Dispatch<React.SetStateAction<boolean>>,
  setIsShowRemove: React.Dispatch<React.SetStateAction<boolean>>,
  setIsShowBuy: React.Dispatch<React.SetStateAction<boolean>>,
  setIsShowOffer: React.Dispatch<React.SetStateAction<boolean>>,
  token: { token: string; } | undefined,
  OfferssUnitArr: [],
  types: string
  deadline: number,
  setIsShowBritish: React.Dispatch<React.SetStateAction<boolean>>,
  setIsShowDutch: React.Dispatch<React.SetStateAction<boolean>>,
  setIsShowFixed: React.Dispatch<React.SetStateAction<boolean>>,
  recipientsId: string,
  setIshowReceive: React.Dispatch<React.SetStateAction<boolean>>,
  setIsAllowBritish: React.Dispatch<React.SetStateAction<boolean>>,
}
const DetailRight: FC<Props> = (({
  nftId,
  nftData,
  collectionsData,
  account,
  isLoginAddress,
  isBidder,
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
  setIsShowRemove,
}) => {
  function number2PerU16(x) {
    return (x / 65535.0) * 100;
  }
  const {
    data: eventDate, fetchNextPage: fetchNextPageEventDate, refetch: fetchOEventDate,
  } = useEvent(
    {
      nftId,
    },
  );
  const history = useHistory();
  const [selectedTime, setSelectedTime] = useState('year');
  const [selectedTimeValue, setSelectedTimeValue] = useState('365');

  const { data: historyPrice } = useHistoryprice(
    {
      id: nftId,
      timePeriod: selectedTimeValue,
    },
  );
  const formatAddress = (addr: string) => (addr ? `${addr?.slice(0, 4)}...${addr?.slice(-4)}` : null);
  const price = nftData?.nftInfo?.price ? priceStringDivUnit(nftData?.nftInfo?.price) : null;
  const auctionPrice = nftData?.nftInfo?.auction?.price ? priceStringDivUnit(nftData?.nftInfo?.auction?.price) : null;

  const duchPrice = currentPrice(Number(nftData?.nftInfo?.auction?.max_price), Number(nftData?.nftInfo?.auction?.min_price), Number(nftData?.nftInfo?.auction?.deadline), remainingTime, Number(nftData?.nftInfo?.auction?.block_created));
  const collectionName = collectionsData?.collection?.metadata?.name;
  const nftName = nftData?.nftInfo?.metadata.name;
  const OffersArr = nftData?.nftInfo?.offers;
  const auctionStatus = nftData?.nftInfo?.auction?.status ? nftData?.nftInfo?.auction?.status : null;
  const allowBritishAuction = nftData?.nftInfo?.auction?.allow_british_auction || false;
  const bidCount = nftData?.nftInfo?.auction?.bid_count || false;

  const PriceHistory = historyPrice?.pages[0];
  const [events, setEvents] = useState(
    {
      times: 0,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
    },
  );
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
  useEffect(() => {
    if (types && remainingTime) {
      countFun(deadline);
    }
  }, [remainingTime]);
  const { t } = useTranslation();

  const handleDeal = (offerIdItem: string, offerOwnerItem: string) => {
    if (!account) {
      history.push(`/connect?callbackUrl=item/${nftId}`);
    }
    setOfferId(offerIdItem);
    setOfferOwner(offerOwnerItem);
    setIsShowDeal(true);
  };
  const handleCancel = (offerIdItem: string) => {
    if (!account) {
      history.push(`/connect?callbackUrl=item/${nftId}`);
    }
    setOfferId(offerIdItem);
    setIsShowRemove(true);
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

  const timeSurplus = (index: numer) => {
    const times = (Number(index) - Number(remainingTime)) * 6 * 1000;
    return times;
  };
  const add0 = (m) => (m < 10 ? `0${m}` : m);
  const format = (time: string) => {
    const times = new Date(time);
    const y = times.getFullYear();
    const m = times.getMonth() + 1;
    const d = times.getDate();
    const h = times.getHours();
    const mm = times.getMinutes();
    const s = times.getSeconds();
    return `${y}-${add0(m)}-${add0(d)}`;
  };

  function getDateDiff(dateTimeStamp: string) {
    let result;
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const times = new Date(dateTimeStamp);
    const idata = times.getTime();
    const now = new Date().getTime();
    const diffValue = now - idata;
    const y = times.getFullYear();
    const m = times.getMonth() + 1;
    const d = times.getDate();
    if (diffValue < 0) {
      return result = '-';
    }
    const dayC = diffValue / day;
    const hourC = diffValue / hour;
    const minC = diffValue / minute;
    if (dayC >= 1) {
      result = `${y}-${add0(m)}-${add0(d)}`;
    } else if (hourC >= 1) {
      result = `${parseInt(hourC.toString(), 10)} hour(s) ago`;
    } else if (minC >= 1) {
      result = `${parseInt(minC.toString(), 10)} minute(s) ago`;
    } else { result = `${parseInt(diffValue.toString(), 10)} minute(s) ago`; }
    return result;
  }
  function getDateIn(dateTimeStamp: string) {
    let result;
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const diffValue = Number(dateTimeStamp);
    if (diffValue < 0) {
      return result = '-';
    }
    const dayC = diffValue / day;
    const hourC = diffValue / hour;
    const minC = diffValue / minute;
    if (dayC >= 1) {
      result = `in ${parseInt(dayC.toString(), 10)} day(s) `;
    } else if (hourC >= 1) {
      result = `in ${parseInt(hourC.toString(), 10)} hour(s) `;
    } else if (minC >= 1) {
      result = `in ${parseInt(minC.toString(), 10)} minute(s) `;
    } else { result = `in ${parseInt(diffValue.toString(), 10)} second(s) `; }
    return result;
  }
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
    days, hours, minutes, seconds,
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
          width="14px"
          height="20px"
          background="red"
          borderRadius="1px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          mr="2px"
        >
          {front(Number(zeroPad(days * 24 + hours)) / 10) || 0}
        </Box>
        <Box
          width="14px"
          height="20px"
          background="red"
          borderRadius="1px"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >

          {hinder(Number(zeroPad(days * 24 + hours)) / 10) || 0}
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
          width="14px"
          height="20px"
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
          width="14px"
          height="20px"
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
          width="14px"
          height="20px"
          background="red"
          borderRadius="1px"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {front(Number(zeroPad(seconds)) / 10) || 0}
        </Box>
        <Box
          width="14px"
          height="20px"
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
    <Flex width="100%" flexDirection="column">
      <Flex
        width="100%"
        flexDirection="column"
        justifyContent="flex-start"
        borderBottom="1px solid #000000"
      >
        <Flex flexDirection="column" p="0 0px 0 0px" alignItems="flex-start">
          <Link
            mt="10px"
            as={RouterLink}
            to={`/collection/${collectionsData?.collection?.id}-${encodeURIComponent(collectionName)}`}
          >
            <Flex alignItems="center">
              <Text
                p="1px 10px"
                backgroundColor="#000000"
                fontSize="10px"
                fontFamily="TTHoves-Regular, TTHoves"
                fontWeight="400"
                color="#FFFFFF"
              >
                {collectionName}
              </Text>
              <Image
                ml="4px"
                w="16px"
                h="auto"
                src={IconAuthentication.default}
              />
            </Flex>
          </Link>
          <Link
            display="inline-block"
            as={RouterLink}
            to={`/account/${nftData?.nftInfo?.owner_id}${nftData?.nftInfo?.owner?.name ? `-${encodeURIComponent(nftData?.nftInfo?.owner?.name)}` : ''}/owned`}
          >
            <Flex p="20px 0 0 0" justifyContent="flex-start" alignItems="center">
              {nftData?.nftInfo?.owner?.avatar ? (
                <Image
                  mr="4px"
                  w="25px"
                  h="auto"
                  borderRadius="50%"
                  border="1px solid #D3D5DC"
                  src={`${PINATA_SERVER}user/${nftData?.nftInfo?.owner?.avatar}` || HeadPortrait.default}
                />
              ) : (
                <Identicon
                  className="ownerAvatarh5"
                  value={nftData?.nftInfo?.owner_id}
                />
              )}
              <Flex flexDirection="column">
                <Text
                  color="#0091FF"
                  align="center"
                  fontSize="8px"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  textAlign="start"
                  fontFamily="TTHoves-Medium, TTHoves"
                  fontWeight="500"
                  lineHeight="12px"
                >
                  {nftData?.nftInfo?.owner?.name || formatAddress(nftData?.nftInfo?.owner_id)}
                </Text>
                <Text
                  color="#999999"
                  align="center"
                  fontSize="8px"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  textAlign="start"
                  fontFamily="TTHoves-Thin, TTHoves"
                  fontWeight="100"
                  lineHeight="12px"
                >
                  {t('Detail.owner')}
                </Text>
              </Flex>
            </Flex>
          </Link>
        </Flex>
        <Flex
          mt="20px"
          w="100%"
          h="100%"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-start"
          p="0 0px 0 0px"
        >
          <Flex flexDirection="column">
            <Flex h="100%" flexDirection="column" justifyContent="center">
              <Flex
                mb="4px"
                justifyContent="flex-start"
              >
                <Text
                  fontSize="12px"
                  fontFamily="TTHoves-Medium, TTHoves"
                  fontWeight="500"
                  color="#000000"
                >
                  {t('Detail.currentPrice')}
                </Text>
                {nftData?.nftInfo?.royalty_rate
                  ? (
                    <Popover>
                      <PopoverTrigger>
                        <Flex
                          ml="10px"
                          height="100%"
                          alignItems="center"
                        >
                          <Box
                            width="0"
                            height="0"
                            borderWidth="0 13px 20px"
                            borderStyle="solid"
                            borderColor="transparent transparent #FFE0D8"
                            transform="rotate(270deg)"
                          />
                          <Box
                            position="relative"
                            left="-5px"
                            height="24px"
                            backgroundColor="#FFE0D8"
                            display="flex"
                            alignItems="center"
                            fontSize="12px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#FF6C47"
                            paddingRight="10px"
                          >
                            <Box
                              mr="4px"
                              width="8px"
                              height="8px"
                              borderRadius="50%"
                              backgroundColor="#FF6C47"
                              paddingRight="8px"
                            />
                            {t('Detail.Royalties')}
                            {' '}
                            {Math.ceil(number2PerU16(nftData?.nftInfo?.royalty_rate))}
                            %
                          </Box>
                        </Flex>
                      </PopoverTrigger>
                      <PopoverContent
                        position="absolute"
                        bottom="45px"
                        left="-60px"
                        w="220px"
                        height="90px"
                        _focus={{
                          outline: 'none',
                        }}
                      >
                        <PopoverBody>
                          {t('Detail.royaltiesTip')}

                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  ) : ''}
              </Flex>
              <Flex flexDirection="column" justifyContent="flex-start">
                <Flex height="27px" flexDirection="row" alignItems="flex-end">
                  <Text
                    fontSize="23px"
                    fontFamily="TTHoves-Bold, TTHoves"
                    fontWeight="500"
                    color="#000000"
                  >
                    {types === 'British' ? (
                      formatNum(auctionPrice)
                    ) : null}
                    {types === 'Dutch' && !allowBritishAuction ? (
                      formatNum(duchPrice)
                    ) : null}
                    {types === 'Dutch' && allowBritishAuction && Number(bidCount) === 0 ? (
                      formatNum(duchPrice)
                    ) : null}
                    {types === 'Dutch' && allowBritishAuction && Number(bidCount) > 0 ? (
                      formatNum(auctionPrice)
                    ) : null}
                    {!types ? (
                      Number(price) > 0 ? formatNum(price) : '-'
                    ) : null}
                  </Text>
                  <Text
                    m="0 0 6px 4px"
                    fontSize="14px"
                    fontFamily="TTHoves-Regular, TTHoves"
                    fontWeight="400"
                    color="#999999"
                  >
                    {types === 'British' ? (
                      Number(auctionPrice) && token?.price ? `NMT ($${formatNum(Number(token?.price) * Number(auctionPrice))})` : 'NMT'
                    ) : null}
                    {types === 'Dutch' && !allowBritishAuction ? (
                      Number(duchPrice) && token?.price ? `NMT ($${formatNum(Number(token?.price) * Number(duchPrice))})` : 'NMT'
                    ) : null}
                    {types === 'Dutch' && allowBritishAuction && Number(bidCount) === 0 ? (
                      Number(duchPrice) && token?.price ? `NMT ($${formatNum(Number(token?.price) * Number(duchPrice))})` : 'NMT'
                    ) : null}
                    {types === 'Dutch' && allowBritishAuction && Number(bidCount) > 0 ? (
                      Number(auctionPrice) && token?.price ? `NMT ($${formatNum(Number(token?.price) * Number(auctionPrice))})` : 'NMT'
                    ) : null}
                    {!types ? (
                      Number(price) > 0 && token?.price ? `NMT ($${formatNum(Number(token?.price) * Number(price))})` : 'NMT'
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
                  {Number(auctionPrice) > 0 && types === 'British'
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
          </Flex>
          {types && Number(events.day) < 4 && Number(events.times) > 0 ? (
            <Flex flexDirection="column" h="100%" justifyContent="flex-start">
              <Text
                color="#000000"
                align="center"
                fontSize="14px"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                textAlign="right"
                mb="5px"
              >
                {t('Detail.AuctionEndsIn')}
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
          {types && Number(events.day) > 4 && Number(events.times) > 0 ? (
            <Flex mr="20px" flexDirection="column" h="100%" justifyContent="flex-start">
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
                {Number(events.day)}
                {' '}
                days left
              </Text>
              <Text
                color="#999999"
                align="center"
                fontSize="12px"
                fontWeight="100"
                fontFamily="TTHoves-Thin, TTHoves"
                mb="12px"
              >
                {t('Detail.AuctionEndsIn')}
              </Text>
            </Flex>
          ) : null}
        </Flex>
        {Number(nftData?.nftInfo?.auction?.hammer_price) && Number(events.times) > 0
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
                    {formatNum(priceStringDivUnit(nftData?.nftInfo.auction?.hammer_price))}
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
        mt="20px"
        w="100%"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        {TABS.map((item, index) => (
          <Button
            p="0"
            key={item.id}
            id={item.id}
            mr="30px"
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
                p="0 6px"
                fontSize="10px"
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
            {OffersArr?.length
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
                      {types ? t('Detail.CreationTime') : t('Detail.expiration')}
                    </Text>
                  </Flex>
                  <Box height="270px" overflowY="scroll" boxSizing="border-box">
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
                            w="33.33%"
                            textAlign="left"
                            fontSize="14px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#3D00FF"
                            lineHeight="20px"
                          >
                            <Link
                              as={RouterLink}
                              to={`/account/${item.bidder_id}${item.user_info?.name ? `-${encodeURIComponent(item.user_info?.name)}` : ''}/owned`}
                            >
                              {item.user_info?.name ? item.user_info?.name
                                : formatAddress(item.bidder_id)}
                            </Link>
                          </Text>
                          <Text
                            w="33.33%"
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
                          {item?.deadline && item.type === 'order' ? (
                            <Text
                              w="33.33%"
                              textAlign="center"
                              fontSize="14px"
                              fontFamily="TTHoves-Regular, TTHoves"
                              fontWeight="400"
                              color="#000000"
                              lineHeight="20px"
                            >
                              {' '}
                              {Number(item?.deadline - remainingTime) > 0
                                ? getDateIn(Number(timeSurplus(item?.deadline)))
                                : getDateDiff(item.timestamp)}
                              {' '}
                            </Text>
                          ) : (
                            <Text
                              w="33.33%"
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

                        </Flex>
                      </Box>
                    ))}
                  </Box>
                </>
              )
              : (
                <NoData widths="270px" />
              )}
          </Flex>
        </Box>
      ) : null}
      {selectTabId === 1 ? (
        <Box>
          {eventDate?.pages?.length ? (
            <Box>
              <Flex w="100%" flexDirection="column" justifyContent="flex-start">
                <Flex h="40px" w="100%" flexDirection="row" justifyContent="space-between" align="center">
                  <Text
                    w="18%"
                    textAlign="left"
                    fontSize="12px"
                    fontFamily="TTHoves-Regular, TTHoves"
                    fontWeight="400"
                    color="#999999"
                    lineHeight="20px"
                  >
                    {t('Detail.event')}
                  </Text>
                  <Text
                    w="22%"
                    textAlign="center"
                    fontSize="12px"
                    fontFamily="TTHoves-Regular, TTHoves"
                    fontWeight="400"
                    color="#999999"
                    lineHeight="20px"
                  >
                    {t('Detail.unitPrice')}
                  </Text>
                  {/* <Text
                    w="136px"
                    textAlign="center"
                    fontSize="12px"
                    fontFamily="TTHoves-Regular, TTHoves"
                    fontWeight="400"
                    color="#999999"
                    lineHeight="20px"
                  >
                    {t('Detail.quantity')}
                  </Text> */}
                  <Text
                    w="30%"
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
                    w="30%"
                    textAlign="center"
                    fontSize="12px"
                    fontFamily="TTHoves-Regular, TTHoves"
                    fontWeight="400"
                    color="#999999"
                    lineHeight="20px"
                  >
                    {t('Detail.to')}
                  </Text>
                  {/* <Text
                    w="136px"
                    textAlign="right"
                    fontSize="12px"
                    fontFamily="TTHoves-Regular, TTHoves"
                    fontWeight="400"
                    color="#999999"
                    lineHeight="20px"
                  >
                    {t('Detail.date')}
                  </Text> */}

                </Flex>
                <InfiniteScroll
                  dataLength={eventDate?.pages?.length * DEFAULT_PAGE_LIMIT}
                  next={fetchNextPageEventDate}
                  hasMore={eventDate?.pages[Number(eventDate?.pages?.length) - 1]?.events?.length === 20}
                  loader={<h4>Loading...</h4>}
                  initialScrollY={1}
                  height="260px"
                >
                  {eventDate?.pages?.map((page) => page?.events?.map((item) => (
                    item.method === 'BurnnedToken'
                      || item.method === 'BurnRemovedBritishAuctionnedToken'
                      || item.method === 'UpdatedTokenRoyalty'
                      || item.method === 'UpdatedToken'
                      || item.method === 'TransferredToken'
                      ? null : (<Activity events={item} />)
                  )))}
                </InfiniteScroll>
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
        <Box p="20px 0">
          <Flex flexDirection="column" alignItems="flex-start" mb="20px">
            <TimeBy
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              setSelectedTimeValue={setSelectedTimeValue}
            />

            <Flex flexDirection="row" alignItems="flex-start" m="20px 0">
              <Flex mr="20px" textAlign="center" flexDirection="column" justifyContent="center">
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
                    {PriceHistory?.avgprice ? formatNum(priceStringDivUnit(PriceHistory?.avgprice)) : '0'}
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
                    {PriceHistory?.totalvolume || '0'}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          {PriceHistory?.priceList?.length
            ? (
              <PriceHistoryChart PriceDate={PriceHistory?.priceList} />)
            : (
              <NoData widths="100%" />
            )}
        </Box>
      ) : null}
    </Flex>

  );
});
export default DetailRight;
