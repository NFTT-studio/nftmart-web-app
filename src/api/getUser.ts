import axiosClient from '../apiClient/axiosClient';

export default async (address: string | undefined) => {
  const res = await axiosClient.get(`/accounts/${address}`);
  return res.data;
};
