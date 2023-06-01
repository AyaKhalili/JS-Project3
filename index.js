const { displayCatalog, addMovie, updateMovie, deleteMovie, searchMovies, filterMovies, fetchMovies } = require('./movieManager');

// Main menu
const mainMenu = async () => {
  console.log('Welcome to the Movie Catalog CLI!');
  console.log('==================================\n');

  while (true) {
    const { choice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: [
          'Display Movie Catalog',
          'Add New Movie',
          'Update Movie Details',
          'Delete Movie',
          'Search Movies',
          'Filter Movies',
          'Fetch Movie Data',
          'Exit',
        ],
      },
    ]);

    switch (choice) {
      case 'Display Movie Catalog':
        await displayCatalog();
        break;
      case 'Add New Movie':
        await addMovie();
        break;
      case 'Update Movie Details':
        await updateMovie();
        break;
      case 'Delete Movie':
        await deleteMovie();
        break;
      case 'Search Movies':
        await searchMovies();
        break;
      case 'Filter Movies':
        await filterMovies();
        break;
      case 'Fetch Movie Data':
        await fetchMovies();
        break;
      case 'Exit':
        console.log('Thank you for using the Movie Catalog CLI!');
        return;
    }
  }
};

// Start the CLI application
mainMenu();
