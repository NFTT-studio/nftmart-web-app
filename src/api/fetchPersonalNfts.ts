import { identity, pickBy } from 'lodash';
import axiosClient from '../apiClient/axiosClient';
import { DEFAULT_PAGE_LIMIT } from '../constants';

type Nfts = {
  nfts: Nft[],
  pageInfo: {
    pageNum: number
    pageSize: number
    totalNum: number
  }
}

export type fetchPersonalNftsParams = {
  ownerId?: string
  creatorId?: string
  sortBy?: string,
  categoryId?: string | null,
  collectionId?: string[],
  status?: string[],
  classId?: number,
  number?: number,
  pageParam?: number
}

export default async ({
  ownerId, sortBy, categoryId, collectionId, status, classId, creatorId, number = DEFAULT_PAGE_LIMIT, pageParam,
}: fetchPersonalNftsParams) => {
  const res = await axiosClient.get<Nfts>('/nfts', {
    params: pickBy({
      ownerId,
      creatorId,
      sortBy,
      categoryId,
      collectionId: collectionId || undefined,
      status,
      classId,
      number,
      page: pageParam,
    }, identity),
  });
  return res.data;
};
