import React, { FC } from 'react';
import {
  Flex,
  Text,
  Link,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
  events: [],
}
const Events: FC<Props> = (({
  events,
}) => {
  const formatAddress = (addr: string) => (addr ? `${addr?.slice(0, 4)}...${addr?.slice(-4)}` : '');
  const date = JSON.parse(events?.event?.data);
  const { t } = useTranslation();
  return (
    <Flex
      key={events?.id}
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
        {events?.method === 'MintedToken' ? 'Created' : ''}
        {events?.method === 'TransferredToken' ? 'Sales' : ''}
        {events?.method === 'CreatedBritishAuction' ? 'Listings' : ''}
        {events?.method === 'CreatedDutchAuction' ? 'Listings' : ''}
        {events?.method === 'BidDutchAuction' ? 'Bids' : ''}
        {events?.method === 'BidBritishAuction' ? 'Bids' : ''}
        {events?.method === 'RedeemedBritishAuction' ? 'Sales' : ''}
        {events?.method === 'RedeemedDutchAuction' ? 'Sales' : ''}
        {events?.method === 'CreatedOrder' ? 'Listings' : ''}
        {events?.method === 'CreatedOffer' ? 'Bids' : ''}
        {events?.method === 'TakenOffer' ? 'Sales' : ''}
        {events?.method === 'TakenOrder' ? 'Sales' : ''}
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
        0
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
        {events?.quantity}
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
        <Link
          display="inline-block"
          as={RouterLink}
          to={`/account/${date[0]}/wallet`}
          onClick={() => {
            localStorage.setItem('ButtonSelect', '0');
          }}
        >
          {date[0] ? formatAddress(date[0]) : ''}
        </Link>
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
        <Link
          display="inline-block"
          as={RouterLink}
          to={`/account/${date[1]}/wallet`}
          onClick={() => {
            localStorage.setItem('ButtonSelect', '0');
          }}
        >
          {date[1] ? formatAddress(date[0]) : ''}
        </Link>
      </Text>
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
  );
});
export default Events;
