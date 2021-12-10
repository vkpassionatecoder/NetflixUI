import {
  API_URL,
  API_KEY,
  fetchItemsAsync,
  IMAGE_BASE_URL,
  BACKDROP_SIZE,
} from "./config.js";

//Page Load #################################################################
const loader = document.querySelector(".loader");
document.addEventListener("DOMContentLoaded", () => {
  showLoader();
  // setTimeout(() => {
  getDataOnLoad();
  // }, 1500);
});

async function getDataOnLoad() {
  let allMovieRequests = [];
  const genresEndpoint = `${API_URL}genre/movie/list?api_key=${API_KEY}&language=en-US&page=1`;
  const genres = await fetchItemsAsync(genresEndpoint);
  const movieListDom = document.getElementById("movie-rows");
  movieListDom.innerHTML = "";
  genres.genres.forEach(async (genre, index) => {
    const x = `${API_URL}discover/movie?api_key=${API_KEY}&with_genres=${genre.id}&language=en-US&include_adult=false&page=1`;
    const moviesByGenres = await fetchItemsAsync(x);
    allMovieRequests.push(moviesByGenres);

    let html = `<div class= 'movie-container'>
    <div class = 'section-title'>${genre.name}</div>
    <div class="row"><span  class="arrow__btn left-arrow">‹</span>`;

    let movieHtml = moviesByGenres.results.map((movie) => {
      return `<div class='card'><img class="movie-poster" loading="lazy" 
      src= '${IMAGE_BASE_URL}${BACKDROP_SIZE}${movie.backdrop_path}' data-movieid=${movie.id}>
      <span class='movie-title'>${movie.title}<span>
      </div>`;
    });
    html += movieHtml;
    html += `<span  class="arrow__btn right-arrow">›</span></div> </div>`;

    movieListDom.innerHTML += html;
    if (index == genres.genres.length - 1) {
      Promise.all(allMovieRequests).then((data) => {
        hideLoader();
      });
      //How to get data if one api fails, Promise.allsettle, promise.any, promise.raise
      // book -exploring js
    }
  });
}

// Search Code #################################################################
let currentPage = 0;
let totalPages = 0;
var searchIcon = document.getElementsByClassName("search-box-icon")[0];
var searchBox = document.getElementsByClassName("search-box")[0];
let isSearch = false;
searchIcon.addEventListener("click", activateSearch);

function activateSearch() {
  searchBox.classList.toggle("active");
}

let searchMovies = document.getElementById("search-movies");
searchMovies.addEventListener(
  "keyup",
  debounceSearch(getMoviesFromSearch, 2000)
);

// To read more about closures
function debounceSearch(searchFunc, delay) {
  let timer;
  return function () {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      searchFunc();
    }, delay);
  };
}
const hideLoader = () => {
  loader.classList.remove("show");
};

const showLoader = () => {
  loader.classList.add("show");
};

function getMoviesFromSearch() {
  let query = document.getElementById("search-movies").value;
  if (query == "") {
    isSearch = false;
    getDataOnLoad();
    return;
  }
  const movieListDom = document.getElementById("movie-rows");
  movieListDom.innerHTML = "";
  currentPage = 1;
  isSearch = true;
  showLoader();
  setTimeout(async () => {
    try {
      const endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${query}&include_adult=false&page=1`;
      const movies = await fetchItemsAsync(endpoint);
      totalPages = movies.total_pages;

      let searchHtml = "";

      let index = 0;
      let j;
      for (; index < movies.results.length; index++) {
        let searchRow = `<div class= 'search-container'><div class="search-row">`;
        for (j = index; j < index + 4; j++) {
          searchRow += `<div class='card'><img  loading="lazy" src= '${IMAGE_BASE_URL}${BACKDROP_SIZE}${movies.results[j].backdrop_path}' onerror="this.onerror=null; this.src='./img/No-Image.png'">
          <span class='movie-title'>${movies.results[j].title}<span>
          </div>`;
        }
        index = j - 1;
        searchRow += "</div></div>";
        searchHtml += searchRow;
      }
      movieListDom.innerHTML = searchHtml;
      console.log(movies);
    } catch (error) {
      console.log(error.message);
    } finally {
      hideLoader();
    }
  }, 1000);
}
//Infinite Scrolling ##############################
function onInfiniteScroll() {
  const movieListDom = document.getElementById("movie-rows");
  let query = document.getElementById("search-movies").value;
  if (totalPages == 0 || currentPage < totalPages) {
    currentPage++;
    showLoader();
    setTimeout(async () => {
      try {
        const endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${query}&include_adult=false&page=${currentPage}`;
        const movies = await fetchItemsAsync(endpoint);
        if (totalPages == 0) {
          totalPages = movies.total_pages;
        }
        let searchHtml = "";

        let index = 0;
        let j;
        for (; index < movies.results.length; index++) {
          let searchRow = `<div class= 'search-container'><div class="search-row">`;
          for (j = index; j < index + 4; j++) {
            searchRow += `<div class='card'><img loading="lazy" src= '${IMAGE_BASE_URL}${BACKDROP_SIZE}${movies.results[j].backdrop_path}' onerror="this.onerror=null; this.src='./img/No-Image.png'">
            <span class='movie-title'>${movies.results[j].title}<span>
            </div>`;
          }
          index = j - 1;
          searchRow += "</div></div>";
          searchHtml += searchRow;
        }
        movieListDom.innerHTML += searchHtml;
        console.log(movies);
      } catch (error) {
        console.log(error.message);
      } finally {
        hideLoader();
      }
    }, 1000);
  }
}
// window.addEventListener(
//   "scroll",
//   () => {
//     const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
//     if (scrollTop + clientHeight > scrollHeight - 5 && isSearch) {
//       onInfiniteScroll();
//     }
//   },
//   { passive: true }
// );

document.querySelector("#movie-rows").addEventListener("click", (e) => {
  const target = e.target;
  if ((target.className = "movie-poster")) {
    const movieid = target.dataset.movieid;
    window.location.href = `/moviedetail.html?movie=${movieid}`;
  }
});
let options = {
  root: null,
  rootMargin: "0px",
  threshold: 1.0,
};
const movieListDom = document.getElementById("movie-rows");
function handleIntersection(entries) {
  if (
    entries[0].intersectionRatio > 0 &&
    isSearch &&
    movieListDom.hasChildNodes
  )
    onInfiniteScroll();
}

let observer = new IntersectionObserver(handleIntersection, options);
let target = document.querySelector("footer");
observer.observe(target);
