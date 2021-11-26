import { web3FromAddress } from '@polkadot/extension-dapp';

import PolkaSDK from '..';
import { txLog } from '../../utils/txLog';

type burnTokenProps = {
  classId: number,
  address: string,
  tokenId: number,
  cb: Callback
}
export const burnToken = async ({
  classId,
  address, // address of current user
  tokenId,
  cb,
}: burnTokenProps) => {
  try {
    const injector = await web3FromAddress(address);
    await (await PolkaSDK.getSaveInstance()).api.tx.nftmart
      .burn(classId, tokenId, 1)
      .signAndSend(address, { signer: injector.signer }, (result: any) => txLog(result, cb.success));
  } catch (error) {
    cb.error(error.toString());
  }
};
