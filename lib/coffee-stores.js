import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (query, latLong, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};
const getListOfCoffeeStorePhotos = async (limit) => {
  const photos = await unsplash.search.getPhotos({
    query: "coffee shop",
    page: 1,
    perPage: limit,
  });
  const results = await photos.response.results;
  return results.map((result) => result.urls["small"]);
};
const fetchCoffeeStores = async (
  latLong = "40.868192,29.127591",
  limit = 6
) => {
  const photos = await getListOfCoffeeStorePhotos(limit);
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };
  const response = await fetch(
    getUrlForCoffeeStores("coffee", latLong, limit),
    options
  );
  const { results } = await response.json();
  console.log(results);
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
