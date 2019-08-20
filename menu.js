window.onload = function() {

//makes object of restaurant - contains restaurant name, array of dietary need options, node list of menu meal-times, and inner object 
// class theFood {
//     constructor(times) {
//         this.mealtimes
//     }
// }

class theItems {
    constructor(eachItem) {
        this.name = "";
        this.description = "";
        this.nameTest(eachItem);
        this.price = eachItem.querySelector('price').innerText;
        this.optons = eachItem.querySelector('dietary').innerText.split(' ');
    }

    nameTest(eachItem) {
        if (eachItem.querySelector('name').innerText) {
            this.name = eachItem.querySelector('name').innerText;
            this.description = eachItem.querySelector('description').innerText;
        }
        else {
            this.name = eachItem.querySelector('description').innerText;
        }
    }
}

class theMeals {
    constructor(mealTime) {
        this.mealTime = mealTime;
        this.item = (function() {
            let nodeArr = mealTime.children;
            let tempArr = [];
            for(let x = 0; x < nodeArr.length; x += 1) {
                tempArr.push(new theItems(nodeArr[x]));
            }
            return tempArr;
        })();
    }
}

class theRestaurants {
    constructor(restaurant) {
        this.name = restaurant.getAttribute('restaurant');

        this.meals = (function() {
            let nodeArr = restaurant.children;
            let tempArr = [];
            for(let x = 0; x < nodeArr.length; x += 1) {
                tempArr.push(new theMeals(nodeArr[x]));
            }
            return tempArr;
        })();

        this.menuOptions = (function() {
                let tempArr1 = restaurant.querySelectorAll('dietary');
                let tempArr2 = [];
                let AddArr2 = function() {
                    for(let x = 0; x < tempArr1.length; x += 1) {
                        tempArr2.push(tempArr1[x].innerHTML.split(" "));
                    }
                }
                AddArr2();
                tempArr2 = tempArr2.flat().filter(word => word.length > 0);
                return [...new Set(tempArr2)];
        })();
    }
}

//selects the restaurant names and data and stores in array of objects
const allMenu = document.querySelector('#menuData'); //end user to change to point to other data
let restArrayTarg = allMenu.querySelectorAll('menu');
let restaurants = [];
let makeRestaurants = function(menus) {
    for(let x = 0; x < menus.length; x += 1) {
        restaurants.push(new theRestaurants(menus[x]));
    }
}

makeRestaurants(restArrayTarg);
console.log(restaurants); //kill after done. just here for testing

//button creation class
class theButton {
    constructor(bName, bTargetDiv) {
        let localBtn = document.createElement('button');
        localBtn.type = 'button';
        localBtn.name = bName;
        localBtn.value = bName;
        localBtn.id = bName;
        document.querySelector(bTargetDiv).appendChild(localBtn);
        document.querySelector(bTargetDiv).style.display = 'inline';
    }
}

//checkbox creation class
class theSelector {
    constructor(attrb, addClass, selector) { 
        let newNode = document.createElement('input');
        let newNodeLabel = document.createElement('label');
        let nodeDescription = document.createTextNode(attrb);

        newNode.type = 'checkbox';
        newNode.value = attrb;
        newNode.classList += addClass;
        newNodeLabel.for = attrb;

        newNodeLabel.appendChild(newNode);
        newNodeLabel.appendChild(nodeDescription);

        document.querySelector(selector).appendChild(newNodeLabel);
    }
}

//pull restaurant names from array.object - make checklist and add button
    //restaurant array
let restCheck = [];
const makeRestCheck = function(array) {
    for(let x = 0; x < array.length; x += 1) {
        restCheck.push(array[x].name);
    }
}

    //restaurant list of checkboxes, button and append to DOM
let restBtnClick;
const listRestauarants = function() {
    for (let x = 0; x < restCheck.length; x += 1) {
        new theSelector(restCheck[x], 'restaurants', '#menuSelect');
    }
    new theButton('restSubmit', '#btnText');
    //assign value to variable here  - cannot select until it's created (see restBtnClick.addEventListener('click', listMealTimes, false);)
    restBtnClick = document.querySelector('#restSubmit');
}

//pull mealtimes from checked DOM elements, create list of meal options
    // selected restaurant array and collect Boolean
let restCheckTarg; //array of rewtaurant check boxes - declared here for scope
let restCheckArr = []; //array of bool value of restCheckTarg -  declared here for scope
const listMealTimes = function() {
    restCheckTarg = document.querySelectorAll('.restaurants');
    for (let x = 0; x < restCheckTarg.length; x +=1)
    {
        restCheckArr.push(restCheckTarg[x].checked);
        createMealList(restCheckTarg[x].checked, x);
    }
    mealButtonClick.addEventListener('click', listOptions, false);
}

    //create meal list and append to DOM
let mealButtonClick;
const createMealList = function(arrIt, iter) {
    if (arrIt) {
        let localRestName = restaurants[iter].name;
        let localMealArr = restaurants[iter].meals;
        for(let x = 0; x < localMealArr.length; x += 1) {
            let localMealText = localMealArr[x].mealTime //convert to string
            console.log(localMealArr[x].mealTime);
            new theSelector(localMealText, 'mealBoxes', '#mealTimes')
        }
        new theButton('mealSubmit', '#mealBtnText');
    }
}

// pull dietary options from checked meal times - append to DOM
const listOPtions = function() {
    console.log("woot")
}
/*****************************
 ***** execution block ******
 ****************************/

makeRestCheck(restaurants);
listRestauarants();
restBtnClick.addEventListener('click', listMealTimes, false);

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