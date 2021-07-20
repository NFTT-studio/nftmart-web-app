import { useQuery } from 'react-query';
import { COLLECTIONS_QUERY } from '../../constants/QueryKeys';
import { getClasses } from '../../polkaSDK/api/getClasses';
import { Collection } from '../../polkaSDK/types';

export const useCollectionsQuery = () => useQuery<Collection[]>(COLLECTIONS_QUERY, getClasses);
