import PolkaSDK from '..';

export const getTax = async () => {
  const tax = await PolkaSDK.api.query.nftmartConf.platformFeeRate();
  return tax;
};
