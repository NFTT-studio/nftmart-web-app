import PolkaSDK from '..';
import { hexToUtf8 } from '../../utils/number';
import { filterUnparsableClass } from '../utils/filterUnparsableClass';
import { mapClassToCollection } from '../utils/mapClassToCollection';

export const queryClassByAddress = async ({ address = '' }) => {
  const allClasses = await PolkaSDK.api.query.ormlNft.classes.entries();

  const arr = allClasses.map(async (clz: any) => {
    let key = clz[0];
    const len = key.length;
    key = key.buffer.slice(len - 4, len);
    const classId = new Uint32Array(key)[0];
    const clazz = clz[1].toJSON();
    clazz.metadata = hexToUtf8(clazz.metadata.slice(2));
    clazz.classId = classId;
    clazz.adminList = await PolkaSDK.api.query.proxy.proxies(clazz.owner);

    const res = clazz.adminList[0].map((admin: any) => {
      const adminAddress = admin.delegate.toString();
      // console.log('cl', clazz);
      // console.log('check admin list', adminAddress, address);

      if (adminAddress === address) {
        return clazz;
      }
      return null;
    });
    return res.length > 0 ? res[0] : null;
  });
  const res = (await Promise.all(arr)).filter(filterUnparsableClass).map(mapClassToCollection);
  return Promise.all(res);
};
