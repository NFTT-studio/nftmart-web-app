import { useQuery } from 'react-query';
import fetchCategories from '../../api/fetchCategories';
import { QUERY_KEYS } from '../../constants';

export default () => useQuery(QUERY_KEYS.CATEGORIES, () => fetchCategories());
