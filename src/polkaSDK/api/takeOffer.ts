import { web3FromAddress } from '@polkadot/extension-dapp';

import PolkaSDK from '..';
import { txLog } from '../../utils/txLog';

type takeOfferProps = {
  address: string,
  offerId: number,
  offerOwner: string,
  cb: Callback
}
export const takeOffer = async ({
  address, // address of current user
  offerId,
  offerOwner,
  cb,
}: takeOfferProps) => {
  try {
    const injector = await web3FromAddress(address);
    const call = PolkaSDK.api.tx.nftmartOrder.takeOffer(offerId, offerOwner);
    await call.signAndSend(address, { signer: injector.signer }, (result: any) => txLog(result, cb.success));
  } catch (error) {
    cb.error(error.toString());
  }
};