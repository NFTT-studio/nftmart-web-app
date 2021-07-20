import axiosClient from '../apiClient/axiosClient';

export default async () => {
  const res = await axiosClient.get<{ banner: string }>('/banner', {
  });
  return res.data;
};
