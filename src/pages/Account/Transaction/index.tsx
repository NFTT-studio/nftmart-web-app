/* eslint-disable no-return-assign */
import React, { FC, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Link,
  Flex,
  Image,
  Text,
  Box,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { renderNmtNumberText } from '../../../components/Balance';
import { getBlock } from '../../../polkaSDK/api/getBlock';

import {
  PINATA_SERVER,
} from '../../../constants';

interface Props {
  offers?: []
}
const Transaction: FC<Props> = (({ offers }) => {
  const formatAddress = (addr: string) => (addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : null);
  const { t } = useTranslation();

  const [remainingTime, setRemainingTime] = useState(0);
  getBlock().then((res) => {
    setRemainingTime(res);
  });
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

  return (
    <Link
      as={RouterLink}
      to={`/items/${offers?.nft_id}-${offers?.detail?.metadata?.name}`}
      key={offers?.nft_id}
    >
      <Flex
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
            src={`${PINATA_SERVER}nft/${offers?.detail?.metadata?.previewUrl || offers?.detail?.metadata?.logoUrl}`}
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
              {offers?.detail?.metadata?.name}
            </Text>
            <Text
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {offers?.detail?.class?.metadata?.name}
            </Text>
          </Flex>
        </Flex>
        <Text
          width="62px"
          fontSize="12px"
          fontFamily="PingFangSC-Regular, PingFang SC"
          fontWeight="400"
          color="#000000"
          lineHeight="20px"
        >
          {offers?.direction}
        </Text>
        <Text
          width="70px"
          fontSize="12px"
          fontFamily="PingFangSC-Regular, PingFang SC"
          fontWeight="400"
          color="#000000"
          lineHeight="20px"
        >
          1
        </Text>
        <Box
          minWidth="120px"
          display="flex"
          flexDirection="row"
          justifyContent="center"
          fontSize="12px"
          fontFamily="PingFangSC-Regular, PingFang SC"
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
        </Box>
        <Text
          width="100px"
          fontSize="14px"
          fontFamily="TTHoves-Regular, TTHoves"
          fontWeight="400"
          color="#000000"
          lineHeight="20px"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {offers?.counterparty?.name || formatAddress(offers?.counterparty?.id)}
          {/* {offers?.direction === 'buy' ? formatAddress(offers?.from_id) : formatAddress(offers?.to_id)} */}
        </Text>
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
          {format(offers?.timestamp)}
        </Text>
      </Flex>
    </Link>
  );
});
export default Transaction;
