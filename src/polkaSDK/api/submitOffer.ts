import { web3FromAddress } from '@polkadot/extension-dapp';
import { bnToBn } from '@polkadot/util';

import PolkaSDK from '..';
import { NATIVE_CURRENCY_ID } from '../../constants';
import { txLog } from '../../utils/txLog';
import { unit } from '../utils/unit';

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
  classId = 0, // category id
  quantity = 1,
  price = 1,
  tokenId = 0, // token id
  during = oneMonth, // during block num ,need to be conver from timestamp
  cb,
}: submitOfferProps) => {
  try {
    const injector = await web3FromAddress(address);
    const currentBlockNumber = bnToBn(await PolkaSDK.api.query.system.number());

    const priceAmount = unit.mul(bnToBn(price));

    const call = PolkaSDK.api.tx.nftmartOrder.submitOffer(
      NATIVE_CURRENCY_ID,
      categoryId,
      priceAmount,
      currentBlockNumber.add(bnToBn(during)),
      [[classId, tokenId, quantity]],
    );
    await call.signAndSend(address, { signer: injector.signer }, (result: any) => txLog(result, cb.success));
  } catch (error) {
    cb.error(error.toString());
  }
};
