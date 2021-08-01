import { useInfiniteQuery } from 'react-query';
import fetchPersonalNfts, { fetchPersonalNftsParams } from '../../api/fetchPersonalNfts';
import { QUERY_KEYS } from '../../constants';

export default ({
  ownerId, sortBy, categoryId, collectionId, status, classId, creatorId,
}: fetchPersonalNftsParams) => useInfiniteQuery(
  [QUERY_KEYS.NFTS, ownerId, creatorId, sortBy, categoryId, collectionId, status, classId],
  () => fetchPersonalNfts({
    ownerId, sortBy, categoryId, collectionId, status, classId, creatorId,
  }),
  {
    getNextPageParam: (lastPage, pages) => (pages.length + 1),
  },
);
