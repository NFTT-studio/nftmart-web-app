import { useQuery } from 'react-query';
import { QUERY_KEYS } from '../../constants';
import { getWhiteList } from '../../polkaSDK/api/getWhiteList';

export default () => useQuery(
  QUERY_KEYS.WHITELIST, () => getWhiteList(),
);
