import { web3FromAddress } from '@polkadot/extension-dapp';
import { bnToBn } from '@polkadot/util';

import PolkaSDK from '..';
import { NATIVE_CURRENCY_ID } from '../../constants';
import { txLog } from '../../utils/txLog';
import { unitNum } from '../utils/unit';

const oneMonth = (60 * 60 * 24 * 30) / 6;

type submitOfferProps = {
  address: string,
  categoryId: number,
  classId: number,
  quantity: number,
  price: number,
  tokenId: number,
  during: number,
  cb: Callback
}
export const submitOffer = async ({
  address = '', // address of current user
  categoryId = 0,
  quantity = 1,
  price = 1,
  classId,
  tokenId = 0, // token id
  during = 0, // during block num ,need to be conver from timestamp
  cb,
}: submitOfferProps) => {
  try {
    const injector = await web3FromAddress(address);
    const currentBlockNumber = bnToBn(await (await PolkaSDK.getSaveInstance()).api.query.system.number());
    const durings = (60 * 60 * 24 * during) / 6;
    const commissionRate = 0;

    const priceAmount = (Number(price) * unitNum).toString();
    const call = (await PolkaSDK.getSaveInstance()).api.tx.nftmartOrder.submitOffer(
      NATIVE_CURRENCY_ID,
      priceAmount,
      currentBlockNumber.add(bnToBn(durings)),
      [[classId, tokenId, quantity]],
      commissionRate,
    );
    await call.signAndSend(address, { signer: injector.signer }, (result: any) => txLog(result, cb.success));
  } catch (error) {
    cb.error(error.toString());
  }
};
