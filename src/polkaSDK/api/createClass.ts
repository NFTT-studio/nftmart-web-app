/* eslint-disable @typescript-eslint/no-explicit-any */
import { web3FromAddress } from '@polkadot/extension-dapp';

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
export const createClass = async ({
  address = '',
  royaltyRate = 0,
  cate = [],
  metadata = defaultClassMetadata,
  cb,
}: { address: string, metadata: ClassMetadata, royaltyRate: number, cate : [], cb: Callback }) => {
  try {
    const injector = await web3FromAddress(address);
    const { name } = metadata;
    const metadataStr = JSON.stringify(metadata);
    const royaltyRates = float2PerU16(royaltyRate);
    const res = await PolkaSDK.api.tx.nftmart
      .createClass(metadataStr, null, '', royaltyRates, TOKEN_TRANSFERABLE_BURNABLE, cate)
      .signAndSend(address, { signer: injector.signer }, (result: any) => txLog(result, cb.success));
    return res;
  } catch (error) {
    cb.error(error.toString());
    return null;
  }
};
