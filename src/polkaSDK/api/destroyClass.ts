import { web3FromAddress } from '@polkadot/extension-dapp';

import PolkaSDK from '..';
import { txLog } from '../../utils/txLog';

type takeOfferProps = {
  classId: number,
  address: string,
  ownerId: string,
  cb: Callback
}
export const destroyClass = async ({
  classId,
  address, // address of current user
  ownerId,
  cb,
}: takeOfferProps) => {
  try {
    console.log(ownerId);
    const injector = await web3FromAddress(address);
    const tx = (await PolkaSDK.getSaveInstance()).api.tx.nftmart.destroyClass(classId, address);
    const call = await (await PolkaSDK.getSaveInstance()).api.tx.proxy
      .proxy(ownerId, null, tx)
      .signAndSend(address, { signer: injector.signer }, (result: any) => txLog(result, cb.success));
  } catch (error) {
    cb.error(error.toString());
  }
};
