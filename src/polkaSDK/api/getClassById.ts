import PolkaSDK from '..';
import { hexToUtf8 } from '../../utils/number';

export const getClassById = async (id: string) => {
  const res = await PolkaSDK.api.query.ormlNft.classes(id); // todo metadata parse
  // todo query creator
  const clazz = JSON.parse(res.toString());
  const adminList = await PolkaSDK.api.query.proxy.proxies(clazz.owner); // query adminList of class
  clazz.adminList = JSON.parse(adminList.toString());
  // console.log(clazz);
  clazz.metadata = JSON.parse(hexToUtf8(clazz.metadata));
  return clazz;
};
