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
  offer?: []
}
const OfferItem: FC<Props> = (({ offer }) => {
  const formatAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  const { t } = useTranslation();

  const [remainingTime, setRemainingTime] = useState(0);
  getBlock().then((res) => {
    setRemainingTime(res);
  });

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

  return (
    <Link
      as={RouterLink}
      to={`/item/${offer?.nft?.nft_id}`}

    >
      <Flex
        key={offer?.id}
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
            src={`${PINATA_SERVER}${offer.metadata.logoUrl}`}
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
          >
            <Text
              mb="5px"
              minWidth="60px"
              fontSize="14px"
              fontFamily="TTHoves-Regular, TTHoves"
              fontWeight="400"
              color="#000000"
              lineHeight="20px"
            >
              {offer?.class.name}
            </Text>
            <Text>
              {offer?.metadata.name}
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
          {renderNmtNumberText(offer?.price)}
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
        <Text
          minWidth="60px"
          fontSize="14px"
          fontFamily="TTHoves-Regular, TTHoves"
          fontWeight="400"
          color="#000000"
          lineHeight="20px"
        >
          {formatAddress(offer?.buyer_id)}
        </Text>
        <Text
          width="120px"
          textAlign="right"
          fontSize="14px"
          fontFamily="TTHoves-Regular, TTHoves"
          fontWeight="400"
          color="#000000"
          lineHeight="20px"
          textStroke="1px #979797"
        >
          in
          {' '}
          {timeBlock(offer?.deadline)}
          {' '}
          hours
        </Text>
      </Flex>
    </Link>
  );
});
export default OfferItem;
