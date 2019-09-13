window.onload = function() {

/*******************************************
Classes that convert the XML data to objects
********************************************/

//Classes to make the array of restaurants - pulls the xml data and builds out objects
    // TheItems creates an array of each menu item, stored in parent 'TheMeals' object
class TheItems {
    constructor(eachItem) {
        this.name = ""; // if menu item has no name, leave blank - test when appending, use description if empty
        this.description = eachItem.querySelector('description').innerText; // insert in place of name 
        this.nameTest(eachItem); // runs method to check for empty name
        this.price = eachItem.querySelector('price').innerText;
        this.options = eachItem.querySelector('dietary').innerText.split(' '); //array of meal dietary options
    }
    /***do I need this? ***review  */
    // empty name method I told you about - test name for innerText
    nameTest(eachItem) {
        if (eachItem.querySelector('name').innerText) {
            this.name = eachItem.querySelector('name').innerText; //true: name = name from XML, else leave blank
        }
    }
}
    
    //TheMeals creates array of the meal times (bfast, lunch etc) avail at parent rest. stored in parent 'TheRestaurants' object - stores 'TheItems'
class TheMeals {
    constructor(mealTime) {
        this.mealTime = mealTime.getAttribute('time');
        this.menuOptions = this.makeOptionsArray(mealTime); // executes method that populates menu options
        this.item = (function() { // adds array of meal items
            let nodeArr = mealTime.children; // array of items as child nodes - unformatted
            let tempArr = []; // holds array as it's being built in loop
            for(let x = 0; x < nodeArr.length; x += 1) { 
                tempArr.push(new TheItems(nodeArr[x])); // creates new item object on each loop and stores in array
            }
            return tempArr;
        })();
    }

    // methods for 'TheMeals'
    makeOptionsArray(mealTime) { // creates meal options/types array  - probably move this to TheItems object
        let tempArr1 = mealTime.querySelectorAll('dietary'); // array of items as child nodes - unformatted
        let tempArr2 = []; // holds array as it's being built in loop
        let AddArr2 = function() { // function to store array of nodes as array of arrays
            for(let x = 0; x < tempArr1.length; x += 1) {
                    tempArr2.push(tempArr1[x].innerHTML.split(" ")); // array of child nodes, split and stored as arrays 
            }
        }
        AddArr2();
        tempArr2 = tempArr2.flat().filter(word => word.length > 0); // flatten nested array and remove empty strings
        return [...new Set(tempArr2)];
    }
}
    
    // TheRestaurants creates object of restaurant from XML data - stored in 'restaurants' array - contains array of 'TheMeals' objects
class TheRestaurants {
    constructor(restaurant) {
        this.name = restaurant.getAttribute('restaurant'); // pulls name of restaurant
        this.meals = this.makeMealsArray(restaurant); // executes method that makes the meal array
    }

    //methods for 'TheRestaurants'
    makeMealsArray(restaurant) { // method to call TheMeals class and make meal array
        let nodeArr = restaurant.children; // array of items as child nodes - unformatted
        let tempArr = []; // holds array as it's being built in loop
        for(let x = 0; x < nodeArr.length; x += 1) {
            tempArr.push(new TheMeals(nodeArr[x])); // creates new meal object on each loop and stores in array
        }
        return tempArr;
    }
}

/************************************************************
 ***functions  that pull xml data and convert to Object array
 **************************************************************/
    
//selects the restaurant names and data and stores in array of objects
//const allMenu = document.querySelector('#menuData'); //change to point to other data - ***review - commented out for AJAX test
//let restArrayTarg = allMenu.querySelectorAll('menu'); //array of each menu - unformatted - ***review - commented out for AJAX test
let restaurants = []; // array of objects - declared here for scope
let makeRestaurants = function(xml) { //declare function that creates restaurant objects
    let xmlData = xml.responseXML;
    console.log(xmlData);
    let allMenu = xmlData.querySelector('#menuData');
    let menus = allMenu.querySelectorAll('menu'); //array of each menu - unformatted
    for(let x = 0; x < menus.length; x += 1) {
        restaurants.push(new TheRestaurants(menus[x])); //new object per restaurant name
    }
}

// AJAX

const xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log("we good");
        makeRestaurants(this);
    }
};
xhr.open("GET", "mainmenu.xml", true);
xhr.send();

