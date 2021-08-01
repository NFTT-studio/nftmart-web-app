import { useQuery, useInfiniteQuery } from 'react-query';
import fetchNfts, { FetchNftParams } from '../../api/fetchNfts';
import { QUERY_KEYS } from '../../constants';

const hot = 'most_stared';
const expensive = 'expensive';
const cheap = 'cheapest';

export default ({
  sortBy, categoryId, collectionId, status, address, number,
}: FetchNftParams) => useInfiniteQuery(
  [QUERY_KEYS.NFTS, sortBy, categoryId, collectionId, status],
  ({ pageParam = 0 }) => fetchNfts({
    sortBy, categoryId, collectionId, status, address, number, pageParam,
  }),
  {
    getNextPageParam: (lastPage, pages) => (pages.length + 1),
  },
);

export const useHotNfts = (categoryId?: string) => useQuery(
  [QUERY_KEYS.NFTS, hot, categoryId], () => fetchNfts({ sortBy: hot, categoryId }),
);

export const useExpensiveNfts = (categoryId?: string) => useQuery(
  [QUERY_KEYS.NFTS, expensive, categoryId], () => fetchNfts({ sortBy: expensive, categoryId }),
);

export const useCheapNfts = (categoryId?: string) => useQuery(
  [QUERY_KEYS.NFTS, cheap, categoryId], () => fetchNfts({ sortBy: cheap, categoryId }),
);
