import PolkaSDK from '..';

export const getTax = async () => {
  const tax = await (await PolkaSDK.getSaveInstance()).api.query.nftmartConf.platformFeeRate();
  return tax;
};
