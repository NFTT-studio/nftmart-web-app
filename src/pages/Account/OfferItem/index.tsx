import React, { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Link,
  Flex,
  Image,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { renderNmtNumberText } from '../../../components/Balance';

import {
  PINATA_SERVER,
} from '../../../constants';

interface Props {
  offer?: []
}
const OfferItem: FC<Props> = (({ offer }) => {
  const formatAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  const { t } = useTranslation();

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
          {offer?.deadline}
        </Text>
      </Flex>
    </Link>
  );
});
export default OfferItem;
