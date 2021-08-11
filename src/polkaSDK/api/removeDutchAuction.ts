import { web3FromAddress } from '@polkadot/extension-dapp';

import PolkaSDK from '..';
import { txLog } from '../../utils/txLog';

type removeDutchAuctionProps = {
  auctionCreatorAddress: string,
  auctionId: number,
  cb: Callback
}

export const removeDutchAuction = async ({
  auctionCreatorAddress,
  auctionId,
  cb,
}: removeDutchAuctionProps) => {
  try {
    const injector = await web3FromAddress(auctionCreatorAddress);
    const call = PolkaSDK.api.tx.nftmartAuction.removeDutchAuction(auctionId);
    await call.signAndSend(
      auctionCreatorAddress, { signer: injector.signer }, (result: any) => txLog(result, cb.success),
    );
  } catch (error) {
    cb.error(error.toString());
  }
};
