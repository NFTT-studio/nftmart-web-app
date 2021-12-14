import { useQuery, useInfiniteQuery } from 'react-query';
import fetchHistoryprice, { fetchHistorypriceParams } from '../../api/fetchHistoryprice';
import { QUERY_KEYS } from '../../constants';

export default ({
  id, timePeriod,
}: fetchHistorypriceParams) => useInfiniteQuery(
  [QUERY_KEYS.Historyprice, id, timePeriod],
  () => fetchHistoryprice({
    id, timePeriod,
  }),
);
