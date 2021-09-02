import { useQuery, useInfiniteQuery } from 'react-query';
import fetchNfts, { FetchNftParams } from '../../api/fetchNfts';
import { QUERY_KEYS } from '../../constants';

const hot = 'most_stared';
const expensive = 'expensive';
const cheap = 'cheapest';

export default ({
  sortBy, categoryId, collectionId, status, address, number, buyerId, sellerId,
}: FetchNftParams) => useInfiniteQuery(
  [QUERY_KEYS.NFTS, sortBy, categoryId, collectionId, status, buyerId, sellerId],
  ({ pageParam = 0 }) => fetchNfts({
    sortBy, categoryId, collectionId, status, address, buyerId, sellerId, number, pageParam,
  }),
  {
    getNextPageParam: (lastPage, pages) => (pages.length + 1),
  },
);

export const useHotNfts = (number: number, pageParam:number, categoryId?: string) => useQuery(
  [QUERY_KEYS.hotNFTS, hot, categoryId], () => fetchNfts({
    sortBy: hot,
    categoryId,
    number,
    pageParam,
  }),
);

export const useExpensiveNfts = (number: number, pageParam:number, categoryId?: string) => useQuery(
  [QUERY_KEYS.NFTS, expensive, categoryId], () => fetchNfts({
    sortBy: expensive,
    categoryId,
    number,
    pageParam,
  }),
);

export const useCheapNfts = (number: number, pageParam:number, categoryId?: string) => useQuery(
  [QUERY_KEYS.NFTS, cheap, categoryId], () => fetchNfts({
    sortBy: cheap,
    categoryId,
    number,
    pageParam,
  }),
);
