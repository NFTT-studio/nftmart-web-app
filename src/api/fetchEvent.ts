import { identity, pickBy } from 'lodash';
import axiosClient from '../apiClient/axiosClient';
import { DEFAULT_PAGE_LIMIT } from '../constants';

type Event = {
  event: [],
  pageInfo: {
    pageNum: number
    pageSize: number
    totalNum: number
  }
}

export type fetchPersonalEventParams = {
  nftId?: string,
  number?: number,
  pageParam?: number
}

export default async ({
  nftId, number = DEFAULT_PAGE_LIMIT, pageParam,
}: fetchPersonalEventParams) => {
  const res = await axiosClient.get<Event>('orders/event/list', {
    params: pickBy({
      nftId,
      number,
      page: pageParam,
    }, identity),
  });
  return res.data;
};
