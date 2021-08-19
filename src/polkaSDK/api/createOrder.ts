/* eslint-disable @typescript-eslint/no-explicit-any */
import { web3FromAddress } from '@polkadot/extension-dapp';
import { bnToBn } from '@polkadot/util';
import PolkaSDK from '..';
import { txLog } from '../../utils/txLog';
import { NATIVE_CURRENCY_ID } from '../../constants';
import { unit } from '../utils/unit';

const oneMonth = (60 * 60 * 24 * 30) / 6;
function float2PerU16(x) {
  return Math.trunc(x * 65535.0);
}

export const createOrder = async ({
  address = '', // address of current user
  // category id
  classId = 0, // category id
  quantity = 1,
  price = 1, // list price
  tokenId = 0, // token id
  during = oneMonth, // during block num ,need to be conver from timestamp
  commissionRate = 0,
  cb = { success: () => null, error: (err: any) => err },
}) => {
  try {
    const injector = await web3FromAddress(address);
    const currentBlockNumber = bnToBn(await PolkaSDK.api.query.system.number());

    // convert on chain precision
    const priceAmount = unit.mul(bnToBn(price));
    const deposit = unit.mul(bnToBn('5'));
    const commissionRates = float2PerU16(commissionRate);

    const call = PolkaSDK.api.tx.nftmartOrder.submitOrder(
      NATIVE_CURRENCY_ID,
      deposit,
      priceAmount,
      currentBlockNumber.add(bnToBn(during)),
      [[classId, tokenId, quantity]],
      commissionRates,
    );
    // const feeInfo = await call.paymentInfo(account);
    await call.signAndSend(address, { signer: injector.signer }, (result: any) => txLog(result, cb.success));
  } catch (error) {
    cb.error(error.toString());
  }
};
