/* eslint-disable @typescript-eslint/no-explicit-any */
import { bnToBn } from '@polkadot/util';

import PolkaSDK from '..';

// query gas needed
export async function nftDeposit(metadata: string) {
  try {
    const depositAll = await PolkaSDK.ws.call('nftmart_mintTokenDeposit', [Number(metadata.length) + 1], 10000);
    return bnToBn(depositAll as any);
  } catch (e) {
    return null;
  }
}
