import { identity, pickBy } from 'lodash';
import axiosClient from '../apiClient/axiosClient';
import { DEFAULT_PAGE_LIMIT } from '../constants';

export type fetchHistorypriceParams = {
  id?: string,
  timePeriod?: string,
}

export default async ({
  id, timePeriod,
}: fetchHistorypriceParams) => {
  const res = await axiosClient.get('/nfts/historyprice', {
    params: pickBy({
      id,
      timePeriod,
    }, identity),
  });
  return res.data;
};
