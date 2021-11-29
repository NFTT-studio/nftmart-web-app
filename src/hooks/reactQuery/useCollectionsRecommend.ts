import { useInfiniteQuery } from 'react-query';
import fetchCollectRecommend, { FetchCollectionsParams } from '../../api/fetchCollectRecommend';
import { QUERY_KEYS } from '../../constants';

export default ({
  limit,
}: FetchCollectionsParams) => useInfiniteQuery(
  [QUERY_KEYS.Event],
  ({ pageParam = 0 }) => fetchCollectRecommend({
    limit, pageParam: pageParam * limit,
  }),
  {
    getNextPageParam: (lastPage, pages) => (pages.length),
    enabled: false,
  },
);
