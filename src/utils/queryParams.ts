export const parseQueryParams = (params = {}) => {
  if (!Object.entries(params).length) return '';
  return Object.entries(params).reduce((acc, [key, value]) => {
    return key === 'filterQuery' ? acc + `${value}` : acc + `${key}=${value}&`;
  }, '?');
};
