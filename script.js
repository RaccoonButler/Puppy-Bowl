// Get the HTML element that represents the container for all players and the form to add new players
const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2306-FTB-ET-WEB-FT';
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

/**
 * Function to fetch all players from the API and return them
 */
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(APIURL + 'players');
    const data = await response.json();
    return data.data.players; // Extract the players data from the response
  } catch (err) {
    console.error('Uh oh, trouble fetching players!', err);
  }
};


 //Function to unhide player details when "See Details" button is clicked
const togglePlayerDetails = (playerCard) => {
  const detailsBtn = playerCard.querySelector('.details-btn');
  const breedInfo = playerCard.querySelector('.breed-info');
  const statusInfo = playerCard.querySelector('.status-info');

  detailsBtn.addEventListener('click', () => {
    breedInfo.classList.toggle('hidden');
    statusInfo.classList.toggle('hidden');
  });
};

//Fetches single player from API based on ID, displays error when it doesn't work
const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(APIURL + `players/${playerId}`);
    const data = await response.json();
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};
//Adds new player to API, displays error when it doesn't work
const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(APIURL + 'players', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerObj),
    });
    const data = await response.json();
    console.log('Player added successfully:', data.data);
  } catch (err) {
    console.error('Oops, something went wrong with adding that player!', err);
  }
};

//Removes player from roster, then updates the player list
const removePlayer = async (playerId) => {
  try {
    const response = await fetch(APIURL + `players/${playerId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    console.log('Player removed from roster:', data.data);
    //Fetches and re-renders the player list to reflect the changes, shows error if it doesn't work
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
  } catch (err) {
    console.error(`Whoops, trouble removing player #${playerId} from the roster!`, err);
  }
};

/**
 * Function to render all players by creating HTML elements for each player and appending them to the DOM.
 * It also adds event listeners for the "See Details" and "Remove from Roster" buttons.
 * @param {Array} playerList - An array of player objects.
 */
const renderAllPlayers = (playerList) => {
  try {
    playerContainer.innerHTML = ''; // Clears current players before rendering new ones

    for (const player of playerList) {
      // Create a new div element to hold the player information
      const playerCard = document.createElement('div');
      playerCard.classList.add('player-card');

      // HTML for the player cards
      playerCard.innerHTML = `
        <img src="${player.imageUrl}" alt="${player.name}">
        <h3>${player.name}</h3>
        <p class="breed-info hidden">Breed: ${player.breed}</p>
        <p class="status-info hidden">Status: ${player.status}</p>
        <button class="details-btn">See Details</button>
        <button class="remove-btn" data-id="${player.id}">Remove from Roster</button>
      `;

      // Add event listeners for the "See Details" and "Remove from Roster" buttons
      const detailsBtn = playerCard.querySelector('.details-btn');
      detailsBtn.addEventListener('click', () => {
        fetchSinglePlayer(player.id);
      });

      const removeBtn = playerCard.querySelector('.remove-btn');
      removeBtn.addEventListener('click', () => {
        removePlayer(player.id);
      });

      // Add event listener to the "See Details" button
      togglePlayerDetails(playerCard);

      // Append player card to the playerContainer
      playerContainer.appendChild(playerCard);
    }
  } catch (err) {
    console.error('Uh oh, trouble rendering players!', err);
  }
};

/**
 * Function to render the form to add a new player with input fields and a submit button.
 * also adds an event listener to the "Add Player" button
 */
const renderNewPlayerForm = () => {
  try {
    newPlayerFormContainer.innerHTML = `
      <h2>Add New Player</h2>
      <h5>The new player will be the last in the lineup</h5>
      <input type="text" id="player-name" placeholder="Name" />
      <input type="text" id="player-breed" placeholder="Breed" />
      <input type="text" id="player-status" placeholder="Status" />
      <input type="text" id="player-image" placeholder="Image URL" />
      <button id="add-player-btn">Add Player</button>
    `;

    const addPlayerBtn = document.getElementById('add-player-btn');
    addPlayerBtn.addEventListener('click', () => {
      // Get the values from the input fields
      const playerName = document.getElementById('player-name').value;
      const playerBreed = document.getElementById('player-breed').value;
      const playerImage = document.getElementById('player-image').value;
      const playerStatus = document.getElementById('player-status').value;

      // Create a new player object with the input values
      const newPlayerObj = {
        name: playerName,
        breed: playerBreed,
        imageUrl: playerImage,
        status: playerStatus,
      };

      // Add the new player using the addNewPlayer function
      addNewPlayer(newPlayerObj);
    });
  } catch (err) {
    console.error('Uh oh, trouble rendering the new player form!', err);
  }
};

/**
 * Initialization function that fetches all players from the API and renders them on the page.
 * It also renders the form to add a new player.
 */
const init = async () => {
  try {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
    renderNewPlayerForm();
  } catch (err) {
    console.error('Error initializing the app:', err);
  }
};

init();