// executes above function imediately after page load
//makeRestaurants(restArrayTarg); //calls function that makes restaurant object array


/*********************************************************************************
reusable functions that create the DOM elements (checkboxes and their containers) ***review - see StkOvr on fragments for refactor - https://stackoverflow.com/questions/36798005/append-multiple-items-in-javascript
**********************************************************************************/
const  makeSelector  = function(attrb, checkClass) { //creates array of checkboxes - called by loop in makeAndAppendData()
    let newNode = document.createElement('input'); //create checkbox
    let newNodeLabel = document.createElement('label'); // create EMPTY label
    let nodeDescription = document.createTextNode(attrb); // create text to add to label

    newNode.type = 'checkbox'; //creates checkbos
    newNode.value = attrb; //sets value equal to label text
    newNode.classList += checkClass; //adds class - may remove - was based on previous factor - may style all classes the same
    newNodeLabel.for = attrb; //sets for equal to label text

    newNodeLabel.appendChild(newNode); //appends checkbox to label
    newNodeLabel.appendChild(nodeDescription); //appends to created text node label

    return newNodeLabel; //passes constructed node back to loop within makeAndAppendData()
}

//function to create container and append to DOM, makeSelector function creates nodes to append to this container
const makeAndAppendData = function(containerClass, containerType, attrb, checkClass, appendToId) {
    let newDataNode = document.createElement(containerType);
    newDataNode.classList += containerClass;

    for(let x = 0; x < attrb.length; x += 1) {
        newDataNode.appendChild(makeSelector(attrb[x], checkClass));
    }
    
    document.querySelector(appendToId).appendChild(newDataNode);
}
    
//create data specific divs
const makeTheDivs = function(newId, newClass, text, appendTo) {
    let newNode = document.createElement('div');
    let nodeDescription = document.createTextNode(text);

    newNode.setAttribute('id', newId);
    newNode.classList += newClass;
    newNode.appendChild(nodeDescription);

    document.querySelector(appendTo).appendChild(newNode);
}

/******************************************************************************************
functions that create the specific checklists and alter data - listed in order of execution
******************************************************************************************/
//pull restaurant names from array.object - make checklist and add button
    //restaurant checkbox array - declared here for scope
let restCheckArr = [];

    //creates list of restaurant names for checkboxes - gets passed to makeAndAppendData- executes on page load (see execution block below)
const makeRestCheck = function(array) {//pass in object array
    for(let x = 0; x < array.length; x += 1) {//loops over object array 
        restCheckArr.push(array[x].name);//push 'name' of each object (restaurant)
    }
}
    
    
//pull mealtimes from checked DOM elements, create list of meal options
    // target restaurant name checkboxes, collect boolean, remove uncheck restaurant objects from array
