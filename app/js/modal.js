/* MODAL */
const modal = () => {
    const modal = document.getElementById("movie_modal");
    const modalCloseButton = document.querySelector("#modal_content button");
    const moviesImages = document.querySelector(".movies img");
    const bestMovieButton = document.querySelector("#best_movie button");
    console.log(moviesImages);
    /*moviesImages.addEventListener("click", function() {
        movieUrl = moviesDisplayed.get(movieImage.src)
        updateModal(movieUrl);
        modal.style.display = "block";
    });*/
    /*for (let movieImage of moviesImages) {
        movieImage.addEventListener("click", function() {
            movieUrl = moviesDisplayed.get(movieImage.src)
            updateModal(movieUrl);
            modal.style.display = "block";
        });
    }*/

    bestMovieButton.addEventListener("click", function() {
        updateModal(bestMovieUrl);
        modal.style.display = "block";
    });

    modalCloseButton.addEventListener("click", function() {
        modal.style.display = "none";
    });
}

/* 
** Update the modal's content with movie information
*/
const updateModal = (movieUrl) => {
    const modalContent = document.getElementById("modal_content");

    fetch(movieUrl)
        .then(response => {
            if (response.ok) {
                response.json().then(movieData => {
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
                });
            }
        });
}

modal();