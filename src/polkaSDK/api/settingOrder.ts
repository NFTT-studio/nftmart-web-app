/* eslint-disable @typescript-eslint/no-explicit-any */
import { web3FromAddress } from '@polkadot/extension-dapp';
import { bnToBn } from '@polkadot/util';

import { txLog } from '../../utils/txLog';
import PolkaSDK from '..';
import { unit } from '../utils/unit';
import { NATIVE_CURRENCY_ID } from '../../constants';

const oneMonth = (60 * 60 * 24 * 30) / 6;

export const settingOrder = async ({
  address = '', // address of current user
  orderId = '',
  categoryId = 0, // category id
  classId = 0, // category id
  quantity = 1,
  price = 1, // list price
  tokenId = 0, // token id
  during = oneMonth, // during block num ,need to be conver from timestamp
  cb = { success: () => null, error: (err: any) => err },
}) => {
  try {
    const injector = await web3FromAddress(address);
    const currentBlockNumber = bnToBn(await PolkaSDK.api.query.system.number());

    // convert on chain precision
    const priceAmount = unit.mul(bnToBn(price));
    const deposit = unit.mul(bnToBn('5'));
    const txs = [
      PolkaSDK.api.tx.nftmartOrder.removeOrder(orderId),
      PolkaSDK.api.tx.nftmartOrder.submitOrder(
        NATIVE_CURRENCY_ID,
        categoryId,
        deposit,
        priceAmount,
        currentBlockNumber.add(bnToBn(during)),
        [[classId, tokenId, quantity]],
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