/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-mixed-operators */
import React, { FC, useState, useEffect } from 'react';
import Countdown from 'react-countdown';
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
import { IPFS_URL } from '../../constants';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { renderNmtNumberText } from '../Balance';

import {
  IconTime,
  HeadPortrait,
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
    if (nft?.type && remainingTime) {
      countFun(nft.deadline);
    }
  }, [remainingTime]);

  const price = renderNmtNumberText(nft.price);
  return (
    <Link
      key={nft?.metadata.name}
      width="320px"
      height="354px"
      as={RouterLink}
      to={`/item/${nft.nft.nft_id}`}
    >
      <MotionBox
        width="320px"
        height="100%"
        backgroundColor="#fff"
        borderRadius="4px"
        cursor="pointer"
        marginTop="5px"
        _hover={{ boxShadow: 'lg' }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        display="flex"
        flexDirection="column"
      >

        {nft?.metadata && (
        <LazyLoadImage
          wrapperProps={{
            style: {
              width: '320px',
              height: '210px',
              display: 'flex',
              justifyContent: 'center',
            },
          }}
          style={{
            objectFit: 'cover',
            width: '100%',
            maxHeight: '100%',
            borderRadius: '4px 4px 0 0 ',
          }}
          src={IPFS_URL + nft?.metadata.logoUrl}
          effect="blur"
          fallback={<Shimmer height={210} width={320} />}
        />
        )}
        <Box borderRadius="0 0 4px 4px" h="100%" display="flex" flexDirection="column" backgroundColor="#000000">
          <Box
            mt="16px"
            display="flex"
            justifyContent="space-between"
            p="0 16px"
            height="17px"
            lineHeight="17px"
            fontSize="12px"
            color="#FFFFFF"
          >
            <Box userSelect="none">{nft?.class.name}</Box>
          </Box>
          <Box
            mt="8px"
            display="flex"
            justifyContent="space-between"
            padding="0 16px 8px 16px"
            paddingBottom=""
            fontWeight="600"
            color="#000000"
          >
            <Box pr={2}>
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
            display="flex"
            justifyContent="space-between"
            padding="0 16px 0px 16px"
            paddingBottom=""
            fontWeight="600"
            color="#000000"
          >
            {nft?.price && (
            <Box textAlign="right" display="flex" justifyContent="center">
              <Flex align="flex-start" alignItems="center">
                <Box color="#FFFFFF">{price}</Box>
                <Text
                  color="#FFFFFF"
                >
                  NMT
                </Text>
              </Flex>
            </Box>
            )}
          </Box>
          <Box
            mt="0px"
            display="flex"
            justifyContent="space-between"
            m="0 16px"
            fontSize="12px"
            fontFamily="TTHoves-Regular, TTHoves"
            fontWeight="400"
            color="#FFFFFF"
            lineHeight="14px"
            borderTop="1px solid #999999"
            h="100%"
          >
            <Flex justifyContent="center" alignItems="center">
              <Image pr="4px" w="22px" h="22px" src={HeadPortrait.default} />
              <Text
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
            </Flex>
            {nft?.type && Number(events.day) > 0 ? (
              <Box textAlign="right" display="flex" justifyContent="center">
                <Flex align="flex-start" alignItems="center">
                  <Box w="16px" h="16px" src={IconTime.default} as="img" alt="" mr="4px" />
                  <Box color="#FFFFFF">
                    {events.day}
                    {' '}
                    days left
                  </Box>
                </Flex>
              </Box>
            ) : null}
            {nft?.type && Number(events.times) === 0 ? (
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
                    {price}
                  </Box>
                  <Box color="#999999">NMT</Box>
                </Flex>
              </Box>
            ) : null}
            {nft?.type && Number(events.day) < 1 && Number(events.times) > 0 ? (
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
                <Flex align="flex-start" alignItems="center" position="relative">
                  <Flex
                    position="absolute"
                    top="17px"
                    right="105px"
                    width="18px"
                    fontSize="15px"
                    letterSpacing="8px"
                  >
                    <Countdown
                      autoStart
                      daysInHours
                      date={Date.now() + Number(events.times)}
                    />
                  </Flex>
                  <Box
                    width="18px"
                    height="22px"
                    background="#FFFFFF"
                    borderRadius="1px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mr="1px"
                  />
                  <Box
                    width="18px"
                    height="22px"
                    background="#FFFFFF"
                    borderRadius="1px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mr="3px"
                  />

                  <Box
                    fontSize="12px"
                    color="#FFFFFF"
                    position="relative"
                    zIndex={9}
                  >
                    :
                  </Box>
                  <Box
                    ml="3px"
                    width="18px"
                    height="22px"
                    background="#FFFFFF"
                    borderRadius="1px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mr="1px"
                  />
                  <Box
                    width="18px"
                    height="22px"
                    background="#FFFFFF"
                    borderRadius="1px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mr="3px"
                  />

                  <Box
                    fontSize="12px"
                    color="#FFFFFF"
                    position="relative"
                    zIndex={9}
                  >
                    :
                  </Box>
                  <Box
                    mr="1px"
                    ml="3px"
                    width="18px"
                    height="22px"
                    background="#FFFFFF"
                    borderRadius="1px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  />
                  <Box
                    width="18px"
                    height="22px"
                    background="#FFFFFF"
                    borderRadius="1px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  />
                </Flex>

              </Box>
            ) : null}
          </Box>

        </Box>
      </MotionBox>
    </Link>

  );
};

export default NftCard;
