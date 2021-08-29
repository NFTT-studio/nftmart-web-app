import { useInfiniteQuery } from 'react-query';
import fetchNftCollect, { fetchNftCollectParams } from '../../api/fetchNftCollect';
import { QUERY_KEYS } from '../../constants';

export default ({
  ownerId, sortBy, categoryId, collectionId, status, classId, collecterId,
}: fetchNftCollectParams) => useInfiniteQuery(
  [QUERY_KEYS.NFTSCollect, ownerId, collecterId, sortBy, categoryId, collectionId, status, classId],
  () => fetchNftCollect({
    ownerId, sortBy, categoryId, collectionId, status, classId, collecterId,
  }),
  {
    getNextPageParam: (lastPage, pages) => (pages.length + 1),
  },
);
