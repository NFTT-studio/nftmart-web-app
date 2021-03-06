/* eslint-disable @typescript-eslint/no-explicit-any */
import { web3FromAddress } from '@polkadot/extension-dapp';
import { bnToBn } from '@polkadot/util';
import PolkaSDK from '..';

import { txLog } from '../../utils/txLog';
import { unitNum } from '../utils/unit';

export const updateOrderPrice = async ({
  address = '', // address of current user
  ownerAddress = '', // owner address
  classId = 0, // class id
  tokenId = 0, // token id
  price = 0, // new price
  cb = txLog,
}) => {
  const injector = await web3FromAddress(address);
  let order: any = await (await PolkaSDK.getSaveInstance()).api.query.nftmart.orders([classId, tokenId], ownerAddress);

  if (order.isSome) {
    // convert on chain precision
    const priceAmount = (Number(price) * unitNum).toString();
    order = order.unwrap();
    const call = (await PolkaSDK.getSaveInstance()).api.tx.nftmart.updateOrderPrice(classId, tokenId, priceAmount);
    const res = await call.signAndSend(address, { signer: injector.signer }, cb);
    return res;
  }
  return null;
};
