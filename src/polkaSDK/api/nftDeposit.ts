/* eslint-disable @typescript-eslint/no-explicit-any */
import { bnToBn } from '@polkadot/util';

import PolkaSDK from '..';

// query gas needed
export async function nftDeposit(metadata: string) {
  try {
    const depositAll = await PolkaSDK.ws.call('nftmart_mintTokenDeposit', [metadata.length], 10000);
    console.log([metadata.length]);
    return bnToBn(depositAll as any);
  } catch (e) {
    return null;
  }
}
