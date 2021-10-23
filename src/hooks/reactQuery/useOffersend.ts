/* eslint-disable comma-spacing */
import { useInfiniteQuery } from 'react-query';
import fetchOffer, { fetchPersonalOfferParams } from '../../api/fetchOffer';
import { QUERY_KEYS } from '../../constants';

export default ({
  addressId, number,type,
}: fetchPersonalOfferParams) => useInfiniteQuery(
  [QUERY_KEYS.OfferSend, addressId, number],
  ({ pageParam = 0 }) => fetchOffer({
    addressId, number, pageParam,type,
  }),
  {
    getNextPageParam: (lastPage, pages) => (pages.length + 1),
  },
);
