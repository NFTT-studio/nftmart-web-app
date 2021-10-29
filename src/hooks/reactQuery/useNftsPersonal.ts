/* eslint-disable comma-spacing */
import { useInfiniteQuery } from 'react-query';
import fetchPersonalNfts, { fetchPersonalNftsParams } from '../../api/fetchPersonalNfts';
import { QUERY_KEYS } from '../../constants';

export default ({
  ownerId,collecterId, sortBy, categoryId, collectionId, status, classId, creatorId, number,
}: fetchPersonalNftsParams) => useInfiniteQuery(
  [QUERY_KEYS.NFTS, ownerId,collecterId, creatorId, sortBy, categoryId, collectionId, status, classId, number],
  ({ pageParam = 0 }) => fetchPersonalNfts({
    ownerId,collecterId, sortBy, categoryId, collectionId, status, classId, creatorId, number, pageParam,
  }),
  {
    getNextPageParam: (lastPage, pages) => (pages.length),
  },
);
