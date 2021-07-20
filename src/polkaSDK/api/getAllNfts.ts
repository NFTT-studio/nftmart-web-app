import { Work } from '../types/Work';
import PolkaSDK from '..';
import { getClassId } from '../utils/getClassId';
import { mapNFTsToAsset } from '../utils/mapNFTsToAsset';
import { getAllNftsByClassId } from './getAllNftsByClassId';

export const getAllNfts = async (classId?: number): Promise<Work[]> => {
  if (classId === undefined) {
    const allClasses = await PolkaSDK.api.query.ormlNft.classes.entries();
    const result = await Promise.all(
      allClasses.map(async (c: any) => {
        const cid = getClassId(c);
        const nfts: any = await getAllNftsByClassId(cid);
        return mapNFTsToAsset(nfts, cid);
      }),
    );
    // flatten list of list by depth 1
    return result.flat() as Work[];
  }
  return mapNFTsToAsset(await getAllNftsByClassId(classId), classId);
};
