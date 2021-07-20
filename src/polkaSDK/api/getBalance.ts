import PolkaSDK from '..';

export const getBalance = async (address: string) => {
  const { nonce, data: balance } = await PolkaSDK.api.query.system.account(address);
  return balance;
};
