import { useQuery } from 'react-query';
import fetchNft from '../../api/fetchNft';
import { QUERY_KEYS } from '../../constants';

export default (id: string) => useQuery(
  QUERY_KEYS.NFT, () => fetchNft(id),
);
