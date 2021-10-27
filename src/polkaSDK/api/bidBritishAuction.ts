import { web3FromAddress } from '@polkadot/extension-dapp';

import { bnToBn } from '@polkadot/util';
import PolkaSDK from '..';
import { txLog } from '../../utils/txLog';
import { unit } from '../utils/unit';

type bidBritishAuctionProps = {
  address: string,
  auctionCreatorAddress: string,
  auctionId: number,
  prices: string,
  cb: Callback
}

export const bidBritishAuction = async ({
  address,
  auctionCreatorAddress,
  auctionId,
  prices,
  cb,
}: bidBritishAuctionProps) => {
  try {
    const injector = await web3FromAddress(address);
    const price = bnToBn(prices);
    const call = PolkaSDK.api.tx.nftmartAuction.bidBritishAuction(price.mul(unit), auctionCreatorAddress, auctionId, null, null);
    await call.signAndSend(
      address, { signer: injector.signer }, (result: any) => txLog(result, cb.success),
    );
  } catch (error) {
    cb.error(error.toString());
  }
};
