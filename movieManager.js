const fs = require('fs');
const axios = require('axios');
const inquirer = require('inquirer');

const MOVIES_FILE = 'movies.json';

// Load movie catalog from the JSON file
const loadMovies = () => {
  try {
    const data = fs.readFileSync(MOVIES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Save movie catalog to the JSON file
const saveMovies = (movies) => {
  fs.writeFileSync(MOVIES_FILE, JSON.stringify(movies, null, 2), 'utf8');
};

// Display movie catalog
const displayCatalog = async () => {
  const movies = loadMovies();
  console.log('Movie Catalog:\n');
  movies.forEach((movie) => {
    console.log(`Title: ${movie.title}`);
    console.log(`Director: ${movie.director}`);
    console.log(`Release Year: ${movie.releaseYear}`);
    console.log(`Genre: ${movie.genre}`);
    console.log('------------------------');
  });
  console.log();
};

// Add a new movie to the catalog
const addMovie = async () => {
  const { title, director, releaseYear, genre } = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title of the movie:',
    },
    {
      type: 'input',
      name: 'director',
      message: 'Enter the director of the movie:',
    },
    {
      type: 'input',
      name: 'releaseYear',
      message: 'Enter the release year of the movie:',
    },
    {
      type: 'input',
      name: 'genre',
      message: 'Enter the genre of the movie:',
    },
  ]);

  const movies = loadMovies();
  const newMovie = { title, director, releaseYear, genre };
  movies.push(newMovie);
  saveMovies(movies);
  console.log('New movie added successfully!\n');
};

// Update details of a specific movie
const updateMovie = async () => {
  const movies = loadMovies();
  if (movies.length === 0) {
    console.log('No movies available in the catalog.\n');
    return;
  }

  const { movieIndex } = await inquirer.prompt([
    {
      type: 'list',
      name: 'movieIndex',
      message: 'Select a movie to update:',
      choices: movies.map((movie, index) => ({ name: movie.title, value: index })),
    },
  ]);

  const { title, director, releaseYear, genre } = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the new title of the movie:',
      default: movies[movieIndex].title,
    },
    {
      type: 'input',
      name: 'director',
      message: 'Enter the new director of the movie:',
      default: movies[movieIndex].director,
    },
    {
      type: 'input',
      name: 'releaseYear',
      message: 'Enter the new release year of the movie:',
      default: movies[movieIndex].releaseYear,
    },
    {
      type: 'input',
      name: 'genre',
      message: 'Enter the new genre of the movie:',
      default: movies[movieIndex].genre,
    },
  ]);

  const updatedMovie = { title, director, releaseYear, genre };
  movies[movieIndex] = updatedMovie;
  saveMovies(movies);
  console.log('Movie details updated successfully!\n');
};

// Delete a movie from the catalog
const deleteMovie = async () => {
  const movies = loadMovies();
  if (movies.length === 0) {
    console.log('No movies available in the catalog.\n');
    return;
  }

  const { movieIndex } = await inquirer.prompt([
    {
      type: 'list',
      name: 'movieIndex',
      message: 'Select a movie to delete:',
      choices: movies.map((movie, index) => ({ name: movie.title, value: index })),
    },
  ]);

  movies.splice(movieIndex, 1);
  saveMovies(movies);
  console.log('Movie deleted successfully!\n');
};

// Search movies by title, director, or genre
const searchMovies = async () => {
  const movies = loadMovies();
  if (movies.length === 0) {
    console.log('No movies available in the catalog.\n');
    return;
  }

  const { searchQuery } = await inquirer.prompt([
    {
      type: 'input',
      name: 'searchQuery',
      message: 'Enter a title, director, or genre to search for:',
    },
  ]);

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredMovies.length === 0) {
    console.log('No matching movies found.\n');
  } else {
    console.log('Matching Movies:\n');
    filteredMovies.forEach((movie) => {
      console.log(`Title: ${movie.title}`);
      console.log(`Director: ${movie.director}`);
      console.log(`Release Year: ${movie.releaseYear}`);
      console.log(`Genre: ${movie.genre}`);
      console.log('------------------------');
    });
    console.log();
  }
};

