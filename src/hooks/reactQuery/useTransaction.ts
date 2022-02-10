/* eslint-disable comma-spacing */
import { useInfiniteQuery } from 'react-query';
import fetchEvent, { fetchPersonalEventParams } from '../../api/fetchTransaction';
import { QUERY_KEYS } from '../../constants';

export default ({
  address, number,
}: fetchPersonalEventParams) => useInfiniteQuery(
  [QUERY_KEYS.Transaction, address, number],
  ({ pageParam = 0 }) => fetchEvent({
    address, number: 20, pageParam,
  }),
  {
    getNextPageParam: (lastPage, pages) => (pages.length),
    enabled: false,
  },
);
