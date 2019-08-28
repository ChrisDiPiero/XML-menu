window.onload = function() {

    /*******************************************
    Classes that convert the XML data to objects
    ********************************************/
    
    //Classes to make the array of restaurants - pulls the xml data and builds out objects
        // TheItems creates an array of each menu item, stored in parent meal object
    class TheItems {
        constructor(eachItem) {
            this.name = ""; // if menu item has no name, instert description
            this.description = ""; // test for null/empty before appending dom - do not apend if empty
            this.nameTest(eachItem); // runs method to check for empty name
            this.price = eachItem.querySelector('price').innerText;
            this.optons = eachItem.querySelector('dietary').innerText.split(' '); //array of meal dietary options
        }
        
        // empty name method I told you about - test name for innerText
        nameTest(eachItem) {
            if (eachItem.querySelector('name').innerText) {
                this.name = eachItem.querySelector('name').innerText; //true: name = name from XML, desc = desc
                this.description = eachItem.querySelector('description').innerText;
            }
            else {
                this.name = eachItem.querySelector('description').innerText; // false: name = description from XML and description left empty
            }
        }
    }
    
        //TheMeals creates array of the meal times (bfast, lunch etc) avail at parent rest. stored in parent rest object
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
    
        // TheRestaurants creates array of all data from XML
    class TheRestaurants {
        constructor(restaurant) {
            this.name = restaurant.getAttribute('restaurant'); // pulls name of restaurant
            this.meals = this.makeMealsArray(restaurant); // executes method that makes the meal array
        }

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
    const allMenu = document.querySelector('#menuData'); //change to point to other data
    let restArrayTarg = allMenu.querySelectorAll('menu'); //array of each menu - unformatted
    let restaurants = []; // array of objects - declared her for scope
    let makeRestaurants = function(menus) { //declare function that creates restaurant objects
        for(let x = 0; x < menus.length; x += 1) {
            restaurants.push(new TheRestaurants(menus[x])); //new object per restaurant name
        }
    }
    
    // executes above function imediately after page load
    makeRestaurants(restArrayTarg); //calls function that makes restaurant object array
    console.log(restaurants); //kill after done. just here for testing

/*********************************************************************************
reusable functions that create the DOM elements (checkboxes and their containers)
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

    //function to create container and append to DOM, makeSelector function creates nodes to appends to this container
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
            restCheckArr.push(array[x].name);//pushs 'name' of each object (restaurant)
        }
    }
    
    
    //pull mealtimes from checked DOM elements, create list of meal options
    // target restaurant name checkboxes, collect boolean, remove uncheck restaurant objects from array
    const listMealTimes = function() {
        let restCheckTarg = document.querySelectorAll('.restaurants'); // targets the restaurant checkboxes
        /************************fix this with filter maybe? */
        // for (let x = 0; x < restCheckTarg.length; x +=1) // loops over each checkbox
        // {
        //     if (!restCheckTarg[x].checked) { //tests for unchecked (false) checkboxes 
        //         restaurants.splice(x, 1); // gets index of unchecked boxes, removes corresponding object value in array - not working - array shortens screwing up index on each pass, filter instead.
        //     };
        // }
        console.log(restaurants);
        createMealList(restaurants); //executes meal checkbox list creation on remaining restaurant object array
    }
    
        //create meal list and append to DOM - after first button click
    const createMealList = function(arr) { //pass in altered object array
        for (let x = 0; x < arr.length; x += 1) { //loop over altered meal array
            let divId = "restaurant" + x; //create unique ID to be used in makeTheDivs
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
        // select meal-time checkboxes and collect unchecked checked boolean - remove from array
    const listOptions = function() {
        let restDivAr = document.querySelectorAll('.tempRestClass'); // select restaurant containers

        for(let x = 0; x < restDivAr.length; x += 1) { // iterate over divs to get selected checkboxes
            let localDiv =  restDivAr[x]; // assign local rest to var
            let mealCheckTarg = localDiv.querySelectorAll('.mealBoxes'); //array of meal check boxes
            for (let y = 0; y < mealCheckTarg.length; y +=1) { // loops over each checkbox
                if (!mealCheckTarg[y].checked) { //tests for unchecked (false) checkboxes 
                    restaurants[x].meals.splice(y, 1); //gets index of unchecked boxes, removes from object value from array
                }
            }
        }
        createOptionsList(restaurants);
    }

    const createOptionsList = function() {

    }
    /*****************************
     ***** execution block ******
     ****************************/
    //buttons
        //Variables for button targets/selectors
    let restBtnClick = document.querySelector('#selectRestBtn');
    let mealBtnClick = document.querySelector('#selectMealBtn');
    let optionBtnClick = document.querySelector('#selectRestBtn');
        //button event listeners
    restBtnClick.addEventListener('click', listMealTimes, false);
    mealBtnClick.addEventListener('click', listOptions, false);
    //optionBtnClick.addEventListener('click', listItems, false);
    
    //lists restaurants
    makeRestCheck(restaurants);//make the array of restaurant names pulled from object array
    makeAndAppendData('restaurantTitle', 'span', restCheckArr, 'restaurants', '#restSelect'); // restaurant checkbox node creation and append to DOM

   
    }