// Filter movies by genre or release year
const filterMovies = async () => {
  const movies = loadMovies();
  if (movies.length === 0) {
    console.log('No movies available in the catalog.\n');
    return;
  }

  const { filterType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'filterType',
      message: 'Choose a filter type:',
      choices: ['Genre', 'Release Year'],
    },
  ]);

  if (filterType === 'Genre') {
    const { genreFilter } = await inquirer.prompt([
      {
        type: 'input',
        name: 'genreFilter',
        message: 'Enter a genre to filter movies:',
      },
    ]);

    const filteredMovies = movies.filter((movie) =>
      movie.genre.toLowerCase().includes(genreFilter.toLowerCase())
    );

    if (filteredMovies.length === 0) {
      console.log('No movies found for the specified genre.\n');
    } else {
      console.log('Filtered Movies:\n');
      filteredMovies.forEach((movie) => {
        console.log(`Title: ${movie.title}`);
        console.log(`Director: ${movie.director}`);
        console.log(`Release Year: ${movie.releaseYear}`);
        console.log(`Genre: ${movie.genre}`);
        console.log('------------------------');
      });
      console.log();
    }
  } else if (filterType === 'Release Year') {
    const { releaseYearFilter } = await inquirer.prompt([
      {
        type: 'input',
        name: 'releaseYearFilter',
        message: 'Enter a release year to filter movies:',
      },
    ]);

    const filteredMovies = movies.filter((movie) => movie.releaseYear === releaseYearFilter);

    if (filteredMovies.length === 0) {
      console.log('No movies found for the specified release year.\n');
    } else {
      console.log('Filtered Movies:\n');
      filteredMovies.forEach((movie) => {
        console.log(`Title: ${movie.title}`);
        console.log(`Director: ${movie.director}`);
        console.log(`Release Year: ${movie.releaseYear}`);
        console.log(`Genre: ${movie.genre}`);
        console.log('------------------------');
      });
      console.log();
    }
  }
};
/*
// Fetch movies from an API and add them to the catalog
const fetchMovies = async () => {
  const { searchQuery } = await inquirer.prompt([
    {
      type: 'input',
      name: 'searchQuery',
      message: 'Enter a search query to fetch movies:',
    },
  ]);

  try {
    const response = await axios.get(`http://api.example.com/movies?q=${searchQuery}`);
    const movies = response.data.results.map((movie) => ({
      title: movie.title,
      director: movie.director,
      releaseYear: movie.releaseYear,
      genre: movie.genre,
    }));

    const existingMovies = loadMovies();
    const updatedMovies = [...existingMovies, ...movies];
    saveMovies(updatedMovies);

    console.log('Movies fetched and added to the catalog successfully!\n');
  } catch (error) {
    console.log('Error fetching movies:', error.message, '\n');
  }
};
*/
// Fetch movies from the OMDB API and add them to the catalog
const fetchMovies = async () => {
    const { searchQuery } = await inquirer.prompt([
      {
        type: 'input',
        name: 'searchQuery',
        message: 'Enter a search query to fetch movies:',
      },
    ]);
  
    try {
      const response = await axios.get(`http://www.omdbapi.com/?s=${encodeURIComponent(searchQuery)}&apikey=c142ea0`);
      const movies = response.data.Search.map((movie) => ({
        title: movie.Title,
        director: movie.Director,
        releaseYear: movie.Year,
        genre: movie.Genre,
      }));
  
      const existingMovies = loadMovies();
      const updatedMovies = [...existingMovies, ...movies];
      saveMovies(updatedMovies);
  
      console.log('Movies fetched and added to the catalog successfully!\n');
    } catch (error) {
      console.log('Error fetching movies:', error.message, '\n');
    }
  };
  
module.exports = {
  displayCatalog,
  addMovie,
  updateMovie,
  deleteMovie,
  searchMovies,
  filterMovies,
  fetchMovies,
};
