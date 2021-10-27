/* eslint-disable @typescript-eslint/no-explicit-any */
import { web3FromAddress } from '@polkadot/extension-dapp';
import PolkaSDK from '..';
import { txLog } from '../../utils/txLog';
import { nftDeposit } from './nftDeposit';

function float2PerU16(x) {
  return Math.trunc(x * 65535.0);
}

type mintNftProps = {
  address: string | undefined,
  classId: number,
  metadata: Metadata,
  quantity: number,
  royaltyRate: string | undefined,
  cb: Callback
}
export const mintNft = async ({
  address = '',
  classId,
  metadata,
  quantity = 1,
  royaltyRate,
  cb,
}: mintNftProps) => {
  try {
    const injector = await web3FromAddress(address);
    const metadataStr = JSON.stringify(metadata);
    const balancesNeeded = await nftDeposit(metadataStr);
    if (balancesNeeded === null) {
      cb.error('error');
      return null;
    }
    const classInfo: any = await PolkaSDK.api.query.ormlNft.classes(classId);
    if (!classInfo.isSome) {
      cb.error('error');
      return null;
    }
    const ownerOfClass = classInfo.unwrap().owner.toString();
    // eslint-disable-next-line camelcase
    const royalty_rate = float2PerU16(royaltyRate);
    const txs = [
      PolkaSDK.api.tx.balances.transfer(ownerOfClass, balancesNeeded),
      PolkaSDK.api.tx.proxy.proxy(
        ownerOfClass,
        null,
        PolkaSDK.api.tx.nftmart.mint(address, classId, metadataStr, quantity, royalty_rate),
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
