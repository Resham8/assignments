const url = 'https://pokeapi.co/api/v2/pokemon/';

let getPokeData = () => {    
    let id = Math.floor(Math.random() * 100) + 1;    
    const finalUrl = url + id;
    
    fetch(finalUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  };


  getPokeData();