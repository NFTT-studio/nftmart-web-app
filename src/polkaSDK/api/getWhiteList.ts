/* eslint-disable @typescript-eslint/no-explicit-any */
import PolkaSDK from '..';

export const getWhiteList = async () => {
  const whiteList = (await PolkaSDK.api.query.nftmartConf.accountWhitelist.entries()) || [];
  const whiteListStringArr = whiteList.map((user: any) => {
    let key = user[0];
    const len = key.length;
    key = key.buffer.slice(len - 32, len);
    const addr = PolkaSDK.keyring.encodeAddress(new Uint8Array(key));
    return addr;
  });

  return whiteListStringArr;
};
