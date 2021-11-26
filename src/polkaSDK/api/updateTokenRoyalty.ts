import { web3FromAddress } from '@polkadot/extension-dapp';

import PolkaSDK from '..';
import { txLog } from '../../utils/txLog';

type burnTokenProps = {
  classId: number,
  address: string,
  tokenId: number,
  royalties: number,
  cb: Callback
}
export const updateTokenRoyalty = async ({
  classId,
  address, // address of current user
  tokenId,
  royalties,
  cb,
}: burnTokenProps) => {
  try {
    const injector = await web3FromAddress(address);
    await (await PolkaSDK.getSaveInstance()).api.tx.nftmart
      .updateTokenRoyalty(
        classId,
        tokenId,
        royalties,
      )
      .signAndSend(address, { signer: injector.signer }, (result: any) => txLog(result, cb.success));
  } catch (error) {
    cb.error(error.toString());
  }
};
