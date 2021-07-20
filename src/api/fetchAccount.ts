import axiosClient from '../apiClient/axiosClient';

export default async (address: string) => {
  const res = await axiosClient.get<Account>(`/accounts/${address}`);
  return res.data;
};
