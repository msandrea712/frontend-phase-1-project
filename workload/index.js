let searchBtn = document.querySelector(".search-button");
let typeSelect = document.getElementById("type-select");
let PokemonContainer = document.querySelector(".Pokemon-Container");
let playerResultsElement = document.querySelector(".player-results");
let resultsElement = document.querySelector(".results");
let detailsElement=document.querySelector(".details")
let detailsContentElement=document.querySelector(".details-content")
let Pokemon = [];
let openCards = [];
searchBtn.addEventListener("click", getPokemon);
function getPokemon() {
  Pokemon = [];
  console.log(typeSelect.value);
  fetch("https://pokeapi.co/api/v2/type/" + typeSelect.value)
    .then((response) => response.json())
    .then((data) => {
      let pokemonLimit = data.pokemon.slice(0, 2);
      console.log(pokemonLimit);
      pokemonLimit.forEach((element) => {
        fetch(element.pokemon.url)
          .then((response) => response.json())
          .then((data) => {
            Pokemon.push(data);
            if (Pokemon.length === 2) {
              Pokemon = Pokemon.concat(Pokemon, Pokemon);
              Pokemon = shuffleCards(Pokemon);
              renderPokemon();
              console.log(Pokemon);
            }
          });
      });
    });
}
function renderPokemon() {
  resultsElement.classList.remove("result-active");
  PokemonContainer.innerHTML = "";
  console.log(Pokemon);
  Pokemon.map((Item) => {
    let card = document.createElement("div");
    card.classList.add("Pokemon-card");
    card.id = Item.id;
    card.addEventListener("click", openCard);
    let cardFront = document.createElement("div");
    cardFront.classList.add("pokemon-card-front");
    let nameElement = document.createElement("h2");
    nameElement.innerText = Item.name;
    let imageElement = document.createElement("img");
    imageElement.src = Item.sprites.front_default;
    imageElement.alt = Item.name;
    let cardBack = document.createElement("div");
    cardBack.classList.add("Pokemon-card-back");
    let cardBackImage = document.createElement("img");
    cardBackImage.src =
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcH55-RhVslrbct-9fRuRu67t6Fb1UC5efDOG2zfBg&s";
    cardFront.appendChild(nameElement);
    cardFront.appendChild(imageElement);
    cardBack.appendChild(cardBackImage);
    card.appendChild(cardFront);
    card.appendChild(cardBack);
    PokemonContainer.appendChild(card);
  });
}
function openCard() {
  event.target.closest(".Pokemon-card").style.transform = "rotateY(180deg)";
  console.log(event.target.closest(".Pokemon-card"));
  openCards.push(event.target.closest(".Pokemon-card").id);
  checkWinStatus();
}
function shuffleCards(cardsArray) {
  for (let i = cardsArray.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [cardsArray[i], cardsArray[randomIndex]] = [
      cardsArray[randomIndex],
      cardsArray[i],
    ];
  }
  return cardsArray;
}
function checkWinStatus() {
  if (openCards.length === 2) {
    let isMatch = hasDuplicates(openCards);
    openCards = [];
    setTimeout(function () {
      let pokemonCards = document.querySelectorAll(".Pokemon-card");
      pokemonCards.forEach(function (item) {
        item.replaceWith(item.cloneNode(true));
      });
      if (isMatch) {
        playerResultsElement.textContent = "player wins";
      } else {
        playerResultsElement.textContent = "player lost";
      }
      resultsElement.classList.add("result-active");
      let cardFronts=document.querySelectorAll(".pokemon-card-front")
       cardFronts.forEach(function(card) {
let detailsButton=document.createElement("button")
detailsButton.textContent="details"
console.log(card)
detailsButton.addEventListener("dblclick",showDetails)
card.appendChild(detailsButton)
      })
    }, 800);
  }
}
function hasDuplicates(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        return true;
      }
    }
  }
  return false;
}
function showDetails(){
  detailsContentElement.innerHTML=""
  let pokeId=event.target.closest(".Pokemon-card").id
  let foundPokemon=Pokemon.find(function (item){
    return item.id===Number(pokeId)
  })
  let{
    name,id,height,weight,types,sprites,abilities,stats
  }=foundPokemon
  detailsElement.classList.add("details-active")
  detailsContentElement.innerHTML+=`
  <h2>${name.toUpperCase()}</h2>
  <p>${id}</p>
  <p>height: ${height}</p>
  <p>weight: ${weight}</p>
  `
  window.addEventListener("click",function(event){
if (event.target.classList.contains("close-button")){
  detailsElement.classList.remove("details-active")
}
  })
}