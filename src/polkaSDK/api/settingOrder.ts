/* eslint-disable @typescript-eslint/no-explicit-any */
import { web3FromAddress } from '@polkadot/extension-dapp';
import { bnToBn } from '@polkadot/util';

import { txLog } from '../../utils/txLog';
import PolkaSDK from '..';
import { unitNum } from '../utils/unit';
import { NATIVE_CURRENCY_ID } from '../../constants';

const oneMonth = (60 * 60 * 24 * 30) / 6;
function float2PerU16(x) {
  return Math.trunc(x * 65535.0);
}

export const settingOrder = async ({
  address = '', // address of current user
  orderId = '',
  deposits = '',
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
    const commissionRates = float2PerU16(commissionRate);

    // convert on chain precision
    const priceAmount = (Number(price) * unitNum).toString();
    const deposit = (Number(deposits) * unitNum).toString();
    const txs = [
      PolkaSDK.api.tx.nftmartOrder.removeOrder(orderId),
      PolkaSDK.api.tx.nftmartOrder.submitOrder(
        NATIVE_CURRENCY_ID,
        deposit,
        priceAmount,
        currentBlockNumber.add(bnToBn(during)),
        [[classId, tokenId, quantity]],
        commissionRates,
      ),
    ];
    const batchExtrinsic = PolkaSDK.api.tx.utility.batchAll(txs);
    const res = await batchExtrinsic.signAndSend(
      address, { signer: injector.signer }, (result: any) => txLog(result, cb.success),
    );
    return res;
  } catch (error) {
    cb.error(error.toString());
    return null;
  }
};
