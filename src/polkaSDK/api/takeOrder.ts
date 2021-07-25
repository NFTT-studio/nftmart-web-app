/* eslint-disable @typescript-eslint/no-explicit-any */
import { web3FromAddress } from '@polkadot/extension-dapp';
import PolkaSDK from '..';
import { txLog } from '../../utils/txLog';

export const takeOrder = async ({
  address, // address of current user
  orderOwner, // owner address
  orderId,
  cb,
}: {
  address: string,
  orderOwner: string,
  orderId: string,
  cb: Callback
}) => {
  try {
    const injector = await web3FromAddress(address);

    const call = PolkaSDK.api.tx.nftmartOrder.takeOrder(
      orderId,
      orderOwner,
    );
    const res = await call.signAndSend(
      address, { signer: injector.signer }, (result: any) => txLog(result, cb.success),
    );
    return res;
  } catch (error) {
    cb.error(error.toString());
    return null;
  }
};
