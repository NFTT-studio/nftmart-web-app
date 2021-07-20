import { bnToBn } from '@polkadot/util';
import PolkaSDK from '..';

export const getOrder = async (classId = '', tokenId = '', onerAddr = '') => {
  const order: any = await PolkaSDK.api.query.nftmart.orders([classId, tokenId], onerAddr);
  const currentBlockNumber = bnToBn(await PolkaSDK.api.query.system.number());

  if (order.isSome) {
    const res = order.toHuman();
    const deadline = +res.deadline.replace(/,/g, '');
    if (typeof currentBlockNumber !== 'undefined' && currentBlockNumber.ltn(deadline)) {
      return res;
    }
  }
  return null;
};
