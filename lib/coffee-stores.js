const getUrlForCoffeeStores = (query, latLong, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};
const fetchCoffeeStores = async () => {
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
  console.log(results);
  return results;
  // .catch((err) => console.error(err));
};
export default fetchCoffeeStores;
