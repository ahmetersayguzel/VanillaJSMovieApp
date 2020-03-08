class Movie {
    constructor(title, description, image) {
        this.movieId = Math.floor(Math.random() * 10000);
        this.title = title;
        this.description = description;
        this.image = image;
    }
}

class UI {
    addMovieToList(movie) {
        const list = document.getElementById("movie-list");

        var html = `
            <tr>
                <td><img src="img/${movie.image}" class="img-thumbnail"/></td>
                <td>${movie.title}</td>
                <td>${movie.description}</td>
                <td><a href="#" data-id="${movie.movieId}" class="btn btn-danger btn-sm delete">Delete</a></td>
            </tr>
        `;

        list.innerHTML += html;
    }

    clearControls() {
        const title = document.getElementById("title").value = "";
        const description = document.getElementById("description").value = "";
        const image = document.getElementById("image").value = "";
    }

    deleteMovie(elem) {
        if (elem.classList.contains("delete")) {
            elem.parentElement.parentElement.remove();
            return true;
        }
    }

    showAlert(msg, className) {
        var alert = `
        <div class="alert alert-${className}">
            ${msg}
        </div>
    `;

        const row = document.querySelector(".row");
        row.insertAdjacentHTML("beforeBegin", alert);

        setTimeout(() => {
            document.querySelector(".alert").remove();
        }, 3000);
    }
}

class Storage {

    static getMovies() {
        let movies;

        if (localStorage.getItem("movies") === null) {
            movies = [];
        } else {
            movies = JSON.parse(localStorage.getItem("movies"));
        }

        return movies;
    }

    static displayMovies() {
        const movies = Storage.getMovies();

        movies.forEach(movie => {
            const ui = new UI();
            ui.addMovieToList(movie);
        });
    }

    static addMovie(movie) {
        const movies = Storage.getMovies();
        movies.push(movie);
        localStorage.setItem("movies", JSON.stringify(movies));
    }

    static deleteMovie(elem) {
        if (elem.classList.contains("delete")) {
            const id = elem.getAttribute("data-id");

            const movies = Storage.getMovies();

            movies.forEach((movie, index) => {
                if (movie.movieId == id) {
                    movies.splice(index, 1);
                }
            });

            localStorage.setItem("movies", JSON.stringify(movies));
        }
    }
}

document.addEventListener("DOMContentLoaded", Storage.displayMovies);

document.getElementById("new-movie").addEventListener("submit", (e) => {

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const image = document.getElementById("image").value;

    const movie = new Movie(title, description, image);

    const ui = new UI();

    if (title === "" || description === "" || image === "") {
        ui.showAlert("Please complete the form", "warning");
    } else {
        ui.addMovieToList(movie);

        Storage.addMovie(movie);

        ui.clearControls();

        ui.showAlert("The movie has been added", "success");
    }
    e.preventDefault();
});

document.getElementById("movie-list").addEventListener("click", (e) => {
    const ui = new UI();
    if (ui.deleteMovie(e.target) == true) {
        Storage.deleteMovie(e.target);
        ui.showAlert("The movie has been deleted", "danger");
    }
});