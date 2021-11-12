/* eslint-disable @typescript-eslint/no-explicit-any */
import PolkaSDK from '..';
import { hexToUtf8 } from '../../utils/number';
import { getClassById } from './getClassById';

export const getNft = async (classId: string, id: string) => {
  const res: any = await (await PolkaSDK.getSaveInstance()).api.query.ormlNft.tokens(classId, id); // todo metadata parse
  if (res.isSome) {
    const nft = JSON.parse(res.unwrap());
    nft.metadata = JSON.parse(hexToUtf8(nft.metadata));
    nft.class = await getClassById(classId);
    return nft;
  }
  return null;
};
