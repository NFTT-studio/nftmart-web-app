import { web3FromAddress } from '@polkadot/extension-dapp';

import PolkaSDK from '..';
import { txLog } from '../../utils/txLog';

type removeBritishAuctionProps = {
  address: string,
  auctionCreatorAddress: string,
  auctionId: number,
  cb: Callback
}

export const removeBritishAuction = async ({
  address,
  auctionCreatorAddress,
  auctionId,
  cb,
}: removeBritishAuctionProps) => {
  try {
    const injector = await web3FromAddress(address);
    const call = PolkaSDK.api.tx.nftmartAuction.removeBritishAuction(auctionId);
    await call.signAndSend(
      auctionCreatorAddress, { signer: injector.signer }, (result: any) => txLog(result, cb.success),
    );
  } catch (error) {
    cb.error(error.toString());
  }
};
