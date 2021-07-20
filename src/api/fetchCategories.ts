import axiosClient from '../apiClient/axiosClient';

type Categories = {
  categories: Category[],
}

export default async () => {
  const res = await axiosClient.get<Categories>('/categories', {
  });
  return res.data;
};
