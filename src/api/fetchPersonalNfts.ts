import { identity, pickBy } from 'lodash';
import axiosClient from '../apiClient/axiosClient';

type Nfts = {
  nfts: Nft,
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
  collectionId?: string,
  status?: string[],
  classId?: number,
}

export default async ({
  ownerId, sortBy, categoryId, collectionId, status, classId, creatorId,
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
    }, identity),
  });
  return res.data;
};
