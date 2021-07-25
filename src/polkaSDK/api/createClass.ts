/* eslint-disable @typescript-eslint/no-explicit-any */
import { web3FromAddress } from '@polkadot/extension-dapp';

import PolkaSDK from '..';
import { TOKEN_TRANSFERABLE_BURNABLE } from '../../constants';
import { txLog } from '../../utils/txLog';
import { ClassMetadata } from '../types/ClassMetadata';

const defaultClassMetadata: ClassMetadata = {
  logoUrl: '', // class img url of class
  featuredUrl: '', //  url of class
  name: '', // name of nft asset
  stub: '', // website url
  description: '', // nft desc
};
export const createClass = async ({
  address = '',
  metadata = defaultClassMetadata,
  cb,
}: { address: string, metadata: ClassMetadata, cb: Callback }) => {
  try {
    const injector = await web3FromAddress(address);
    const { name } = metadata;
    const metadataStr = JSON.stringify(metadata);
    const res = await PolkaSDK.api.tx.nftmart
      .createClass(metadataStr, name, '', TOKEN_TRANSFERABLE_BURNABLE)
      .signAndSend(address, { signer: injector.signer }, (result: any) => txLog(result, cb.success));
    return res;
  } catch (error) {
    cb.error(error.toString());
    return null;
  }
};
