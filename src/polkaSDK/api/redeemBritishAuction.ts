import { web3FromAddress } from '@polkadot/extension-dapp';

import PolkaSDK from '..';
import { txLog } from '../../utils/txLog';

type redeemBritishAuctionProps = {
  address: string,
  auctionCreatorAddress: string,
  auctionId: number,
  cb: Callback
}

export const redeemBritishAuction = async ({
  address,
  auctionCreatorAddress,
  auctionId,
  cb,
}: redeemBritishAuctionProps) => {
  try {
    const injector = await web3FromAddress(address);
    const call = PolkaSDK.api.tx.nftmartAuction.redeemBritishAuction(
      auctionCreatorAddress, auctionId,
    );
    await call.signAndSend(
      address, { signer: injector.signer }, (result: any) => txLog(result, cb.success),
    );
  } catch (error) {
    cb.error(error.toString());
  }
};
