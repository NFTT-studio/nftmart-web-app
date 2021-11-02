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
}
const OfferItem: FC<Props> = (({ offers }) => {
  const formatAddress = (addr: string) => (addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : null);
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
      to={`/item/${offers?.nft_id}`}

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
              {offers?.nft?.name}
            </Text>
            <Text>
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
        <Text
          minWidth="60px"
          fontSize="14px"
          fontFamily="TTHoves-Regular, TTHoves"
          fontWeight="400"
          color="#000000"
          lineHeight="20px"
        >
          {offers?.user?.name ? offers?.user?.name : formatAddress(offers?.user?.id) }
        </Text>
        {offers?.deadline - remainingTime > 0 || offers?.deadline - remainingTime > 0
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
              in
              {' '}
              {offers?.deadline - remainingTime > 0 ? timeBlock(offers?.deadline) : null}
              {offers?.auction?.deadline - remainingTime > 0 ? timeBlock(offers?.auction?.deadline) : null}
              {' '}
              hours
            </Text>
          ) : (
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
              -
            </Text>
          )}
      </Flex>
    </Link>
  );
});
export default OfferItem;
