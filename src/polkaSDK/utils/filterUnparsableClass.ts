export const filterUnparsableClass = (clazz: any) => {
  try {
    // FIXME: there some error in the backend, which miss { at the start of the string
    const originalString = clazz.metadata.trim().startsWith('{')
      ? clazz.metadata
      : `{ ${clazz.metadata}`;
    JSON.parse(originalString);
    return true;
  } catch (e) {
    return false;
  }
};
