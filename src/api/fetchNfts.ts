import { identity, pickBy } from 'lodash';
import axiosClient from '../apiClient/axiosClient';

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
  limit?: number
}

export default async ({
  sortBy, categoryId, collectionId, status, limit = 20,
}: FetchNftParams) => {
  const res = await axiosClient.get<NftsList>('/orders', {
    params: pickBy({
      sortBy,
      categoryId,
      collectionId: collectionId || undefined,
      status,
      limit,
    }, identity),
  });
  return res.data;
};
