import PolkaSDK from '..';

export const getBalance = async (address: string) => {
  const { data: balance } = await (await PolkaSDK.getSaveInstance()).api.query.system.account(address);
  return balance;
};
