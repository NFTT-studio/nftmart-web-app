import { useQuery } from 'react-query';
import fetchCollections, { FetchCollectionsParams } from '../../api/fetchCollections';
import { QUERY_KEYS } from '../../constants';

export default ({ address }: FetchCollectionsParams) => useQuery(QUERY_KEYS.COLLECTIONS,
  () => fetchCollections({ address }));
