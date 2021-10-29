import { identity, pickBy } from 'lodash';
import axiosClient from '../apiClient/axiosClient';

type Nfts = {
  nfts: Nft[],
  pageInfo: {
    pageNum: number
    pageSize: number
    totalNum: number
  }
}

export type fetchNftCollectParams = {
  ownerId?: string
  collecterId?: string
  sortBy?: string,
  categoryId?: string | null,
  collectionId?: string,
  status?: string[],
  classId?: number,
  pageParam?: number
}

export default async ({
  ownerId, sortBy, categoryId, collectionId, status, classId, collecterId, pageParam,
}: fetchNftCollectParams) => {
  const res = await axiosClient.get<Nfts>('/nfts/collect/list', {
    params: pickBy({
      ownerId,
      collecterId,
      sortBy,
      categoryId,
      collectionId: collectionId || undefined,
      status,
      classId,
      page: pageParam,
    }, identity),
  });
  return res.data;
};
