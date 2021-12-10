const API_URL = "https://api.themoviedb.org/3/";
const API_KEY = "33949e951ef79e9487d72ee006ef7f98";

const IMAGE_BASE_URL = "http://image.tmdb.org/t/p/";

const BACKDROP_SIZE = "w780";
const POSTER_SIZE = "w500";
const fetchItems = (endpoint) => {
  return fetch(endpoint).then((res) => res.json());
};

const fetchItemsAsync = async (endpoint) => {
  let res = await fetch(endpoint);
  return res.json();
  // Implement this in async await way. Read more about promises
};
export {
  API_URL,
  API_KEY,
  IMAGE_BASE_URL,
  BACKDROP_SIZE,
  POSTER_SIZE,
  fetchItems,
  fetchItemsAsync,
};
