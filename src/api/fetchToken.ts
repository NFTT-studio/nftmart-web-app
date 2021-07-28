import axiosClient from '../apiClient/axiosClient';

export default async () => {
  const res = await axiosClient.get<{ token: string }>('/api/accounts/token/price', {
  });
  return res.data;
};
