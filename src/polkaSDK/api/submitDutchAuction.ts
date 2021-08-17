import { web3FromAddress } from '@polkadot/extension-dapp';

import PolkaSDK from '..';
import { txLog } from '../../utils/txLog';
import { unit } from '../utils/unit';

type submitDutchAuctionProps = {
  address: string,
  minPrice: number,
  maxPrice: number,
  // eslint-disable-next-line camelcase
  allow_british_auction: boolean,
  // eslint-disable-next-line camelcase
  expirationDate: number,
  range: number,
  categoryId: number,
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
  categoryId,
  cb,
}: submitDutchAuctionProps) => {
  try {
    const injector = await web3FromAddress(address);

    const blockTimeSec = PolkaSDK.api.consts.babe.expectedBlockTime.toNumber() / 1000;
    // eslint-disable-next-line camelcase
    let deadlineBlock = (expirationDate * 24 * 60 * 60) / blockTimeSec;
    const block = await PolkaSDK.api.rpc.chain.getBlock();
    deadlineBlock += Number(block.block.header.number);

    // eslint-disable-next-line camelcase
    const min_deposit = (await PolkaSDK.api.query.nftmartConf.minOrderDeposit()).toString();
    // eslint-disable-next-line camelcase
    const min_price = minPrice * unit;
    // eslint-disable-next-line camelcase
    const max_price = maxPrice * unit;
    const NativeCurrencyID = 0;

    const minRaise = float2PerU16(range); // 50%
    const call = PolkaSDK.api.tx.nftmartAuction.submitDutchAuction(
      NativeCurrencyID, categoryId, min_deposit, min_price, max_price,
      deadlineBlock, tokens, allow_british_auction, minRaise,
    );
    await call.signAndSend(address, { signer: injector.signer }, (result: any) => txLog(result, cb.success));
  } catch (error) {
    cb.error(error.toString());
  }
};
