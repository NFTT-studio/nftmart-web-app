import { web3FromAddress } from '@polkadot/extension-dapp';

import PolkaSDK from '..';
import { txLog } from '../../utils/txLog';

type takeOfferProps = {
  address: string,
  offerId: number,
  cb: Callback
}
export const removeOffer = async ({
  address, // address of current user
  offerId,
  cb,
}: takeOfferProps) => {
  try {
    const injector = await web3FromAddress(address);
    const call = PolkaSDK.api.tx.nftmartOrder.removeOffer(offerId);
    await call.signAndSend(address, { signer: injector.signer }, (result: any) => txLog(result, cb.success));
  } catch (error) {
    cb.error(error.toString());
  }
};
