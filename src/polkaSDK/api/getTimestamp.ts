import PolkaSDK from '..';

export const getTimestamp = async () => {
  const res = await (await PolkaSDK.getSaveInstance()).api.query.timestamp.now();
  return res;
};
