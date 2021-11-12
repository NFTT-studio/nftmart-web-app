/* eslint-disable @typescript-eslint/no-explicit-any */
import { bnToBn } from '@polkadot/util';

import PolkaSDK from '..';

// query gas needed
export async function nftDeposit(metadata: string) {
  try {
    const metadataLength = Number(metadata.length * 1.15);
    const depositAll = await (await PolkaSDK.getSaveInstance()).ws.call('nftmart_mintTokenDeposit', [Math.ceil(metadataLength)], 10000);
    return bnToBn(depositAll as any);
  } catch (e) {
    return null;
  }
}
