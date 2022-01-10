import { identity, pickBy } from 'lodash';
import axiosClient from '../apiClient/axiosClient';

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