const listMealTimes = function() {
    document.querySelector('#selectRestText').classList.toggle('collapsed'); // collapses button used to select restaurants
    document.querySelector('#selectMealText').classList.toggle('collapsed'); // uncollapses button usde to select meal times
    let restCheckTarg = document.querySelectorAll('.restaurants'); // targets the restaurant checkboxes
    if (!restCheckTarg.length) { //condition to test for empty array - only modifies 'restaurant' array if false
        for (let x = restCheckTarg.length - 1; x >= 0; x -=1) // loops over each checkbox backwards so as not to screw up indexes
        {
            if (!restCheckTarg[x].checked) { //tests for unchecked (false) checkboxes 
                restaurants.splice(x, 1); // gets index of unchecked boxes, removes corresponding object value in array
            };
        }
    }
    createMealList(restaurants); //executes meal checkbox list creation on remaining restaurant object array (full array if nothing selected)
    document.querySelector('#restSelect').classList.toggle('collapsed'); // collapses restaurant selection div after done with it
}
    
    //create meal list and append to DOM - after first button click
    const createMealList = function(arr) { //pass in altered object array
        document.querySelector('#menuLists').classList.toggle('collapsed'); // uncollapses menu selection Div
        for (let x = 0; x < arr.length; x += 1) { //loop over altered meal array
            let divId = 'restaurant' + x; //create unique ID to be used in makeTheDivs
            makeTheDivs(divId, 'tempRestClass', arr[x].name, '#menuLists'); //create div to append meal data to
            let localMeal = arr[x].meals; //pull meals{} object nested in current (x reference) restaurant
            let localMealArr = []; // declared for scope
            for(let x = 0; x < localMeal.length; x += 1) { // loops over array of 'meal-times'
            localMealArr.push(localMeal[x].mealTime); // pushes each meal-time to array
        }
        divId = '#' + divId; //added hash to make query selector work
        makeAndAppendData('mealDiv', 'div', localMealArr, 'mealBoxes', divId); //creates checkboxes
    }
}

// pull dietary options from checked meal times - append to DOM
    // select meal-time checkboxes and collect unchecked checkedbox boolean
const listOptions = function() {
    document.querySelector('#selectMealText').classList.toggle('collapsed');
    document.querySelector('#selectOptionsText').classList.toggle('collapsed');
    document.querySelector('#optionList').classList.toggle('collapsed');
    let restDivAr = document.querySelectorAll('.tempRestClass'); // select restaurant containers

    let tempArr = []; // declare temp arr as empty array
    for (let x = 0; x < restDivAr.length; x += 1) { // iterate over divs to get selected checkboxes
        let localDiv =  restDivAr[x]; // assign local rest to var
        let mealCheckTarg = localDiv.querySelectorAll('.mealBoxes'); //array of meal check boxes
        tempArr[x] = [];
        for (let y = 0; y < mealCheckTarg.length; y += 1) { // loops over each checkbox
            tempArr[x][y] = mealCheckTarg[y].checked; //gets index of unchecked boxes, assigns bool
        }
        if (!tempArr[x].every(function(e){return e})) { // tests for ALL meal checkboxes per rest false
            tempArr[x] = false; // if all meals false, set parent array to false
        }
    }
    console.log(tempArr);
    
    if(tempArr.some(function(e){return e})) {
        for (let x = tempArr.length - 1 ; x >= 0 ; x -= 1) { // delete false 
            if (!tempArr[x]) {
                restaurants.splice(x, 1);
            } else {
                for (let y = tempArr[x].length - 1; y >= 0; y -= 1) { // delete false
                    if (!tempArr[x][y]) {
                        tempArr[x].meals.splice(y, 1); //gets index of unchecked boxes, removes from object value from array
                    }
                }
            }
        }
    }
    console.log(restaurants);
    createOptionsList(restaurants);
    document.querySelector('#menuLists').classList.toggle('collapsed');
}
    
    //pull dietary options then append to DOM
const createOptionsList = function(arr) {
    localOptionArray = []; // temp arr to insert option values - here for scope
    for (let x = 0; x < arr.length; x += 1) { //loops over restaurant array to pull meal data
        for (let y = 0; y < arr[x].meals.length; y += 1) {
            localOptionArray.push(arr[x].meals[y].menuOptions)
        }
    }
    localOptionArray = localOptionArray.flat().filter(word => word.length > 0); // flatten nested array and remove empty strings
    localOptionArray.push("All Menu Items"); // gives user option to select whole menu
    if (localOptionArray.indexOf("Vegetarian") !== -1) { // tests for Vegetarian selection = true
        localOptionArray.push("Vegan"); // adds Vegan if true (since that is encaplsulated in vegetarian)
    }
    localOptionArray = [...new Set(localOptionArray)]; // filter to unique values
    makeAndAppendData('dietDiv', 'div', localOptionArray, 'optionBoxes', '#optionList');
}

