import PolkaSDK from '..';

export const getBlock = async () => {
  const block = await (await PolkaSDK.getSaveInstance()).api.rpc.chain.getBlock();
  return block.block.header.number.toNumber();
};
