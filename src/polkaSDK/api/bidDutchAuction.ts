/* eslint-disable max-len */
import { web3FromAddress } from '@polkadot/extension-dapp';

import { bnToBn } from '@polkadot/util';
import PolkaSDK from '..';
import { txLog } from '../../utils/txLog';
import { unit } from '../utils/unit';

type bidBritishAuctionProps = {
  address: string,
  auctionCreatorAddress: string,
  auctionId: number,
  price: string,
  cb: Callback
}
async function getAuctionDeadline(allowDelay, deadline, lastBidBlock) {
  try {
    const d = await (await PolkaSDK.getSaveInstance()).api.ws.call('nftmart_getAuctionDeadline', [allowDelay, deadline, lastBidBlock], 10000);
    return bnToBn(d);
  } catch (e) {
    return null;
  }
}
function perU16ToFloat(x) {
  return Number(x) / 65535.0;
}

export const bidDutchAuction = async ({
  address,
  auctionCreatorAddress,
  auctionId,
  price,
  cb,
}: bidBritishAuctionProps) => {
  try {
    const injector = await web3FromAddress(address);
    // eslint-disable-next-line prefer-const
    let [auction, bid, block] = await Promise.all([
      (await PolkaSDK.getSaveInstance()).api.query.nftmartAuction.dutchAuctions(auctionCreatorAddress, auctionId),
      (await PolkaSDK.getSaveInstance()).api.query.nftmartAuction.dutchAuctionBids(auctionId),
      (await PolkaSDK.getSaveInstance()).api.rpc.chain.getBlock(),
    ]);
    const currentBlock = Number(block.block.header.number);
    if (auction.isSome && bid.isSome) {
      auction = auction.unwrap();
      bid = bid.unwrap();
      let call;
      if (bid.lastBidAccount.isNone) {
        // This is the first bidding.
        if (currentBlock > auction.deadline) {
          cb.error('auction closed');
          return;
        }
        const uselessPrice = price * unit; // The real price used will be calculated by Dutch auction logic.
        call = (await PolkaSDK.getSaveInstance()).api.tx.nftmartAuction.bidDutchAuction(uselessPrice, auctionCreatorAddress, auctionId, null, 'hello bidDutchAuction');
      } else {
        // This if branch is at least the second bidding.
        // const deadline = await getAuctionDeadline(true, 0, bid.lastBidBlock);
        // if (currentBlock > Number(deadline.toString())) {
        //   console.log('auction closed', 2, currentBlock, deadline);
        //   return;
        // }
        const minRaise = perU16ToFloat(auction.minRaise);
        const lowest = (1 + minRaise) * (bid.lastBidPrice / unit);
        if (price > lowest) {
          call = (await PolkaSDK.getSaveInstance()).api.tx.nftmartAuction.bidDutchAuction(price * unit, auctionCreatorAddress, auctionId, null, 'hello bidDutchAuction');
        } else {
          console.log('price %s NMT should be greater than %s NMT', price, lowest);
          return;
        }
      }
      await call.signAndSend(
        address, { signer: injector.signer }, (result: any) => txLog(result, cb.success),
      );
    } else {
      cb.error('auction %s not found');
      console.log('auction %s not found', auctionId);
    }
  } catch (error) {
    cb.error(error.toString());
  }
};
