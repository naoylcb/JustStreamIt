/*
** Get best movie's information and update the DOM
*/
const getBestMovie = async () => {
    const bestMovieTitle = document.querySelector("#best_movie h1");
    const bestMovieDescription = document.querySelector("#best_movie p");
    const bestMovieImage = document.querySelector("#best_movie img");

    // API request to get movie information
    const response = await fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score");
    if (response.ok) {
        const data = await response.json();
        const bestMovieUrl = data.results[0].url;
        const bestMovieResponse = await fetch(bestMovieUrl);

        if (bestMovieResponse.ok) {
            // Adding best movie information to the DOM
            const bestMovieData = await bestMovieResponse.json();
            bestMovieTitle.textContent = bestMovieData.original_title;
            bestMovieDescription.textContent = bestMovieData.description;
            bestMovieImage.src = bestMovieData.image_url;
            return bestMovieUrl;
        }
    }
}

/*
** Get top rated movies images by category and update the DOM
*/
const getTopRatedMovies = async () => {
    let moviesDisplayed = new Map();
    const categories = new Map([
        ["#top_rated_movies .movies", "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score"],
        ["#romance .movies", "http://localhost:8000/api/v1/titles/?genre=romance&sort_by=-imdb_score"],
        ["#crime .movies", "http://localhost:8000/api/v1/titles/?genre=crime&sort_by=-imdb_score"],
        ["#fantasy .movies", "http://localhost:8000/api/v1/titles/?genre=fantasy&sort_by=-imdb_score"]
    ]);
    
    for (let category of categories) {
        const categoryDiv = document.querySelector(category[0]);
        let moviesImages = [];
    
        // API request to get the urls of the movies images
        let response = await fetch(category[1]);
        if (response.ok) {
            let data = await response.json();
            // Adding movies images urls of the first page
            for (let movie of data.results) {
                moviesImages.push(movie.image_url);
                moviesDisplayed.set(movie.image_url, movie.url);
            }
            
            response = await fetch(data.next);
            if (response.ok) {
                data = await response.json();
                // Adding movies images urls of the second page
                for (let movie of data.results) {
                    moviesImages.push(movie.image_url);
                    moviesDisplayed.set(movie.image_url, movie.url);
                }

                // Adding movies images to the DOM
                for (let i in moviesImages) {
                    if (category[0] === "#top_rated_movies .movies") {
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
            }
        }
    }

    return moviesDisplayed;
}

/* MODAL */
const modal = (bestMovieUrl, moviesDisplayed) => {
    const modal = document.getElementById("movie_modal");
    const modalCloseButton = document.querySelector("#modal_content button");
    const moviesImages = document.querySelectorAll(".movies img");
    const bestMovieButton = document.querySelector("#best_movie button");

    for (let movieImage of moviesImages) {
        movieImage.addEventListener("click", function() {
            movieUrl = moviesDisplayed.get(movieImage.src)
            updateModal(movieUrl);
            modal.style.display = "block";
        });
    }

    bestMovieButton.addEventListener("click", function() {
        updateModal(bestMovieUrl);
        modal.style.display = "block";
    });

    modalCloseButton.addEventListener("click", function() {
        modal.style.display = "none";
    });
}

/* 
** Update the modal's content with movie's information
*/
const updateModal = async (movieUrl) => {
    const modalContent = document.getElementById("modal_content");

    const response = await fetch(movieUrl);
    if (response.ok) {
        const movieData = await response.json();
        // Image
        modalContent.children[1].src = movieData.image_url;

        // Title
        modalContent.children[2].textContent = movieData.original_title;

        // Genre, Date, Imdb score, Duration
        let information = "";
        for (let genre of movieData.genres) information += genre + " / ";
        information += movieData.date_published + " / ";
        information += "Score IMDB : " + movieData.imdb_score + " / ";
        information += "Durée : " + movieData.duration + " min";
        modalContent.children[3].textContent = information;
        
        // Synopsis
        modalContent.children[4].textContent = "Résumé : " + movieData.long_description;        
        
        // Director(s)
        let directors = "Réalisateur(s) : ";
        for (let director of movieData.directors) directors += director + " / ";
        modalContent.children[5].textContent = directors.slice(0, directors.length - 3); // Remove the last " / "

        // Actor(s)
        let actors = "Acteur(s) : ";
        for (let actor of movieData.actors) actors += actor + " / ";
        modalContent.children[6].textContent = actors.slice(0, actors.length - 3);
        
        // Country(s)
        let countries = "Pays d'origine : ";
        for (let country of movieData.countries) countries += country + " / ";
        modalContent.children[7].textContent = countries.slice(0, countries.length - 3);

        // Rated
        modalContent.children[8].textContent = "Rated : " + movieData.rated;

        // Box Office
        if (movieData.worldwide_gross_income == null) modalContent.children[9].textContent = "Box Office : Inconnu";
        else modalContent.children[9].textContent = "Box Office : " + movieData.worldwide_gross_income;
    }
}

const carousel = () => {
    const carouselButtons = document.querySelectorAll(".category button");

    let carousel;
    let imageIndex = 1;
    let translateX = 0;
    carouselButtons.forEach(button => {
        button.addEventListener("click", event => {
            if (event.target.id === "previous") {
                if (imageIndex !== 1) {
                    imageIndex--;
                    translateX += 888;
                }
                carousel = button.nextElementSibling;
            } else {
                if (imageIndex !== 2) {
                    imageIndex++;
                    translateX -= 888;
                }
                carousel = button.previousElementSibling;
            }

            carousel.style.transform = `translateX(${translateX}px)`;
        });
    });
}

const main = async () => {
    let bestMovieUrl = await getBestMovie();
    let moviesDisplayed = await getTopRatedMovies();
    modal(bestMovieUrl, moviesDisplayed);
    carousel();
}

main();