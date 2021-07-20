import axiosClient from '../apiClient/axiosClient';

type NftData = {
  data: {
    order: Order,
  }
}

export default async (id: string) => {
  const res = await axiosClient.get<NftData>(`/orders/${id}`);
  return res.data;
};
