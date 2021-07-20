import { useQuery } from 'react-query';
import fetchNfts, { FetchNftParams } from '../../api/fetchNfts';
import { QUERY_KEYS } from '../../constants';

const hot = 'most_stared';
const expensive = 'expensive';
const cheap = 'cheapest';

export default ({
  sortBy, categoryId, collectionId, status, address, limit,
}: FetchNftParams) => useQuery(
  [QUERY_KEYS.NFTS, sortBy, categoryId, collectionId, status],
  () => fetchNfts({
    sortBy, categoryId, collectionId, status, address, limit,
  }),
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
