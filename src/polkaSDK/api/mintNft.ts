/* eslint-disable @typescript-eslint/no-explicit-any */
import { web3FromAddress } from '@polkadot/extension-dapp';
import PolkaSDK from '..';
import { txLog } from '../../utils/txLog';
import { nftDeposit } from './nftDeposit';

type mintNftProps = {
  address: string,
  classId: number,
  metadata: Metadata,
  quantity: number,
  cb: Callback
}
export const mintNft = async ({
  address = '',
  classId = 0,
  metadata,
  quantity = 1,
  cb,
}: mintNftProps) => {
  try {
    const injector = await web3FromAddress(address);
    const metadataStr = JSON.stringify(metadata);

    const balancesNeeded = await nftDeposit(metadataStr);
    if (balancesNeeded === null) return null;
    const classInfo: any = await PolkaSDK.api.query.ormlNft.classes(classId);
    if (!classInfo.isSome) {
      // console.log('classInfo not exist');
      return null;
    }

    const ownerOfClass = classInfo.unwrap().owner.toString();
    const needToChargeRoyalty = null;
    const txs = [
      PolkaSDK.api.tx.balances.transfer(ownerOfClass, balancesNeeded),
      PolkaSDK.api.tx.proxy.proxy(
        ownerOfClass,
        null,
        PolkaSDK.api.tx.nftmart.mint(address, classId, metadataStr, quantity, needToChargeRoyalty),
      ),
    ];

    const batchExtrinsic = PolkaSDK.api.tx.utility.batchAll(txs);
    const res = await batchExtrinsic.signAndSend(
      address,
      { signer: injector.signer },
      (result: any) => txLog(result, cb.success),
    );
    return res;
  } catch (error) {
    cb.error(error.toString());
    return null;
  }
};
