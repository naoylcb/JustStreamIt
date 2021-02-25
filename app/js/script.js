/* BEST MOVIE */
let bestMovieUrl;
const bestMovieTitle = document.querySelector("#best_movie h1");
const bestMovieDescription = document.querySelector("#best_movie p");
const bestMovieImage = document.querySelector("#best_movie img");

// API request to get movie information
fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score")
    .then(response => {
        if (response.ok) {
            response.json().then(data => {
                bestMovieUrl = data.results[0].url;
                fetch(bestMovieUrl)
                    .then(response => {
                        if (response.ok) {
                            response.json().then(bestMovieData => {
                                // Adding movie information to the DOM
                                bestMovieTitle.textContent = bestMovieData.original_title;
                                bestMovieDescription.textContent = bestMovieData.description;
                                bestMovieImage.src = bestMovieData.image_url;
                            });
                        }
                    });
            });
        }
    });

/* TOP RATED MOVIES BY CATEGORY */
const categories = new Map([
    ["#top_rated_movies div", "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score"],
    ["#romance div", "http://localhost:8000/api/v1/titles/?genre=romance&sort_by=-imdb_score"],
    ["#crime div", "http://localhost:8000/api/v1/titles/?genre=crime&sort_by=-imdb_score"],
    ["#fantasy div", "http://localhost:8000/api/v1/titles/?genre=fantasy&sort_by=-imdb_score"]
]);
let moviesDisplayed = new Map();


for (let category of categories) {
    const categoryDiv = document.querySelector(category[0]);
    let moviesImages = [];

    // API request to get the urls of the movies images
    fetch(category[1])
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    // Adding movies images urls of the first page to moviesImages
                    for (let movie of data.results) {
                        moviesImages.push(movie.image_url);
                        moviesDisplayed.set(movie.image_url, movie.url);
                    }

                    fetch(data.next)
                        .then(response => {
                            if (response.ok) {
                                response.json().then(data => {
                                    // Adding movies images urls of the second page to moviesImages
                                    for (let movie of data.results) {
                                        moviesImages.push(movie.image_url);
                                    }

                                    // Adding movies images to the DOM
                                    for (let i in moviesImages) {
                                        if (category[0] === "#top_rated_movies div") {
                                            if (i > 0 && i < 8) {
                                                const movieImage = document.createElement("img");
                                                movieImage.src = moviesImages[i];
                                                categoryDiv.appendChild(movieImage);
                                            }
                                        } else {
                                            if (i < 7) {
                                                const movieImage = document.createElement("img");
                                                movieImage.src = moviesImages[i];
                                                categoryDiv.appendChild(movieImage);
                                            }
                                        }
                                    }
                                });
                            }
                        });
                });
            }
        });
}

/* MODAL */
const modal = document.getElementById("movie_modal");
const modalContent = document.getElementById("modal_content");
const bestMovieButton = document.querySelector("#best_movie button");
const modalCloseButton = document.querySelector("#modal_content button");

bestMovieButton.addEventListener("click", function() {
    fetch(bestMovieUrl)
        .then(response => {
            if (response.ok) {
                response.json().then(bestMovieData => {
                    // Image
                    modalContent.children[1].src = bestMovieData.image_url;

                    // Title
                    modalContent.children[2].textContent = bestMovieData.original_title;
                    
                    // Genre, Date, Imdb score, Duration
                    let movieInformation = "";

                    for (let genre of bestMovieData.genres) {
                        movieInformation += genre + " / ";
                    }

                    movieInformation += bestMovieData.date_published + " / ";
                    movieInformation += "Score IMDB : " + bestMovieData.imdb_score + " / ";
                    movieInformation += "Durée : " + bestMovieData.duration + " min";
                    modalContent.children[3].textContent = movieInformation;
                    
                    // Synopsis
                    modalContent.children[4].textContent = "Résumé : " + bestMovieData.long_description;

                    // Rated
                    modalContent.children[5].textContent = "Rated : " + bestMovieData.rated;
                    
                    // Director(s)
                    let directors = "Réalisateur(s) : ";
                    for (let director of bestMovieData.directors) {
                        directors += director + " / ";
                    }
                    modalContent.children[6].textContent = directors;

                    // Actor(s)
                    let actors = "Acteur(s) : ";
                    for (let actor of bestMovieData.actors) {
                        actors += actor + " / ";
                    }
                    modalContent.children[7].textContent = actors;
                    
                    // Country(s)
                    let countries = "Pays d'origine : ";
                    for (let country of bestMovieData.countries) {
                        countries += country + " / ";
                    }
                    modalContent.children[8].textContent = countries;

                    // Box Office   
                    modalContent.children[9].textContent = "Box Office : " + bestMovieData.worldwide_gross_income;

                    modal.style.display = "block";
                });
            }
        });
});

modalCloseButton.addEventListener("click", function() {
    modal.style.display = "none";
});