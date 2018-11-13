export const classNames = (classNames: Array<[string, boolean]>) => {
  return classNames
    .filter(item => item[1])
    .map(item => item[0])
    .join(' ');
};
