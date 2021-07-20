import PolkaSDK from '..';

export const getAllOrders = async () => {
  const allOrders = await PolkaSDK.api.query.nftmart.orders.entries();

  const arr = allOrders.map(async (order: any) => {
    const key = order[0];
    const keyLen = key.length;
    const orderOwner = PolkaSDK.keyring.encodeAddress(new Uint8Array(key.buffer.slice(keyLen - 32, keyLen)));

    const classId = new Uint32Array(key.slice(keyLen - 4 - 8 - 32 - 16, keyLen - 8 - 32 - 16))[0];
    const tokenIdRaw = new Uint32Array(key.slice(keyLen - 8 - 32 - 16, keyLen - 32 - 16));

    const tokenIdLow32 = tokenIdRaw[0];
    // const tokenIdHigh32 = tokenIdRaw[1];
    const tokenId = tokenIdLow32;
    let nft: any = await PolkaSDK.api.query.ormlNft.tokens(classId, tokenId);
    if (nft.isSome) {
      nft = nft.unwrap().toHuman();
    }

    const data = order[1].toHuman();
    data.orderOwner = orderOwner;
    data.classId = classId;
    data.tokenId = tokenId;
    data.nft = nft;

    return data;
  });
  const orders = await Promise.all(arr);
  return orders;
};
