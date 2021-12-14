/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { web3FromAddress } from '@polkadot/extension-dapp';
import PolkaSDK from '..';
import { txLog } from '../../utils/txLog';
import { nftDeposit } from './nftDeposit';

function float2PerU16(x) {
  return Math.trunc(x * 65535.0);
}

type mintNftProps = {
  address: string | undefined,
  classId: number,
  tokenId: number,
  metadata: Metadata,
  quantity: number,
  royaltyRate: string | undefined,
  cb: Callback
}
export const updateToken = async ({
  address = '',
  classId,
  tokenId,
  quantity = 1,
  metadata,
  royaltyRate,
  cb,
}: mintNftProps) => {
  try {
    const injector = await web3FromAddress(address);
    const metadataStr = JSON.stringify(metadata);
    const royalty_rate = float2PerU16(royaltyRate);
    const call = await (await PolkaSDK.getSaveInstance()).api.tx.nftmart
      .updateToken(
        address, classId, tokenId, quantity, metadataStr, royalty_rate,
      )
      .signAndSend(address, { signer: injector.signer }, (result: any) => txLog(result, cb.success));
    return call;
  } catch (error) {
    cb.error(error.toString());
    return null;
  }
};
