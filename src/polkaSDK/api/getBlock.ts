import PolkaSDK from '..';

export const getBlock = async () => {
  const block = await PolkaSDK.api.rpc.chain.getBlock();
  return block.block.header.number.toNumber();
};
