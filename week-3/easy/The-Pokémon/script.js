const url1 = 'https://pokeapi.co/api/v2/pokemon/';

const noCards = document.querySelector("#cards");
const categories = document.getElementById("categories");
const button = document.getElementById("newPokemon");
const details = document.querySelector(".details");
const cardContainer = document.getElementById("cardContainer");
const controls = document.querySelector(".controls");
const container = document.querySelector(".container");


function getPokeType() {
  const url = "https://pokeapi.co/api/v2/type/";

  return fetch(url).then((response) => response.json())
  .then((data) => {
    // console.log(data);
    
    let pokeType = data.results.map(item => item.name);
    // console.log(pokeType);

    return pokeType;
  }).catch((error) => {
    console.error("Error fetching data: ", error);
    return [];
  });
  
}

async function addTypes() {
  const types = await getPokeType();
  console.log("Types received in addTypes:", types);

  if (types && types.length > 0) {
    types.forEach(type => {
      const newOption = document.createElement("option");
      newOption.value = type;
      newOption.text = type;
      categories.appendChild(newOption);
    });
  } else {
    console.error("No types available to add.");
  }
}

addTypes();


// let getPokeData = () => {    
//     let id = Math.floor(Math.random() * 100) + 1;    
//     const finalUrl = url + id;
    
//     fetch(finalUrl)
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data);
//       });
//   };


  // getPokeData();

  getPokeType();