import { web3FromAddress } from '@polkadot/extension-dapp';

import PolkaSDK from '..';
import { txLog } from '../../utils/txLog';

type redeemBritishAuctionProps = {
  auctionCreatorAddress: string,
  auctionId: number,
  cb: Callback
}

export const redeemBritishAuction = async ({
  auctionCreatorAddress,
  auctionId,
  cb,
}: redeemBritishAuctionProps) => {
  try {
    const injector = await web3FromAddress(auctionCreatorAddress);
    const call = PolkaSDK.api.tx.nftmartAuction.redeemDutchAuction(
      auctionCreatorAddress, auctionId,
    );
    await call.signAndSend(
      auctionCreatorAddress, { signer: injector.signer }, (result: any) => txLog(result, cb.success),
    );
  } catch (error) {
    cb.error(error.toString());
  }
};
