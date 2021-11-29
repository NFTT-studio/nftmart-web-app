import axiosClient from '../apiClient/axiosClient';

type Collections = {
  collections: Collection[],
}

export type FetchCollectionsParams = {
  limit?: number
  pageParam?: number
}

export default async ({ limit, pageParam }: FetchCollectionsParams) => {
  const res = await axiosClient.get<Collections>('/nfts/collect/recommend', {
    params: {
      limit,
      offset: pageParam,
    },
  });
  return res.data;
};
