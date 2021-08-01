import { identity, pickBy } from 'lodash';
import axiosClient from '../apiClient/axiosClient';
import { DEFAULT_PAGE_LIMIT } from '../constants';

type NftsList = {
  orders: Order[],
  pageInfo: Pagination
}

export type FetchNftParams = {
  sortBy?: string,
  categoryId?: string | null,
  collectionId?: string[],
  status?: string[],
  address?: string[]
  number?: number,
  pageParam?: number
}

export default async ({
  sortBy, categoryId, collectionId, status, number = DEFAULT_PAGE_LIMIT, pageParam = 0,
}: FetchNftParams) => {
  const res = await axiosClient.get<NftsList>('/orders', {
    params: pickBy({
      sortBy,
      categoryId,
      collectionId: collectionId || undefined,
      status,
      number,
      page: pageParam,
    }, identity),
  });
  return res.data;
};
