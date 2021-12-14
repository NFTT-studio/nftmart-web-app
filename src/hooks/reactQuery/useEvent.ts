/* eslint-disable comma-spacing */
import { useInfiniteQuery } from 'react-query';
import fetchEvent, { fetchPersonalEventParams } from '../../api/fetchEvent';
import { QUERY_KEYS } from '../../constants';

export default ({
  nftId, number,
}: fetchPersonalEventParams) => useInfiniteQuery(
  [QUERY_KEYS.Event, nftId, number],
  ({ pageParam = 0 }) => fetchEvent({
    nftId, number: 20, pageParam,
  }),
  {
    getNextPageParam: (lastPage, pages) => (pages.length),
  },
);
