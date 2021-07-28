import { useQuery } from 'react-query';
import fetchBanner from '../../api/fetchBanner';
import { QUERY_KEYS } from '../../constants';

export default () => useQuery(QUERY_KEYS.BANNER, () => fetchBanner());
