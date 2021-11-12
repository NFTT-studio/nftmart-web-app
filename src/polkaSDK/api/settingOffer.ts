/* eslint-disable @typescript-eslint/no-explicit-any */
import { web3FromAddress } from '@polkadot/extension-dapp';
import { bnToBn } from '@polkadot/util';

import { txLog } from '../../utils/txLog';
import PolkaSDK from '..';

export const settingOffer = async ({
  address = '', // address of current user
  orderId = '',
  offerId = '',
  offerOwner = '',
  cb = { success: () => null, error: (err: any) => err },
}) => {
  try {
    const injector = await web3FromAddress(address);
    const commissionAgent = null;
    const txs = [
      (await PolkaSDK.getSaveInstance()).api.tx.nftmartOrder.removeOrder(orderId),
      (await PolkaSDK.getSaveInstance()).api.tx.nftmartOrder.takeOffer(offerId, offerOwner, commissionAgent, null),
    ];
    const batchExtrinsic = (await PolkaSDK.getSaveInstance()).api.tx.utility.batchAll(txs);
    const res = await batchExtrinsic.signAndSend(
      address, { signer: injector.signer }, (result: any) => txLog(result, cb.success),
    );
    return res;
  } catch (error) {
    cb.error(error.toString());
    return null;
  }
};
