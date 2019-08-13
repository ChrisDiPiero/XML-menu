window.onload = function() {

    /*************************************************************************************************************
     * scrap almost all of it. put functions into objects. each rest is an object (just selectors, not menu items)
     ************************************************************************************************************/
class theRestaurants {
    constructor(restaurant) {
        this.restaurant = restaurant.getAttribute('restaurant');
        this.mealTimes = restaurant.querySelectorAll('*[hours]');
        this.menuOptions = [];
        this.tempArr1 = restaurant.querySelectorAll('dietary')
        this.tempArr2 = this.tempArr1[1].split(" ");//this is not working - fix xml so that dietary is item attribute maybe

        // this.makeMenuOptions = function() {
        //     this.tempArr1 = restaurant.querySelectorAll('dietary');
        //     this.tempArr2 = [];
        //     this.AddArr2 = function() {
        //         for(x = 0; x < this.tempArr1.length; x += 1) {
        //             this.tempArr2.push(this.tempArr1[x].split(" "));
        //         }
        //     }
        //     this.AddArr2();
        //     this.menuOptions = new Set(tempArr2.flat());
        // }
        // this.makeMenuOptions();
    }
}

//selects the restaurant names and data and stores in array of objects
const allMenu = document.querySelector('#menuData'); //end user to change to point to other data
let restArrayTarg = allMenu.querySelectorAll('menu');
let restaurants = [];
let makeRestaurants = function(menus) {
    for(x = 0; x < menus.length; x += 1) {
        restaurants.push(new theRestaurants(menus[x]));
    }
}

makeRestaurants(restArrayTarg);

console.log(restaurants);

//button creation class
class theButton {
    constructor(bName, bTargetDiv) {
        let localBtn = document.createElement('button');
        localBtn.type = 'submit';
        localBtn.name = bName;
        localBtn.value = bName;
        localBtn.id = bName;
        document.querySelector(bTargetDiv).appendChild(localBtn);
        document.querySelector(bTargetDiv).style.display = 'inline';
    }
}

//checkbox creation class
class theSelector {
    constructor(attrb, selector) { 
        let newNode = document.createElement('input');
        let newNodeLabel = document.createElement('label');
        let nodeDescription = document.createTextNode(attrb);

        newNode.type = 'checkbox';
        newNode.value = attrb;
        newNodeLabel.for = attrb;

        newNodeLabel.appendChild(newNode);
        newNodeLabel.appendChild(nodeDescription);

        document.querySelector(selector).appendChild(newNodeLabel);
    }
}

// //create load meal times button (bfast, etc...)
//     //declare variable here for scope
// let restBtnClick;
// let restList = [];
// const listRestauarants = function() {
//     for (let x = 0; x < restaurants.length; x += 1) {
//         let eachRest = restaurants[x].getAttribute('restaurant');
//         new theSelector(eachRest, '#menuSelect');
//         restList += `#${eachrest}`;
//     }
//     new theButton('restSubmit', '#btnText');
//         //assign value to variable here  - cannot select until it's created (see restBtnClick.addEventListener('click', listMealTimes, false);)
//     restBtnClick = document.querySelector('#restSubmit');
// }


// //create the menu list with checkboxes - moved to constructor - keeping JIC
// // const restSelector = function(attrb) { 
// //     let newNode = document.createElement('input');
// //     let newNodeLabel = document.createElement('label');
// //     let nodeDescription = document.createTextNode(attrb);

// //     newNode.type = 'checkbox';
// //     newNode.value = attrb;
// //     newNodeLabel.for = attrb;

// //     newNodeLabel.appendChild(newNode);
// //     newNodeLabel.appendChild(nodeDescription);

// //     document.querySelector("#menuSelect").appendChild(newNodeLabel);
// // }

// //create mealtime list(s)

// const selectedRest = function() {
//     for(let x = 0; x < restList.length; x += 1) {
//         let localRest = document.querySelector(restList[x]);
//         if (localRest.checked) {

//             new theSelector
//         }
//     }
// }

// const listMealTimes = function() {
//     alert("button pushed, and I GOT CLASS!");
//     //find meal and time data
//     // populate meal and time data
//     // add click button 
// }

// listRestauarants();

// restBtnClick.addEventListener('click', listMealTimes, false);

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