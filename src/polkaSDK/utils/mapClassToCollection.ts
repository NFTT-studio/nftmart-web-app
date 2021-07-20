import { omit } from 'ramda';
import { ClassMetadata } from '../types/ClassMetadata';

export const mapClassToCollection = async (clazz: any) => {
  // FIXME: there some error in the backend, which miss { at the start of the string
  const originalString = clazz.metadata.trim().startsWith('{')
    ? clazz.metadata
    : `{ ${clazz.metadata}`;
  const metadata: ClassMetadata = JSON.parse(originalString);
  const collection = omit(['data', 'metadata', 'classId', 'totalIssuance'], clazz);

  return {
    ...collection,
    ...metadata,
    classId: clazz.classId ?? clazz.classID,
    id: clazz.classId ?? clazz.classID,
    totalIssuance: Number(clazz.totalIssuance),
  };
};
