import {
  API_URL,
  API_KEY,
  fetchItemsAsync,
  IMAGE_BASE_URL,
  BACKDROP_SIZE,
} from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  //showLoader();
  setTimeout(() => {
    getMovieDetailOnLoad();
  }, 1500);
});

async function getMovieDetailOnLoad() {
  const movieid = window.location.search.split("=")[1];
  const movieendpoint = `${API_URL}movie/${movieid}?api_key=${API_KEY}&language=en-US`;
  let movie = await fetchItemsAsync(movieendpoint);
  const imgElement = document.createElement("img");
  imgElement.setAttribute(
    "src",
    `${IMAGE_BASE_URL}${BACKDROP_SIZE}${movie.backdrop_path}`
  );
  imgElement.className = "movie-details-image";
  const el = document.getElementById("moviedetailphoto");
  el.appendChild(imgElement);
  console.log(movie);

  // bind data
  document.getElementById("movie-name").textContent = movie.title;
  document.getElementById("overview").textContent = movie.overview;
  document.getElementById("time").textContent = `${movie.runtime} min -`;
  document.getElementById("releasedate").textContent = `${movie.release_date}`;
  let genres = "";
  for(let genre of movie.genres){
    genres+= genre.name + ' | ';
  }
  document.getElementById("genres").textContent = `${genres}`;
  document.getElementById("star").textContent = `${movie.vote_average}`;
  document.getElementById("ratings").textContent = `${movie.vote_average}/10`;
  document.getElementById("reviews").textContent = `${movie.vote_count} users`;
  document.getElementById("releaseyear").textContent = `(${movie.release_date.split('-')[0]})`;
}
const hideLoader = () => {
  loader.classList.remove("show");
};

const showLoader = () => {
  loader.classList.add("show");
};
