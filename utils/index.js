export const isEmpty = (obj) => {
  if (obj) {
    return Object.keys(obj).length === 0;
  } else {
    return true;
  }
};
export const fetcher = (url) => fetch(url).then((res) => res.json());
