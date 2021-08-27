const formEl = document.getElementById("form");
const nameEl = document.getElementById("name");
const priceEl = document.getElementById("price");
const heatEl = document.getElementById("heat");
const hamEl = document.getElementById("ham");
const cheeseEl = document.getElementById("cheese");
const olivesEl = document.getElementById("olives");
const tomatoesEl = document.getElementById("tomatoes");
const photoEl = document.getElementById("photo");
const pizzaMenuEl = document.getElementById('pizza-menu-container');
const nameErrorEl = document.getElementById('name-error-message');
const toppingsErrorEl = document.getElementById('toppings-error');

// this will be later used to check the uniqueness of entered name value
let itemNameAlreadyExists = false;

const injectItemToHTML = (pizzaItem) => {

// adding a heat-chilli icon to each heat integer from pizza item
  let heatIconsDiv = document.createElement("div");
  for (let i = 0; i < pizzaItem.heat; i++) {
    const heatIcon = document.createElement("img");
    heatIcon.setAttribute('src', "./assets/chilli.png");
    heatIcon.setAttribute('class', "heat-icon");
    heatIconsDiv.appendChild(heatIcon);
  }

  // injecting the received pizza item to pizza menu element
  pizzaMenuEl.insertAdjacentHTML('beforeend', 
  `<div class="pizza-item" id=${pizzaItem.name}>` 
    + `<button class="closing-button" id="button-${pizzaItem.name}">` + 'x' + '</button>'
    + '<div class="pizza-info">'
      + `<div class="pizza-name-info" id="pizza-${pizzaItem.name}-info">` 
        + '<p>' + pizzaItem.name + '</p>' 
      + "</div>"
      + '<p>' + pizzaItem.price + " EUR" + '</p>' 
      + '<p>' + pizzaItem.toppings.filter(item => item) + '</p>' 
    + '</div>'
  + '<div class="pizza-photo">' 
      + (pizzaItem.photo ? `<img src=${pizzaItem.photo} class="pizza-photo"/>` : "")
+ '</div>');

// adding the action which removes the item, to the button
    document.getElementById(`button-${pizzaItem.name}`).onclick = () => {
      const result = confirm("Are you sure you want to remove this pizza item?");
      if (result) {
          sessionStorage.removeItem(pizzaItem.name);
          const removedItem = document.getElementById(pizzaItem.name);
          pizzaMenuEl.removeChild(removedItem);
      } else {
          return;
      }
    };
    // if pizza item has heat value greater than zero, a <div> element with chilli icons will be added to HTML
    if (pizzaItem.heat > 0) {
        const textAndHeatIconsDiv = document.getElementById(`pizza-${pizzaItem.name}-info`);
        textAndHeatIconsDiv.appendChild(heatIconsDiv);
    }
};

  const storePizzaItem = () => {

    const toppingsArrayValues = [ham.checked, cheese.checked, olives.checked, tomatoes.checked];

    // if the entered pizza name value already exists, and if so - we stop the function from storing a duplicated name item
    if (itemNameAlreadyExists) {
      return;
    } else if (toppingsArrayValues.filter(Boolean).length < 2) {
      // if less than two toppings have been checked - an error text message is injected to HTML
        toppingsErrorEl.innerHTML = '<p id="error-text">' + "you must choose at least two toppings" + '</p>';
        return;
    } else if (!itemNameAlreadyExists) {
      // if the entered name value is unique - a new pizza item is stored to session storage and injected to HTML; form is cleared afterwards
        toppingsErrorEl.innerHTML = "";
        const toppings = [ham.checked ? hamEl.value : "", cheese.checked ? cheeseEl.value : "", olives.checked ? olivesEl.value : "", tomatoes.checked ? tomatoesEl.value : ""];
        const pizzaItem = {
        name: nameEl.value,
        price: priceEl.value,
        heat: heatEl.value,
        toppings: toppings,
        photo: photoEl.value
        }
      window.sessionStorage.setItem(pizzaItem.name, JSON.stringify(pizzaItem));
      injectItemToHTML(pizzaItem);
      formEl.reset();
    }
  }

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  storePizzaItem();
});

// a function which is used for noticing name input changes
const onNameInputChange = (e) => {
  const errorText = document.getElementById("error-text");

  // if a user has entered an already existing name value - error message is displayed, but on the next input change we want to remove the error message, if the value is unique
  if (nameErrorEl.hasChildNodes()) {
    nameErrorEl.removeChild(errorText);
  }
  if (sessionStorage.getItem(`${e.target.value}`)) {
    // if entered name input value exists in storage we change outside scoped boolean, which will prevent storing a duplicate to session storage, to true and display an error message in HTML
    itemNameAlreadyExists = true;
    const node = document.createElement("p");
    const textnode = document.createTextNode(
      "item with such name already exists"
    );
    node.appendChild(textnode);
    node.setAttribute("id", "error-text");
    nameErrorEl.appendChild(node);
  } else {
    itemNameAlreadyExists = false;
  }
};

const retrieveAllItemsFromStorage = () => {
  let items = [];
  Object.keys(sessionStorage).forEach((key) => items.push(JSON.parse(sessionStorage.getItem(key))));
  return items;
}

const sortByName = () => {
  pizzaMenuEl.innerHTML = "";
  let pizzaItems = retrieveAllItemsFromStorage();

  pizzaItems.sort(function(a, b) {
    return a.name.localeCompare(b.name);
 });

 pizzaItems.forEach((item) => injectItemToHTML(item));
}

const sortByPrice = () => {
  pizzaMenuEl.innerHTML = "";
  let pizzaItems = retrieveAllItemsFromStorage();

  pizzaItems.sort((a, b) => a.price - b.price);

 pizzaItems.forEach((item) => injectItemToHTML(item));
};

const sortByHeat = () => {
  pizzaMenuEl.innerHTML = "";
  let pizzaItems = retrieveAllItemsFromStorage();

  pizzaItems.sort((a, b) => a.heat - b.heat);

 pizzaItems.forEach((item) => injectItemToHTML(item));
}

// checking the storage on each browser page refresh, and if any items are found - inject them to HTML and sort by default name value
const checkStorage = () => {
  Object.keys(sessionStorage).map((key) => {
    const itemFromStorage = sessionStorage.getItem(key);
    injectItemToHTML(JSON.parse(itemFromStorage));
    sortByName();
  })
};

checkStorage();