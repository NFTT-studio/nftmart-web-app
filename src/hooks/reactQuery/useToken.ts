import { useQuery } from 'react-query';
import fetchToken from '../../api/fetchToken';
import { QUERY_KEYS } from '../../constants';

export default () => useQuery(QUERY_KEYS.BANNER, () => fetchToken());
