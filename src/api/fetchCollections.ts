import axiosClient from '../apiClient/axiosClient';

type Collections = {
  collections: Collection[],
}

export type FetchCollectionsParams = {
  address?: string
}

export default async ({ address }: FetchCollectionsParams) => {
  const res = await axiosClient.get<Collections>('/collections', {
    params: {
      creatorId: address,
    },
  });
  return res.data;
};
