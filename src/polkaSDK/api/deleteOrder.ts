import { web3FromAddress } from '@polkadot/extension-dapp';
import { noop } from 'react-query/types/core/utils';
import { txLog } from '../../utils/txLog';
import PolkaSDK from '..';

export const deleteOrder = async ({
  address = '', // address of current user
  ownerAddress = '', // owner address
  classId = 0, // class id
  tokenId = 0, // token id
  cb = { success: noop, error: (err: any) => err },
}) => {
  try {
    const injector = await web3FromAddress(address);
    let order: any = await PolkaSDK.api.query.nftmart.orders([classId, tokenId], ownerAddress);
    if (order.isSome) {
      order = order.unwrap();
      const call = PolkaSDK.api.tx.nftmart.removeOrder(classId, tokenId);
      const res = await call.signAndSend(address, { signer: injector.signer }, (result: any) => txLog(result, cb.success));
      return res;
    }
    return null;
  } catch (error) {
    cb.error(error.toString());
    return null;
  }
};
