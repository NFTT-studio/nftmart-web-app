import PolkaSDK from '..';
import { filterUnparsableClass } from '../utils/filterUnparsableClass';
import { mapClassToCollection } from '../utils/mapClassToCollection';

export const getClasses = async () => {
  const allClasses = await PolkaSDK.api.query.ormlNft.classes.entries();
  const data = await Promise.all(
    allClasses.map(async (c: any) => {
      let key = c[0];
      const len = key.length;
      key = key.buffer.slice(len - 4, len);
      const classId = new Uint32Array(key)[0];
      const clazz = c[1].toHuman();
      clazz.classId = classId;
      clazz.adminList = await PolkaSDK.api.query.proxy.proxies(clazz.owner);
      clazz.adminList = clazz.adminList.map((admin: any) => admin.toHuman());
      // classCount++;
      return clazz;
    }),
  );
  const result = data.filter(filterUnparsableClass).map(mapClassToCollection);
  return Promise.all(result);
};
