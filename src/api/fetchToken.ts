import axiosClient from '../apiClient/axiosClient';

export default async () => {
  const res = await axiosClient.get<{ token: string }>('/accounts/token/price', {
  });
  return res.data;
};
