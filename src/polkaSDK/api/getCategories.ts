import PolkaSDK from '..';

export const getCategories = async () => {
  let categories = await PolkaSDK.api.query.nftmart.categories.entries();
  categories = categories.map((category: any) => {
    let key = category[0];
    const data = category[1].unwrap();
    const len = key.length;
    key = key.buffer.slice(len - 4, len);
    const cateId = new Uint32Array(key)[0];
    const cate = data.toHuman();
    cate.id = cateId;
    cate.metadata = JSON.parse(cate.metadata);
    return cate;
  });

  return categories;
};
