import { identity } from 'ramda';
import PolkaSDK from '..';
import { mapNFTToAsset } from '../utils/mapNFTToAsset';

export const queryNftByAddress = async ({ address = '' }) => {
  const nfts = await PolkaSDK.api.query.ormlNft.tokensByOwner.entries(address);

  const arr = nfts.map(async (clzToken: any) => {
    const clzTokenObj = clzToken[0];
    const len = clzTokenObj.length;

    const classId = new Uint32Array(clzTokenObj.slice(len - 4 - 8, len - 8))[0];
    const tokenIdRaw = new Uint32Array(clzTokenObj.slice(len - 8, len));

    const tokenIdLow32 = tokenIdRaw[0];
    // const tokenIdHigh32 = tokenIdRaw[1];
    const tokenId = tokenIdLow32;

    let nft: any = await PolkaSDK.api.query.ormlNft.tokens(classId, tokenId);
    if (nft.isSome) {
      nft = nft.toHuman();
      return mapNFTToAsset(nft, classId, tokenId);
    }
    return null;
  });
  const res = await Promise.all(arr);
  return res.filter(identity);
};
