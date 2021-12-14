/* eslint-disable @typescript-eslint/no-explicit-any */
import { web3FromAddress } from '@polkadot/extension-dapp';
import { number } from 'yup/lib/locale';

import PolkaSDK from '..';
import { TOKEN_TRANSFERABLE_BURNABLE } from '../../constants';
import { txLog } from '../../utils/txLog';
import { ClassMetadata } from '../types/ClassMetadata';

function float2PerU16(x) {
  return Math.trunc(x * 65535.0);
}

const defaultClassMetadata: ClassMetadata = {
  logoUrl: '', // class img url of class
  banner: '',
  featuredUrl: '',
  name: '', // name of nft asset
  stub: '', // website url
  description: '', // nft desc
};
export const updateClass = async ({
  classId,
  ownerId,
  address = '',
  royaltyRate = 0,
  cate = [],
  metadata = defaultClassMetadata,
  cb,
}: {classId: number, address: string, ownerId: string, metadata: ClassMetadata, royaltyRate: number, cate : [], cb: Callback }) => {
  try {
    console.log(address, ownerId);
    const injector = await web3FromAddress(address);
    console.log(address, ownerId);
    const { name } = metadata;
    const metadataStr = JSON.stringify(metadata);
    const royaltyRates = float2PerU16(royaltyRate);
    const tx = await (await PolkaSDK.getSaveInstance()).api.tx.nftmart
      .updateClass(classId, metadataStr, null, '', royaltyRates, TOKEN_TRANSFERABLE_BURNABLE, cate);
    const res = await (await PolkaSDK.getSaveInstance()).api.tx.proxy
      .proxy(ownerId, null, tx)
      .signAndSend(address, { signer: injector.signer }, (result: any) => txLog(result, cb.success));
    return res;
  } catch (error) {
    cb.error(error.toString());
    return null;
  }
};
