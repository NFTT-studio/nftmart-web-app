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
}

export default async ({
  ownerId, sortBy, categoryId, collectionId, status, classId, collecterId,
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
    }, identity),
  });
  return res.data;
};
