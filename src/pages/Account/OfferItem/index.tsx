/* eslint-disable no-return-assign */
import React, { FC, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Link,
  Flex,
  Image,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { renderNmtNumberText } from '../../../components/Balance';
import { getBlock } from '../../../polkaSDK/api/getBlock';

import {
  PINATA_SERVER,
} from '../../../constants';

interface Props {
  offers?: []
  hide: boolean
}
const OfferItem: FC<Props> = (({ offers, hide }) => {
  const formatAddress = (addr: string) => (addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : null);
  const { t } = useTranslation();

  const [remainingTime, setRemainingTime] = useState(0);
  getBlock().then((res) => {
    setRemainingTime(res);
  });

  const timeBlock = (index: numer) => {
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
    let result = null;
    // let result = `${parseInt(theTime.toString(), 10)}`;
    // if (middle > 0) {
    //   result = `${parseInt(middle.toString(), 10)}:${result}`;
    // }
    if (hour > 0) {
      // result = `${parseInt(hour.toString(), 10)}:${result}`;
      result = `${parseInt(hour.toString(), 10)}`;
    }
    return result;
  };
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
  const add0 = (m) => (m < 10 ? `0${m}` : m);
  function getDateDiff(dateTimeStamp: string) {
    let result;
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const now = new Date().getTime();
    const beOverdue = now + dateTimeStamp;
    const times = new Date(beOverdue);
    const idata = times.getTime();
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
  const timeSurplus = (index: numer) => {
    const times = (Number(index) - Number(remainingTime)) * 6 * 1000;
    return times;
  };

  return (
    <Link
      as={RouterLink}
      to={`/items/${offers?.nft_id}-${offers?.nft?.name}`}

    >
      <Flex
        key={offers?.nft_id}
        p="0 20px"
        width="100%"
        height="81px"
        flexFlow="row"
        justifyContent="space-between"
        alignItems="center"
        borderBottom="1px solid #E5E5E5"
        _hover={{
          background: '#F9F9F9',
        }}
      >
        <Flex
          flexDirection="row"
          justifyContent="flex-start"
          width="224px"
          textAlign="left"
          fontSize="12px"
          fontFamily="TTHoves-Regular, TTHoves"
          fontWeight="400"
          color="#000000"
          lineHeight="20px"
        >
          <Image
            mr="10px"
            width="auto"
            height="40px"
            borderRadius="4px"
            src={`${PINATA_SERVER}nft/${offers?.nft?.previewUrl || offers?.nft?.logoUrl}`}
            alt=""
          />
          <Flex
            flexDirection="column"
            textAlign="left"
            fontSize="12px"
            fontFamily="TTHoves-Regular, TTHoves"
            fontWeight="400"
            color="#999999"
            lineHeight="14px"
            minWidth="100px"
          >
            <Text
              mb="5px"
              minWidth="60px"
              fontSize="14px"
              fontFamily="TTHoves-Regular, TTHoves"
              fontWeight="400"
              color="#000000"
              lineHeight="20px"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {offers?.nft?.name}
            </Text>
            <Text
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {offers?.nft?.name}
            </Text>
          </Flex>
        </Flex>
        <Text
          minWidth="80px"
          display="flex"
          flexDirection="row"
          justifyContent="center"
          fontSize="12px"
          fontFamily="TTHoves-Regular, TTHoves"
          fontWeight="400"
          color="#000000"
          lineHeight="20px"
        >
          {Number(offers?.price) ? renderNmtNumberText(offers?.price) : renderNmtNumberText(offers?.auction?.price)}
          <Text
            ml="3px"
            fontSize="14px"
            fontFamily="TTHoves-Regular, TTHoves"
            fontWeight="400"
            color="#999999"
            lineHeight="20px"
          >
            NMT
          </Text>
        </Text>
        <Text
          width="60px"
          fontSize="14px"
          fontFamily="TTHoves-Regular, TTHoves"
          fontWeight="400"
          color="#000000"
          lineHeight="20px"
        >
          1
        </Text>
        {hide ? (
          <Text
            minWidth="60px"
            fontSize="14px"
            fontFamily="TTHoves-Regular, TTHoves"
            fontWeight="400"
            color="#000000"
            lineHeight="20px"
          >
            {offers?.user?.name ? offers?.user?.name : formatAddress(offers?.user?.id)}
          </Text>
        ) : ''}
        {offers?.deadline
          ? (
            <Text
              width="120px"
              textAlign="right"
              fontSize="14px"
              fontFamily="TTHoves-Regular, TTHoves"
              fontWeight="400"
              color="#000000"
              lineHeight="20px"
              textstroke="1px #979797"
            >
              {' '}
              {Number(offers?.deadline - remainingTime) > 0
                ? getDateIn(Number(timeSurplus(offers?.deadline)))
                : null}
              {Number(offers?.deadline - remainingTime) < 0
                ? getDateDiff(Number(timeSurplus(offers?.deadline)))
                : null}
              {/* {offers?.deadline - remainingTime > 0 ? timeBlock(offers?.deadline) : null} */}
              {' '}
            </Text>
          ) : ''}
      </Flex>
    </Link>
  );
});
export default OfferItem;
