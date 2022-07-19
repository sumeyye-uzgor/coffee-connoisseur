import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (query, latLong, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};
const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "coffee shop",
    page: 1,
    perPage: 10,
  });
  const results = await photos.response.results;
  return results.map((result) => result.urls["small"]);
};
const fetchCoffeeStores = async () => {
  const photos = await getListOfCoffeeStorePhotos();
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.FOURSQUARE_API_KEY,
    },
  };
  const response = await fetch(
    getUrlForCoffeeStores("coffee", "40.868192%2C29.127591", 6),
    options
  );
  const { results } = await response.json();
  const photoResults = results.map((result, idx) => ({
    id: result.fsq_id,
    address: result.location.address,
    neighborhood: result.location.neighborhood
      ? result.location?.neighborhood
      : "",
    name: result.name,
    imgUrl: photos.length > 0 ? photos[idx] : null,
  }));
  return photoResults;
  // .catch((err) => console.error(err));
};
export default fetchCoffeeStores;
