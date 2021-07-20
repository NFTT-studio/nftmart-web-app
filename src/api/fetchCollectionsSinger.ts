import axiosClient from '../apiClient/axiosClient';

type collections = {
  collection:{
    metadata:{
      name: string,
      id: string,
      description: string,
      logoUrl: string,
    }
  }
}

export default async (collectionId: string) => {
  const res = await axiosClient.get<collections>(`/collections/${collectionId}`);
  return res.data;
};
