import { identity, pickBy } from 'lodash';
import axiosClient from '../apiClient/axiosClient';

export type fetchPersonalEventParams = {
  address?: string,
  number?: number,
  pageParam?: number
}

export default async ({
  address, number, pageParam,
}: fetchPersonalEventParams) => {
  const res = await axiosClient.get(`accounts/transactions/${address}`, {
    params: pickBy({
      limit: number,
      offset: pageParam * number,
    }, identity),
  });
  return res.data;
};
