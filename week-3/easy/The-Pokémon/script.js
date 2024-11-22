// const url1 = 'https://pokeapi.co/api/v2/pokemon/';

const noCards = document.querySelector("#cards");
const categories = document.getElementById("categories");
const button = document.getElementById("newPokemon");
const details = document.querySelector(".details");
const cardContainer = document.getElementById("cardContainer");
const controls = document.querySelector(".controls");
const container = document.querySelector(".container");

const url = "https://pokeapi.co/api/v2/type/";

function getPokeType() {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      return [];
    });
}

async function addTypes() {
  const data = await getPokeType();
  let types = data.results.map((item) => item.name);

  if (types && types.length > 0) {
    types.forEach((type) => {
      const newOption = document.createElement("option");
      newOption.value = type;
      newOption.text = type;
      categories.appendChild(newOption);
    });
  } else {
    console.error("No types available to add.");
  }
}

async function fetchPokemonByType(type) {
  try {
    const data = await getPokeType();
    return data.pokemon
      .map((p) => parseInt(p.pokemon.url.split("/").slice(-2, -1)[0]))
      .filter((id) => id <= 898)
      .sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error("Error fetching Pokemon by type:", error);
    return [];
  }
}

function getPokemon() {
  const limit = parseInt(noCards.value, 10);
  const finalUrl = `${url}/${categories.value}`;
  fetch(finalUrl)
    .then((response) => response.json())
    .then((data) => {
      const pokemonList = data.pokemon.map((pokeObj) => pokeObj.pokemon);
      const limitedList = pokemonList.slice(0, limit);

      // render the pokemon
      console.log(limitedList);
    });
}

function formatStatName(statName) {
  return statName
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function renderPokemonCard(pokemon) {
  
}

addTypes();
getPokeType();
button.addEventListener("click", getPokemon);
