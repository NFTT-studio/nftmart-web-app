import { web3FromAddress } from '@polkadot/extension-dapp';

import { txLog } from '../../utils/txLog';
import PolkaSDK from '..';

export const deleteOrder = async ({
  address = '', // address of current user
  orderId = '',
  cb = { success: () => null, error: (err: any) => err },
}) => {
  try {
    const injector = await web3FromAddress(address);

    const call = PolkaSDK.api.tx.nftmartOrder.removeOrder(orderId);
    const res = await call.signAndSend(address, { signer: injector.signer }, (result: any) => txLog(result, cb.success));
    return res;
  } catch (error) {
    cb.error(error.toString());
    return null;
  }
};
