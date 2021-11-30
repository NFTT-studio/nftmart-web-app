import { web3FromAddress } from '@polkadot/extension-dapp';

import PolkaSDK from '..';
import { txLog } from '../../utils/txLog';

function float2PerU16(x) {
  return Math.trunc(x * 65535.0);
}

type burnTokenProps = {
  classId: number,
  address: string,
  tokenId: number,
  royalties: number,
  cb: Callback
}
export const updateTokenRoyalty = async ({
  classId,
  address, // address of current user
  tokenId,
  royalties,
  cb,
}: burnTokenProps) => {
  try {
    const injector = await web3FromAddress(address);
    const royaltiesFloat = float2PerU16(royalties / 100).toString();
    await (await PolkaSDK.getSaveInstance()).api.tx.nftmart
      .updateTokenRoyalty(
        classId,
        tokenId,
        royaltiesFloat,
      )
      .signAndSend(address, { signer: injector.signer }, (result: any) => txLog(result, cb.success));
  } catch (error) {
    cb.error(error.toString());
  }
};
