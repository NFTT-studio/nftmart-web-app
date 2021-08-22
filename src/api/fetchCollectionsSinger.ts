import axiosClient from '../apiClient/axiosClient';

type collections = {
  collection:{
    metadata:{
      name: string,
      id: string,
      description: string,
      logoUrl: string,
      // eslint-disable-next-line @typescript-eslint/ban-types
      links: {} | undefined,
    },
    // eslint-disable-next-line camelcase
    royalty_rate: number,
    id: string
  }
}

export default async (collectionId: string) => {
  const res = await axiosClient.get<collections>(`/collections/${collectionId}`);
  return res.data;
};
