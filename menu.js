window.onload = function() {

    /************************************************************************************************
    not so mega restructure - was a bad idea (maybe). I do need to start building out the table though
    *************************************************************************************************/
    
    //Classes to make the array of restaurants - pulls the xml data and builds out objects
        // TheItems creates an array of each menu item, stored in parent meal object
    class TheItems {
        constructor(eachItem) {
            this.name = ""; // if menu item has no name, instert description
            this.description = ""; // test for null/empty before appending dom - do not apend if empty
            this.nameTest(eachItem); // runs method to check for empty name
            this.price = eachItem.querySelector('price').innerText;
            this.optons = eachItem.querySelector('dietary').innerText.split(' '); //array of meal types
        }
        
        // empty name method I told you about - test name for innerText
        nameTest(eachItem) {
            if (eachItem.querySelector('name').innerText) {
                this.name = eachItem.querySelector('name').innerText; //true: name = name, desc = desc
                this.description = eachItem.querySelector('description').innerText;
            }
            else {
                this.name = eachItem.querySelector('description').innerText; // false: name = desc
            }
        }
    }
    
        //TheMeals creates array of the meal times (bfast, lunch etc) avail at parent rest. stored in parent rest object
    class TheMeals {
        constructor(mealTime) {
            this.mealTime = mealTime;
            this.item = (function() { // adds array of meal items
                let nodeArr = mealTime.children; // array of items as child nodes - unformatted
                let tempArr = []; // holds array as it's being built in loop
                for(let x = 0; x < nodeArr.length; x += 1) { 
                    tempArr.push(new TheItems(nodeArr[x])); // creates new item object on each loop and stores in array
                }
                return tempArr;
            })();
        }
    }
    
        // TheRestaurants creates array of all data from XML
    class TheRestaurants {
        constructor(restaurant) {
            this.name = restaurant.getAttribute('restaurant'); // pulls name of restaurant
            this.meals = this.makeMealsArray(restaurant); // executes method that makes the meal array
            this.menuOptions = this.makeOptionsArray(restaurant); // executes method that populates menu options - probably move to TheItems
        }

        makeMealsArray(restaurant) { // method to call TheMeals class and make meal array
            let nodeArr = restaurant.children; // array of items as child nodes - unformatted
            let tempArr = []; // holds array as it's being built in loop
            for(let x = 0; x < nodeArr.length; x += 1) {
                tempArr.push(new TheMeals(nodeArr[x])); // creates new meal object on each loop and stores in array
            }
            return tempArr;
        }

        makeOptionsArray(restaurant) { // creates meal options/types array  - probably move this to TheItems object
            let tempArr1 = restaurant.querySelectorAll('dietary'); // array of items as child nodes - unformatted
            let tempArr2 = []; // holds array as it's being built in loop
            let AddArr2 = function() { // function to store array of nodes as array of arrays
                for(let x = 0; x < tempArr1.length; x += 1) {
                        tempArr2.push(tempArr1[x].innerHTML.split(" ")); // array of child nodes, split and stored as arrays 
                    }
                }
                AddArr2();
                ///////////////////////////////////////////
                tempArr2 = tempArr2.flat().filter(word => word.length > 0); // what does this do?????
                //////////////////////////////////////////
                return [...new Set(tempArr2)];
                }
}
    
    //selects the restaurant names and data and stores in array of objects
    const allMenu = document.querySelector('#menuData'); //end user to change to point to other data
    let restArrayTarg = allMenu.querySelectorAll('menu');
    let restaurants = [];
    let makeRestaurants = function(menus) {
        for(let x = 0; x < menus.length; x += 1) {
            restaurants.push(new TheRestaurants(menus[x]));
        }
    }
    
    makeRestaurants(restArrayTarg);
    console.log(restaurants); //kill after done. just here for testing
    
    //button target function


    // class theButton {
    //     constructor(bName, bTargetDiv) {
    //         let localBtn = document.createElement('button');
    //         localBtn.type = 'button';
    //         localBtn.name = bName;
    //         localBtn.value = bName;
    //         localBtn.id = bName;
    //         document.querySelector(bTargetDiv).appendChild(localBtn);
    //         document.querySelector(bTargetDiv).style.display = 'inline';
    //     }
    // }
    
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
        new theButton('restSubmit', '#mealBtn');
        //assign value to variable here  - cannot select until it's created (see restBtnClick.addEventListener('click', listMealTimes, false);)
        restBtnClick = document.querySelector('#restSubmit');
    }
    
    //pull mealtimes from checked DOM elements, create list of meal options
        // selected restaurant array and collect Boolean
    let restCheckTarg; //array of restaurant check boxes - declared here for scope
    // let restCheckArr = []; //array of bool value of restCheckTarg -  declared here for scope - kill during refactor?
    let mealButtonClick;
    const listMealTimes = function() {
        restCheckTarg = document.querySelectorAll('.restaurants');
        for (let x = 0; x < restCheckTarg.length; x +=1)
        {
            if (!restCheckTarg[x].checked) { // sets unchecked boxes to null
                restaurants[x] = null;
            };
        }
        restaurants = restaurants.filter((obj) => obj); // filters out null values
        createMealList(restaurants); 

        mealButtonClick = document.querySelector('#mealBtnText');
        mealButtonClick.addEventListener('click', listOptions, false);
    }
    
        //create meal list and append to DOM
    const createMealList = function(arrIt) {
        for (let x = 0; x < arrIt.length; x += 1) {
            console.log(restaurants[x]);
            let localMealArr = restaurants[x].meals;
            for(let x = 0; x < localMealArr.length; x += 1) {
                let localMealText = localMealArr[x].mealTime.getAttribute('time');
                new theSelector(localMealText, 'mealBoxes', '#mealTimes')
            }
            new theButton('mealSubmit', '#mealBtnText');
        }
    }
    
    // pull dietary options from checked meal times - append to DOM
        // selected meal-time array and collect checked boolean
    let mealCheckTarg; //array of meal check boxes - declared here for scope
    let mealCheckArr = []; //array of bool value of mealCheckTarg -  declared here for scope
    const listOptions = function() {
        mealCheckTarg = document.querySelectorAll('.mealBoxes');
        for (let x = 0; x < mealCheckTarg.length; x += 1) {
            mealCheckArr.push(mealCheckTarg)
        }
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