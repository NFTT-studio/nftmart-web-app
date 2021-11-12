/* eslint-disable @typescript-eslint/no-explicit-any */
import { encodeAddress } from '@polkadot/util-crypto';
import PolkaSDK from '..';

export const getWhiteList = async () => {
  const whiteList = (await (await PolkaSDK.getSaveInstance()).api.query.nftmartConf.accountWhitelist.entries()) || [];
  const whiteListStringArr = whiteList.map((user: any) => {
    let key = user[0];
    const len = key.length;
    key = key.buffer.slice(len - 32, len);
    const addr = encodeAddress(new Uint8Array(key), 12191);
    return addr;
  });

  return whiteListStringArr;
};
