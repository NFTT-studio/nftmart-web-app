import { useQuery } from 'react-query';
import getArtist from '../../api/getArtist';
import { QUERY_KEYS } from '../../constants';

export default () => useQuery(
  QUERY_KEYS.Artist, () => getArtist(),
);
