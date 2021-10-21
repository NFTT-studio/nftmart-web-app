import { useQuery } from 'react-query';
import getUser from '../../api/getUser';
import { QUERY_KEYS } from '../../constants';

export default (adress: string | undefined) => useQuery(
  QUERY_KEYS.USERTop, () => getUser(adress),
);
