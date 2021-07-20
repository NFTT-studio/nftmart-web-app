import { identity, pickBy } from 'lodash';
import axiosClient from '../apiClient/axiosClient';

type Nfts = {
  data: {

  }
}

export type fetchPersonalNftsParams = {
  ownerId?: string
  sortBy?: string,
  categoryId?: string | null,
  collectionId?: string[],
  status?: string[],
  classId?: number,
}

export default async ({
  ownerId, sortBy, categoryId, collectionId, status, classId,
}: fetchPersonalNftsParams) => {
  const res = await axiosClient.get<Nfts>('/nfts', {
    params: pickBy({
      ownerId,
      sortBy,
      categoryId,
      collectionId: collectionId || undefined,
      status,
      classId,
    }, identity),
  });
  return res.data;
};
