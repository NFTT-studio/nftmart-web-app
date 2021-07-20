import PolkaSDK from '..';

export const getTimestamp = async () => {
  const res = await PolkaSDK.api.query.timestamp.now();
  return res;
};
