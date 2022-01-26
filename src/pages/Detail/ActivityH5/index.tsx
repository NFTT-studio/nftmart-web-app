import React, { FC } from 'react';
import {
  Flex,
  Text,
  Link,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { isString } from 'lodash';
import { priceStringDivUnit, formatNum } from '../../../utils/format';

interface Props {
  events: [],
}
const Events: FC<Props> = (({
  events,
}) => {
  const add0 = (m) => (m < 10 ? `0${m}` : m);
  const format = (time: string) => {
    const times = new Date(time);
    const y = times.getFullYear();
    const m = times.getMonth() + 1;
    const d = times.getDate();
    const h = times.getHours();
    const mm = times.getMinutes();
    const s = times.getSeconds();
    return `${y}/${add0(m)}/${add0(d)} ${add0(h)}:${add0(mm)}:${add0(s)}`;
  };
  const formatAddress = (addr: string) => (isString(addr) ? `${addr?.slice(0, 4)}...${addr?.slice(-4)}` : '');
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
        w="18%"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        textAlign="left"
        fontSize="14px"
        fontFamily="TTHoves-Regular, TTHoves"
        fontWeight="400"
        color="#000000"
        lineHeight="20px"
      >
        {events?.method === 'MintedToken' ? t('common.Minted') : ''}
        {events?.method === 'TransferredToken' ? t('common.Transfer') : ''}
        {events?.method === 'CreatedBritishAuction' ? t('common.List') : ''}
        {events?.method === 'CreatedDutchAuction' ? t('common.List') : ''}
        {events?.method === 'BidDutchAuction' ? t('common.BidOffer') : ''}
        {events?.method === 'BidBritishAuction' ? t('common.BidOffer') : ''}
        {events?.method === 'RedeemedBritishAuction' ? t('common.Sale') : ''}
        {events?.method === 'RedeemedDutchAuction' ? t('common.Sale') : ''}
        {events?.method === 'CreatedOrder' ? t('common.List') : ''}
        {events?.method === 'CreatedOffer' ? t('common.Offer') : ''}
        {events?.method === 'TakenOffer' ? t('common.Sale') : ''}
        {events?.method === 'TakenOrder' ? t('common.Sale') : ''}
        {events?.method === 'RemovedDutchAuction' ? t('common.Cancel') : ''}
        {events?.method === 'RemovedOrder' ? t('common.Cancel') : ''}
        {events?.method === 'RemovedOffer' ? t('common.CancelOffer') : ''}
        {events?.method === 'RemovedBritishAuction' ? t('common.Cancel') : ''}
        {events?.method === 'BurnnedToken' ? t('common.Burn') : ''}
      </Text>
      <Text
        w="22%"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        fontSize="14px"
        fontFamily="TTHoves-Regular, TTHoves"
        fontWeight="400"
        color="#000000"
        lineHeight="20px"
      >
        {Number(events?.price) > 0 ? formatNum(priceStringDivUnit(events?.price)) : null}
        {/* <Text
          ml="3px"
          color="#999999"
        >
          {Number(events?.price) > 0 ? 'NMT' : null}
        </Text> */}
      </Text>
      {/* <Text
        w="136px"
        textAlign="center"
        fontSize="14px"
        fontFamily="TTHoves-Regular, TTHoves"
        fontWeight="400"
        color="#000000"
        lineHeight="20px"
      >
        {events?.quantity}
      </Text> */}
      <Text
        w="30%"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
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
          to={`/account/${events?.from_id}/owned`}
          onClick={() => {
            localStorage.setItem('ButtonSelect', '0');
          }}
        >
          {events?.from?.name ? events?.from?.name : formatAddress(events?.from_id)}
        </Link>
      </Text>
      <Text
        w="30%"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        textAlign="center"
        fontSize="14px"
        fontFamily="TTHoves-Regular, TTHoves"
        fontWeight="400"
        color="#3D00FF"
        lineHeight="20px"
      >

        {events?.to_id
          ? (
            <Link
              display="inline-block"
              as={RouterLink}
              to={`/account/${events?.to_id}/owned`}
            >
              {events?.to?.name ? events?.to?.name : formatAddress(events?.to_id)}
            </Link>
          )
          : ''}
      </Text>
      {/* <Text
        w="20%"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        textAlign="right"
        fontSize="14px"
        fontFamily="TTHoves-Regular, TTHoves"
        fontWeight="400"
        color="#000000"
        lineHeight="20px"
      >
        {format(events?.timestamp)}
      </Text> */}
    </Flex>
  );
});
export default Events;
