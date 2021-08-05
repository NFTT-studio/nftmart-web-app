import { web3FromAddress } from '@polkadot/extension-dapp';

import PolkaSDK from '..';
import { txLog } from '../../utils/txLog';

type takeOrderOfferProps = {
  address: string,
  offerId: number,
  offerOwner: string,
  orderId: string,
  cb: Callback
}
export const takeOrderOffer = async ({
  address, // address of current user
  offerId,
  offerOwner,
  orderId,
  cb,
// eslint-disable-next-line consistent-return
}: takeOrderOfferProps) => {
  try {
    const injector = await web3FromAddress(address);

    const txs = [
      PolkaSDK.api.tx.nftmartOrder.removeOrder(orderId),
      PolkaSDK.api.tx.nftmartOrder.takeOffer(offerId, offerOwner),
    ];
    const batchExtrinsic = PolkaSDK.api.tx.utility.batchAll(txs);

    const res = await batchExtrinsic.signAndSend(
      address, { signer: injector.signer }, (result: any) => txLog(result, cb.success),
    );
    return res;
  } catch (error) {
    cb.error(error.toString());
  }
};
