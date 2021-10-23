import { identity, pickBy } from 'lodash';
import axiosClient from '../apiClient/axiosClient';
import { DEFAULT_PAGE_LIMIT } from '../constants';

type Offer = {
  offer: [],
  pageInfo: {
    pageNum: number
    pageSize: number
    totalNum: number
  }
}

export type fetchPersonalOfferParams = {
  addressId?: string,
  number?: number,
  pageParam?: number
  type?: string,
}

export default async ({
  addressId, number = DEFAULT_PAGE_LIMIT, pageParam, type,
}: fetchPersonalOfferParams) => {
  const res = await axiosClient.get<Offer>('orders/offer/list', {
    params: pickBy({
      addressId,
      type,
      number,
      page: pageParam,
    }, identity),
  });
  return res.data;
};
