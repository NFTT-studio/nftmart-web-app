import { useQuery } from 'react-query';
import fetchCollectionsSinger from '../../api/fetchCollectionsSinger';
import { QUERY_KEYS } from '../../constants';

export default (collectionId: string) => useQuery(
  QUERY_KEYS.CATEGORIEINFO, () => fetchCollectionsSinger(collectionId),
);
