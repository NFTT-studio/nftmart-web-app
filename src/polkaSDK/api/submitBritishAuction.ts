import { web3FromAddress } from '@polkadot/extension-dapp';

import { bnToBn } from '@polkadot/util';
import PolkaSDK from '..';
import { txLog } from '../../utils/txLog';
import { unit } from '../utils/unit';

type submitBritishAuctionProps = {
  address: string,
  InitPrice: number,
  hammerPrice: number,
  // eslint-disable-next-line camelcase
  allow_delay: boolean,
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

export const submitBritishAuction = async ({
  address,
  InitPrice,
  // eslint-disable-next-line camelcase
  expirationDate,
  // eslint-disable-next-line camelcase
  allow_delay,
  range,
  hammerPrice,
  tokens,
  categoryId,
  cb,
}: submitBritishAuctionProps) => {
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
    const init_price = InitPrice * unit;
    // eslint-disable-next-line camelcase
    const hammer_price = bnToBn(hammerPrice).mul(unit);
    const NativeCurrencyID = 0;

    const minRaise = float2PerU16(range); // 50%
    const call = PolkaSDK.api.tx.nftmartAuction.submitBritishAuction(
      NativeCurrencyID, hammer_price, minRaise, min_deposit, init_price,
      deadlineBlock, allow_delay, categoryId, tokens,
    );
    await call.signAndSend(address, { signer: injector.signer }, (result: any) => txLog(result, cb.success));
  } catch (error) {
    cb.error(error.toString());
  }
};
