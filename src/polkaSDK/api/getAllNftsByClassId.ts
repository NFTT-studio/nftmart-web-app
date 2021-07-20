import PolkaSDK from '..';
import { hexToUtf8 } from '../../utils/number';

export const getAllNftsByClassId = async (classId: number) => {
  const nextTokenId: any = await PolkaSDK.api.query.ormlNft.nextTokenId(classId);
  // let tokenCount = 0;
  let classInfo: any = await PolkaSDK.api.query.ormlNft.classes(classId);
  if (classInfo.isSome) {
    const arr = [];
    classInfo = classInfo.unwrap();
    // const accountInfo = await api.query.system.account(classInfo.owner);
    // console.log(classInfo.toString());
    // console.log(accountInfo.toString());
    for (let i = 0; i < nextTokenId; i += 1) {
      arr.push(PolkaSDK.api.query.ormlNft.tokens(classId, i));
    }
    const res = await Promise.all(arr);
    const results = res.map((n: any, idx) => {
      if (n.isEmpty) return null;
      const nft = JSON.parse(n.unwrap());
      nft.metadata = hexToUtf8(nft.metadata);
      nft.classInfo = classInfo.toHuman();
      nft.tokenId = idx;
      return nft;
    });
    return results.filter((nft) => nft);
  }
  return [];
};
