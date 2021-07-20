import { useQuery } from 'react-query';
import fetchOrder from '../../api/fetchOrder';
import { QUERY_KEYS } from '../../constants';

export default (id: string) => useQuery(
  QUERY_KEYS.NFT, () => fetchOrder(id),
);
