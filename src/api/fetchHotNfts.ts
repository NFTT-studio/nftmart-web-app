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

export type fetchNftHotParams = {
  ownerId?: string
  collecterId?: string
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
  ownerId, collecterId, sortBy, categoryId, collectionId, status, classId, creatorId, number = DEFAULT_PAGE_LIMIT, pageParam,
}: fetchNftHotParams) => {
  const res = await axiosClient.get<Nfts>('/nfts/hot', {
    params: pickBy({
      ownerId,
      collecterId,
      creatorId,
      sortBy,
      categoryId,
      collectionId: collectionId || undefined,
      status,
      classId,
      limit: number,
      offset: 0,
    }, identity),
  });
  return res.data;
};
