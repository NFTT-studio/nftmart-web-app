import { web3FromAddress } from '@polkadot/extension-dapp';

import { bnToBn } from '@polkadot/util';
import PolkaSDK from '..';
import { txLog } from '../../utils/txLog';
import { unitNum } from '../utils/unit';

type submitDutchAuctionProps = {
  address: string,
  minPrice: number,
  maxPrice: number,
  // eslint-disable-next-line camelcase
  allow_british_auction: boolean,
  // eslint-disable-next-line camelcase
  expirationDate: number,
  range: number,
  commissionRate: number,
  dutchDeposits: number,
  tokens: [],
  cb: Callback
}
function float2PerU16(x:number) {
  return Math.trunc(x * 65535.0);
}

export const submitDutchAuction = async ({
  address,
  maxPrice,
  minPrice,
  expirationDate,
  // eslint-disable-next-line camelcase
  allow_british_auction,
  range,
  tokens,
  commissionRate = 0,
  dutchDeposits,
  cb,
}: submitDutchAuctionProps) => {
  try {
    const injector = await web3FromAddress(address);

    const blockTimeSec = PolkaSDK.api.consts.babe.expectedBlockTime.toNumber() / 1000;
    // eslint-disable-next-line camelcase
    let deadlineBlock = (expirationDate * 24 * 60 * 60) / blockTimeSec;
    const block = await (await PolkaSDK.getSaveInstance()).api.rpc.chain.getBlock();
    deadlineBlock += Number(block.block.header.number);

    // eslint-disable-next-line camelcase
    const min_deposit = (Number(dutchDeposits) * unitNum).toString();
    // eslint-disable-next-line camelcase
    const min_price = (Number(minPrice) * unitNum).toString();
    // eslint-disable-next-line camelcase
    const max_price = (Number(maxPrice) * unitNum).toString();
    const NativeCurrencyID = 0;

    const minRaise = float2PerU16(range); // 50%
    const commission = float2PerU16(commissionRate);
    const call = (await PolkaSDK.getSaveInstance()).api.tx.nftmartAuction.submitDutchAuction(
      NativeCurrencyID, min_deposit, min_price, max_price,
      deadlineBlock, tokens, allow_british_auction, minRaise, commission,
    );
    await call.signAndSend(address, { signer: injector.signer }, (result: any) => txLog(result, cb.success));
  } catch (error) {
    cb.error(error.toString());
  }
};
