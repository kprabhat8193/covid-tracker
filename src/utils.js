export const sortData = (data, attribute) => {
  return data.sort((a, b) => b[attribute] - a[attribute]);
};
