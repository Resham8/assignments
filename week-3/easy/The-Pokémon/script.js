// const url1 = 'https://pokeapi.co/api/v2/pokemon/';
const typeColors = {
  grass: '#78c850',
  fire: '#f08030',
  water: '#6890f0',
  electric: '#f8d030',
  psychic: '#f85888',
  normal: '#a8a878',
  ground: '#e0c068',
  flying: '#a890f0',
  fairy: '#ee99ac',
  bug: '#a8b820',
  fighting: '#c03028',
  poison: '#a040a0',
  rock: '#b8a038',
  ghost: '#705898',
  ice: '#98d8d8',
  dragon: '#7038f8',
  dark: '#705848',
  steel: '#b8b8d0'
};


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
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const data = await response.json();
    return data.pokemon
      .map((p) => parseInt(p.pokemon.url.split("/").slice(-2, -1)[0]))
      .filter((id) => id <= 898)
      .sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error("Error fetching Pokemon by type:", error);
    return [];
  }
}

async function getPokemon() {
  const selectedType = categories.value;
  const numCards = parseInt(noCards.value);

  if (!selectedType) {
    alert("Please select a Pokémon type.");
    return;
  }

  if (isNaN(numCards) || numCards < 2) {
    alert("Please enter a valid number of cards.");
    return;
  }

  const pokemonIds = await fetchPokemonByType(selectedType);

  const limitedPokemonIds = pokemonIds.slice(0, numCards);
  renderPokemonCards(limitedPokemonIds);
}

async function renderPokemonCards(pokemonIds){
  cardContainer.innerHTML = "";
  if (pokemonIds.length === 0) {
    noCards.textContent = "No Pokémon found for this type.";
    return;
  }

  for(const id of pokemonIds){
    const pokemonData = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemon = await pokemonData.json();
    renderCard(pokemon);
  }
}

function formatStatName(statName) {
  return statName.charAt(0).toUpperCase() + statName.slice(1).replace('-', ' ');
}


function renderCard(pokemon) {
  if (!pokemon) return null;

  const card = document.createElement('div');
  card.className = 'pokemon-card';
  
  const mainType = pokemon.types[0].type.name;
  card.style.background = `linear-gradient(135deg, ${typeColors[mainType]}22, ${typeColors[mainType]}44)`;

  card.innerHTML = `
    <div class="card-content">
      <div class="pokemon-header">
        <span class="pokemon-id">#${String(pokemon.id).padStart(3, '0')}</span>
        <h2 class="pokemon-name">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
      </div>
      
      <div class="pokemon-image-container">
        <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" 
             alt="${pokemon.name}"
             class="pokemon-image">
      </div>

      <div class="pokemon-types">
        ${pokemon.types.map(type => `
          <span class="type-badge" style="background: ${typeColors[type.type.name]}">
            ${type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
          </span>
        `).join('')}
      </div>

      <div class="pokemon-stats">
        ${pokemon.stats.map(stat => `
          <div class="stat-bar">
            <div class="stat-label">${formatStatName(stat.stat.name)}</div>
            <div class="stat-bar-bg">
              <div class="stat-bar-fill" style="width: ${(stat.base_stat / 255) * 100}%; background: ${typeColors[mainType]}">
                ${stat.base_stat}
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="pokemon-abilities">
        <h3>Abilities</h3>
        <div class="abilities-list">
          ${pokemon.abilities.map(ability => `
            <span class="ability">${ability.ability.name.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  cardContainer.appendChild(card);
}

addTypes();
getPokeType();
button.addEventListener("click", getPokemon);
