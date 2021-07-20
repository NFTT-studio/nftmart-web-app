import { bnToBn } from '@polkadot/util';

import PolkaSDK from '..';

// query gas needed
export async function nftDeposit(metadata: string) {
  try {
    const depositAll = await PolkaSDK.ws.call('nftmart_mintTokenDeposit', [metadata.length], 10000);
    return bnToBn(depositAll as any);
  } catch (e) {
    console.log(e);
    return null;
  }
}