// create and append the meal lists to the DOM
    // select option checkboxes and return selected values
let selectedOptions = []; // array of selcted options - declared here for scope
const listItems = function() {
    document.querySelector('#selectOptionsText').classList.toggle('collapsed');
    let optionArr = document.querySelectorAll('.optionBoxes'); //select option check boxes
    if (optionArr[optionArr.length - 1].checked) {
        selectedOptions = [];
    } else {
        for (let x = 0; x < optionArr.length; x += 1) {
            if (optionArr[x].checked) {
                selectedOptions.push(optionArr[x].value);
            }
        }    
    }
    console.log(restaurants);
    makeTheMenus(restaurants);
    document.querySelector('#optionList').classList.toggle('collapsed');
}

    // create the menus and append the DOM
const makeTheMenus = function(array) {
    console.log(selectedOptions);// ***review
    for (let x = 0; x < array.length; x += 1) {
        let localRest = array[x];
        let restId = 'rest' + x;
        makeTheDivs(restId, 'restDiv', localRest.name, '#theFinalList');
        for (let y = 0; y < localRest.meals.length; y += 1) {
            let localMeal = localRest.meals[y];
            let restDiv = '#rest' + x;
            let mealId = 'meal' + x + y;
            makeTheDivs(mealId, 'mealDiv', localMeal.mealTime, restDiv);
            for (let z = 0; z < localMeal.item.length; z += 1) { // declaring y iterator as parent x will be used to reference the div for appending
                let localItem = localMeal.item[z];
                console.log(localItem);
                let mealDiv = '#meal' + x + y;
                let localBool = true;
                (function(){
                    if (selectedOptions.length) {
                        for (let x = 0; x < selectedOptions.length; x += 1) {
                            localBool = (localItem.options.includes(selectedOptions[x]))
                        }
                    }
                })();
                if (localBool || selectedOptions.includes('All Menu Items'))
                insertItems(localItem, mealDiv);
            }
        }
    }
}

    // create item list and append to DOM
const insertItems = function(itemObject, theParent) {
    let newNode = document.createElement('div'); // create container that holds meal items
    let nameNode = document.createElement('span');
    let description = document.createElement('p');
    let priceNode = document.createElement('span');

    let descText = document.createTextNode(itemObject.description);
    description.appendChild(descText);
    description.classList += 'itemDescription';
    
    let priceText = document.createTextNode(itemObject.price);
    priceNode.appendChild(priceText);
    priceNode.classList += 'itemPrice';

    if(itemObject.name) {
        let nameText = document.createTextNode(itemObject.name);
        nameNode.appendChild(nameText);
        nameNode.classList += 'itemName';

        newNode.appendChild(nameNode);
    }

    newNode.appendChild(description);
    newNode.appendChild(priceNode);

    document.querySelector(theParent).appendChild(newNode);
}

/*****************************
 ***** execution block ******
    ****************************/
//buttons
    //Variables for button targets/selectors
let restBtnClick = document.querySelector('#selectRestBtn');
let mealBtnClick = document.querySelector('#selectMealBtn');
let optionBtnClick = document.querySelector('#selectOptionBtn');
    //button event listeners
restBtnClick.addEventListener('click', listMealTimes, false);
mealBtnClick.addEventListener('click', listOptions, false);
optionBtnClick.addEventListener('click', listItems, false);

//lists restaurants
makeRestCheck(restaurants);//make the array of restaurant names pulled from object array
makeAndAppendData('restaurantTitle', 'span', restCheckArr, 'restaurants', '#restSelect'); // restaurant checkbox node creation and append to DOM


}