import { Work } from '../polkaSDK/types';

export const filterAssets = (
  assets: Work[],
  { status = -1, categoryId: category = -1, collectionId: collection = -1 }: Partial<FilterTypes>,
) => {
  const filted = assets
    .filter(({ status: assetStatus }) => status === -1 || assetStatus === status)
    .filter(({ categoryId }) => category === -1 || categoryId === category)
    .filter(({ classId: collectionId }) => collection === -1 || collectionId === collection);

  return filted;
};
