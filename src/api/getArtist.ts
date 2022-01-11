import axiosClient from '../apiClient/axiosClient';

export default async () => {
  const res = await axiosClient.get('accounts/artist');
  return res.data;
};
