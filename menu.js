window.onload = function() {

//selects the restaurant names from the menu list
const allMenu = document.querySelector("#menuData");
const restaurants = allMenu.querySelectorAll("menu");

//restaurant name select button target. ned to declare here for scope
let restButtClick = document.querySelector("#restSubmit");

const listRestauarants = function() {
    for (let x = 0; x < restaurants.length; x += 1) {
        let eachRest = restaurants[x].getAttribute("restaurant");
        restSelector(eachRest);
    }
    restButt();
}

//create the menu list with checkboxes
const restSelector = function(attrb) { 
    let newNode = document.createElement('input');
    let newNodeLabel = document.createElement('label');
    let nodeDescription = document.createTextNode(attrb);

    newNode.type = 'checkbox';
    newNode.value = attrb;
    newNodeLabel.for = attrb;

    newNodeLabel.appendChild(newNode);
    newNodeLabel.appendChild(nodeDescription);

    document.querySelector("#menuSelect").appendChild(newNodeLabel);
}
//create load meal options button
const restButt = function() {
    const restSubmit = document.createElement('button');
    
    restSubmit.type = 'submit';
    restSubmit.name = 'restsubmit';
    restSubmit.value = 'restsubmit';
    restSubmit.id = 'restSubmit';

    document.querySelector('#buttText').appendChild(restSubmit);
    document.querySelector('#buttText').style.display = 'inline';
    restButtClick = document.querySelector("#restSubmit");
}

//create mealtime list(s)
const listMealtimes = function() {
    alert("clicked");
}

listRestauarants();

restButtClick.addEventListener('click', listMealtimes, false);

/*
    10 populate list of restaurants
        11 read xml
        12 store array of ALL restaurants in variable
        13 template literal - create inputs
        14 display inputs in html
        15 create submit button - press enter or click SUBMIT
        16 await further instructions
        17 listen for enter or click
        18 remove button ???
        19 return input GOTO 20
    20 populate list of meal options
        21 read SELECTED menus. by array #???
        22 scan for meal attributes - removing duplicates - return and store
        23 template literal - create inputs (add price cap option as well)
        24 display inputs
        25 create button - press enter or click SUBMIT - ?you may change your restaurant selection too?
        26 listen for enter or click
        27 return input and store GOTO 30
    30 build and display table
        31 
    40 if no result, say "my youre picky, well it looks like (other restaurant) has what youre looking for"
        41 read xml of reataurants not selected, ingoring others
        42 GOTO 30
*/
}