/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-mixed-operators */
import React, { FC, useState, useEffect } from 'react';
import Countdown, { zeroPad } from 'react-countdown';
import Identicon from '@polkadot/react-identicon';
import {
  HTMLChakraProps,
  Box,
  Flex,
  Text,
  Link,
  Image,
} from '@chakra-ui/react';
import { Shimmer } from 'react-shimmer';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PINATA_SERVER } from '../../constants';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { renderNmtNumberText } from '../Balance';
import { priceStringDivUnit, currentPrice } from '../../utils/format';
// eslint-disable-next-line import/no-unresolved

import {
  IconTime,
  HeadPortrait,
  play,
} from '../../assets/images';
import MotionBox from '../MotionBox';

type NftCardProps = {
  nft: Order,
  remainingTime:number,
} & HTMLChakraProps<'div'>

const NftCard: FC<NftCardProps> = ({
  nft,
  remainingTime,
}) => {
  const pictureType = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
  const videoType = ['mp4', 'webm'];
  const audioType = ['mp3', 'wav', 'ogg'];
  const { t } = useTranslation();
  const type = nft?.auction?.type;
  const [events, setEvents] = useState(
    {
      times: 0,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
    },
  );

  const formatAddress = (addr: string) => (addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : null);
  const countFun = (index:number) => {
    const times = (Number(index) - Number(remainingTime)) * 6 * 1000;
    // eslint-disable-next-line no-param-reassign
    const day = (Math.floor((times / 1000 / 3600 / 24)));
    const hour = (Math.floor((times / 1000 / 3600) % 24));
    const minute = (Math.floor((times / 1000 / 60) % 60));
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
    if (type && remainingTime) {
      countFun(nft?.auction?.deadline);
    }
  }, [remainingTime, nft?.auction?.deadline]);
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
    <Flex w="136px" align="flex-start" alignItems="center" position="relative">
      <Box
        width="18px"
        height="22px"
        lineHeight="22px"
        background="#FFFFFF"
        borderRadius="1px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        mr="2px"
      >
        {front(Number(zeroPad(days * 24 + hours)) / 10) || 0}
      </Box>
      <Box
        width="18px"
        height="22px"
        lineHeight="22px"
        background="#FFFFFF"
        borderRadius="1px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        mr="3px"
      >
        {hinder(Number(zeroPad(days * 24 + hours)) / 10) || 0}
      </Box>
      <Box
        fontSize="12px"
        color="#FFFFFF"
      >
        :
      </Box>
      <Box
        ml="3px"
        width="18px"
        height="22px"
        lineHeight="22px"
        background="#FFFFFF"
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
        height="22px"
        lineHeight="22px"
        background="#FFFFFF"
        borderRadius="1px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        mr="3px"
      >
        {hinder(Number(zeroPad(minutes)) / 10) || 0}
      </Box>

      <Box
        fontSize="12px"
        color="#FFFFFF"
      >
        :
      </Box>
      <Box
        mr="2px"
        ml="3px"
        width="18px"
        height="22px"
        lineHeight="22px"
        background="#FFFFFF"
        borderRadius="1px"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {front(Number(zeroPad(seconds)) / 10) || 0}
      </Box>
      <Box
        width="18px"
        height="22px"
        lineHeight="22px"
        background="#FFFFFF"
        borderRadius="1px"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {hinder(Number(zeroPad(seconds)) / 10) || 0}
      </Box>
    </Flex>
  );
  const price = renderNmtNumberText(nft.price);
  const duchPrice = currentPrice(Number(nft?.auction?.max_price), Number(nft?.auction?.min_price), Number(nft?.auction?.deadline), remainingTime, Number(nft?.auction?.block_created));
  const fileType = nft?.metadata?.fileType;
  return (
    <Link
      key={nft?.metadata.name}
      width="24vw"
      maxWidth="320px"
      minWidth="250px"
      height="396px"
      as={RouterLink}
      to={`/items/${nft.id}-${encodeURIComponent(nft?.metadata.name)}`}
    >
      <MotionBox
        width="100%"
        maxWidth="320px"
        minWidth="250px"
        height="100%"
        backgroundColor="#fff"
        borderRadius="10px"
        cursor="pointer"
        marginTop="5px"
        _hover={{ boxShadow: 'lg' }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        display="flex"
        flexDirection="column"
      >

        {nft?.metadata
          && pictureType.indexOf(fileType) > -1
          ? (
            <LazyLoadImage
              wrapperProps={{
                style: {
                  width: '100%',
                  maxWidth: '320px',
                  minWidth: '250px',
                  height: '219px',
                  display: 'flex',
                  justifyContent: 'center',
                },
              }}
              style={{
                objectFit: 'cover',
                width: '100%',
                maxWidth: '320px',
                minWidth: '250px',
                height: '100%',
                borderRadius: '10px 10px 0 0 ',
              }}
              src={nft?.metadata?.fileType === 'gif' ? `${PINATA_SERVER}nft/${nft?.metadata?.logoUrl}` : `${PINATA_SERVER}nft/${nft?.metadata?.logoUrl}!list`}
              effect="blur"
              // fallback={<Shimmer height={219} width="100%" />}
            />
          )
          : (
            nft?.metadata?.previewUrl
              ? videoType.indexOf(fileType) > -1
                ? (
                  <Box
                    width="100%"
                    height="219px"
                    maxWidth="420px"
                    position="relative"
                  >
                    <Image
                      position="absolute"
                      zIndex="3"
                      w="54px"
                      h="auto"
                      left="calc(50% - 27px)"
                      top="calc(50% - 27px)"
                      src={play.default}
                      borderRadius="50%"
                      background="rgba(43,51,63,.7)"
                    />
                    <LazyLoadImage
                      wrapperProps={{
                        style: {
                          width: '100%',
                          height: '219px',
                          display: 'flex',
                          justifyContent: 'center',
                        },
                      }}
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                        borderRadius: '10px 10px 0 0 ',
                      }}
                      src={`${PINATA_SERVER}nft/${nft?.metadata?.previewUrl}!list`}
                      effect="blur"
                    />
                  </Box>
                )
                : audioType.indexOf(fileType) > -1 ? (
                  <Box
                    width="100%"
                    height="219px"
                    maxWidth="420px"
                    position="relative"
                  >
                    <Image
                      position="absolute"
                      zIndex="3"
                      w="54px"
                      h="auto"
                      left="calc(50% - 27px)"
                      top="calc(50% - 27px)"
                      src={play.default}
                      borderRadius="50%"
                      background="rgba(43,51,63,.7)"
                    />
                    <LazyLoadImage
                      wrapperProps={{
                        style: {
                          width: '100%',
                          height: '219px',
                          display: 'flex',
                          justifyContent: 'center',
                        },
                      }}
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                        borderRadius: '10px 10px 0 0 ',
                      }}
                      src={`${PINATA_SERVER}nft/${nft?.metadata?.previewUrl}!list`}
                      effect="blur"
                    />
                  </Box>
                ) : (
                  <LazyLoadImage
                    wrapperProps={{
                      style: {
                        width: '100%',
                        height: '219px',
                        display: 'flex',
                        justifyContent: 'center',
                      },
                    }}
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%',
                      borderRadius: '10px 10px 0 0 ',
                    }}
                    src={`${PINATA_SERVER}nft/${nft?.metadata?.logoUrl}!list`}
                    effect="blur"
                  />
                ) : (
                  <LazyLoadImage
                    wrapperProps={{
                      style: {
                        width: '100%',
                        height: '219px',
                        display: 'flex',
                        justifyContent: 'center',
                      },
                    }}
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%',
                      borderRadius: '10px 10px 0 0 ',
                    }}
                    src={`${PINATA_SERVER}nft/${nft?.metadata?.logoUrl}!list`}
                    effect="blur"
                  />
              )
          )}
        <Box
          padding="0 20px"
          borderRadius="0 0 10px 10px"
          h="177px"
          display="flex"
          flexDirection="column"
          backgroundColor="#000000"
        >
          <Box
            mt="18px"
            display="flex"
            justifyContent="space-between"
            lineHeight="14px"
            fontSize="12px"
            color="#999999"
            fontFamily="TTHoves-Light, TTHoves"
          >
            <Box userSelect="none">{nft?.class?.name}</Box>
          </Box>
          <Box
            mt="3px"
            display="flex"
            justifyContent="space-between"
            fontWeight="500"
            color="#000000"
            fontSize="16px"
            lineHeight="18px"
            fontFamily="TTHoves-Medium, TTHoves"
          >
            <Box w="100%">
              {nft?.metadata && (
              <Text
                maxWidth="100%"
                color="#FFFFFF"
                align="center"
                fontSize="16px"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                textAlign="start"
              >
                {nft?.metadata.name}
              </Text>
              )}
            </Box>
          </Box>
          <Box
            mt="13px"
            display="flex"
            justifyContent="space-between"
          >
            {Number(nft?.auction?.price) || Number(nft?.price) ? (
              <Box textAlign="right" display="flex" justifyContent="center">
                <Flex flexDirection="column" alignItems="flex-start">
                  <Box
                    height="24px"
                    color="#FFFFFF"
                    fontWeight="500"
                    fontFamily="TTHoves-Medium, TTHoves"
                    lineHeight="24px"
                    fontSize="20px"
                  >
                    {type === 'Dutch' && !nft?.auction?.allow_british_auction ? (
                      renderNmtNumberText((Number(duchPrice) * 1000000000000).toString())
                    ) : null}
                    {type === 'Dutch' && nft?.auction?.allow_british_auction && nft?.auction?.bid_count === 0 ? (
                      renderNmtNumberText((Number(duchPrice) * 1000000000000).toString())
                    ) : null}
                    {type === 'Dutch' && nft?.auction?.allow_british_auction && nft?.auction?.bid_count > 0 ? (
                      renderNmtNumberText((Number(nft?.auction?.price)).toString())
                    ) : null}
                    {!type ? (
                      Number(nft?.price) ? price : ''
                    ) : null}
                    {type === 'British' ? (
                      renderNmtNumberText((Number(nft?.auction?.price)).toString())
                    ) : null}
                    {type && Number(nft?.auction?.price) ? 'NMT' : '' }
                    {!type && Number(nft?.price) ? 'NMT' : '' }
                  </Box>
                  {Number(nft?.auction?.price) || Number(nft?.price) ? (
                    <Box
                      mt="2px"
                      color="#999999"
                      fontWeight="300"
                      fontFamily="TTHoves-Light, TTHoves"
                      lineHeight="14px"
                      fontSize="12px"
                    >
                      {t('common.currentPrice')}
                    </Box>
                  ) : '' }
                </Flex>
              </Box>
            ) : (
              <Box textAlign="right" display="flex" justifyContent="center">
                <Flex flexDirection="column" alignItems="flex-start">
                  <Box
                    height="24px"
                    color="#FFFFFF"
                    fontWeight="500"
                    fontFamily="TTHoves-Medium, TTHoves"
                    lineHeight="24px"
                    fontSize="20px"
                  >
                    - NMT
                  </Box>
                  <Box
                    mt="2px"
                    color="#999999"
                    fontWeight="300"
                    fontFamily="TTHoves-Light, TTHoves"
                    lineHeight="14px"
                    fontSize="12px"
                  >
                    {t('common.currentPrice')}
                  </Box>
                </Flex>
              </Box>
            )}
          </Box>
          <Box
            mt="14px"
            display="flex"
            justifyContent="space-between"
            fontSize="14px"
            fontFamily="TTHoves-Regular, TTHoves"
            fontWeight="500"
            color="#FFFFFF"
            lineHeight="16px"
            borderTop="1px solid #999999"
            h="100%"
          >
            <Flex justifyContent="center" alignItems="center">
              {nft?.creator?.avatar ? (
                <Image
                  mr="4px"
                  w="auto"
                  h="26px"
                  borderRadius="50%"
                  border="1px solid #FFFFFF"
                  src={`${PINATA_SERVER}user/${nft?.creator.avatar}` || HeadPortrait.default}
                />
              ) : (
                <Identicon
                  className="userAvatar"
                  value={nft?.creator?.id}
                />
              )}
              <Text
                align="center"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                textAlign="start"
              >
                {nft?.creator?.name || formatAddress(nft?.creator?.id) }
              </Text>
            </Flex>
            {type && Number(events.day) > 2 ? (
              <Box textAlign="right" display="flex" justifyContent="center">
                <Flex align="flex-start" alignItems="center">
                  <Box w="16px" h="16px" src={IconTime.default} as="img" alt="" mr="4px" />
                  <Box color="#FFFFFF">
                    {events.day}
                    {' '}
                    {t('common.daysLeft')}
                  </Box>
                </Flex>
              </Box>
            ) : null}
            {type && Number(events.times) === 0 ? (
              <Box textAlign="right" display="flex" justifyContent="center">
                <Flex align="flex-start" alignItems="center">
                  <Box color="#999999" mr="6px">Last</Box>
                  <Box
                    fontSize="14px"
                    fontFamily="TTHoves-Regular, TTHoves"
                    fontWeight="400"
                    color="#FFFFFF"
                    lineHeight="16px"
                  >
                    {type === 'Dutch' ? renderNmtNumberText((Number(duchPrice) * 1000000000000).toString()) : renderNmtNumberText(nft?.auction?.price)}
                  </Box>
                  <Box color="#999999">NMT</Box>
                </Flex>
              </Box>
            ) : null}
            {type && Number(events.day) < 3 && Number(events.times) > 0 ? (
              <Box
                fontSize="12px"
                fontFamily="TTHoves-Medium, TTHoves"
                fontWeight="500"
                color="#000000"
                lineHeight="14px"
                textAlign="right"
                display="flex"
                justifyContent="center"
              >
                {Number(events.times)
                  ? (
                    <Countdown
                      autoStart
                      daysInHours
                      date={Date.now() + Number(events.times)}
                      renderer={renderer}
                    />
                  ) : null}
              </Box>
            ) : null}
          </Box>

        </Box>
      </MotionBox>
    </Link>

  );
};

export default NftCard;
